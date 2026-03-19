export const config = { runtime: 'edge' };

// ── Config ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://www.escalatunegocioconia.com.ar',
  'https://escalatunegocioconia.com.ar',
];
const RATE_LIMIT       = 8;
const RATE_WINDOW_MS   = 60_000;
const MAX_HISTORY_LEN  = 20;
const MAX_MSG_CHARS    = 500;
const MAX_BODY_SIZE    = 50_000;
const DAILY_BUDGET     = 200;

// ── State (in-memory, per Edge instance) ────────────────────────────
const rateMap      = new Map();
let   dailyCount   = 0;
let   dailyResetAt = nextMidnight();

function nextMidnight() {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

// ── Helpers ─────────────────────────────────────────────────────────
function getIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ── Handler ─────────────────────────────────────────────────────────
export default async function handler(req) {
  // Preflight
  if (req.method === 'OPTIONS') return json({});
  if (req.method !== 'POST')   return json({ error: 'Method not allowed' }, 405);

  // ── Capa 1: origin ────────────────────────────────────────────────
  const origin  = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isAllowedOrigin = ALLOWED_ORIGINS.some(o =>
    origin.startsWith(o) || referer.startsWith(o)
  );
  if (!isLocal && !isAllowedOrigin) {
    return json({ error: 'Forbidden' }, 403);
  }

  // ── Capa 2: rate limit ────────────────────────────────────────────
  const ip    = getIP(req);
  const now   = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.r) {
    rateMap.set(ip, { c: 1, r: now + RATE_WINDOW_MS });
  } else if (entry.c >= RATE_LIMIT) {
    return json({ error: 'Demasiadas solicitudes. Intentá en un momento.' }, 429);
  } else {
    entry.c++;
  }

  // ── Capa 3: payload ───────────────────────────────────────────────
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_SIZE) {
    return json({ error: 'Payload demasiado grande' }, 400);
  }

  let body;
  try { body = JSON.parse(rawBody); }
  catch { return json({ error: 'JSON inválido' }, 400); }

  if (!body.systemPrompt || !Array.isArray(body.history)) {
    return json({ error: 'Formato inválido' }, 400);
  }

  const lastMsg = body.history[body.history.length - 1];
  if (lastMsg?.parts?.[0]?.text?.length > MAX_MSG_CHARS) {
    return json({ error: 'Mensaje demasiado largo' }, 400);
  }

  // Truncar historial silenciosamente
  if (body.history.length > MAX_HISTORY_LEN * 2) {
    body.history = body.history.slice(-(MAX_HISTORY_LEN * 2));
  }

  // ── Capa 4: budget diario ─────────────────────────────────────────
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = nextMidnight();
  }
  if (dailyCount >= DAILY_BUDGET) {
    return json({
      error: 'El asistente no está disponible en este momento. Contactame por WhatsApp o email.'
    }, 503);
  }
  dailyCount++;

  // ── Llamada a Gemini ──────────────────────────────────────────────
  const GEMINI_KEY   = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!GEMINI_KEY) return json({ error: 'Config error' }, 500);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: body.systemPrompt }] },
          contents: body.history,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini error:', err);
      return json({ error: 'Error del modelo' }, 502);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return json({ reply });
  } catch (err) {
    console.error('Fetch error:', err);
    return json({ error: 'Error interno' }, 500);
  }
}