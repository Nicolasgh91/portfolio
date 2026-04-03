import { withBreaker } from '../lib/circuit-breaker.js';
import { fetchWithTimeout } from '../lib/fetch-with-timeout.js';

export const config = { runtime: 'edge' };

// ── Config ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://www.escalatunegocioconia.com.ar',
  'https://escalatunegocioconia.com.ar',
  'https://www.escalatunegocioconia.com',
  'https://escalatunegocioconia.com',
];
const RATE_LIMIT       = 10;
const RATE_WINDOW_MS   = 60_000;
const MAX_HISTORY_LEN  = 20;
const MAX_MSG_CHARS    = 2_000;
const MAX_BODY_SIZE    = 50_000;
const DAILY_BUDGET     = 200;

// ── State (in-memory, per Edge instance) ────────────────────────────
const rateMap      = new Map();
let   dailyCount   = 0;
let   dailyResetAt = nextMidnight();

// Cache del system prompt por perfil (default | viandas)
const systemPromptCache = new Map();

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

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) || isLocalOrigin(origin);
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

function isLocalOrigin(origin) {
  return origin.includes('localhost') || origin.includes('127.0.0.1');
}

// ── SEC-001: Server-side system prompt ──────────────────────────────
async function loadJSON(path) {
  // En Vercel Edge, los archivos de public/ son accesibles via fetch
  // Usamos URL relativa al dominio actual
  const url = `https://escalatunegocioconia.com${path}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function buildSystemPrompt({ config, services, articles }) {
  const o = config.owner;
  const c = config.chatbot;
  const t = config.talento;

  const talentoBlock = t
    ? `## PERFIL TÉCNICO (${t.path || '/talento'})
${t.summary || ''}
${(t.projects || []).map((p) => `- ${p.title} (${p.slug}) — estado: ${p.status}`).join('\n')}`
    : '';

  const servicesBlock = (services || []).map((s) => {
    const inc = (s.includes || []).join(', ') || '—';
    const stk = (s.stack || []).join(', ') || '—';
    return `### ${s.emoji || ''} ${s.title} — desde ${s.price_from || 'consultar'}
${s.description || ''}
Incluye: ${inc} | Stack: ${stk}
Entrega: ${s.delivery || '—'} | Ideal para: ${s.ideal_for || '—'}`;
  }).join('\n\n');

  const articlesBlock =
    articles && articles.length > 0
      ? articles
          .map((a) => `- "${a.title}" (${a.reading_time}): ${a.summary} → ${a.url}`)
          .join('\n')
      : 'No hay artículos indexados en este contexto.';

  const isViandas = config.demo?.profile === 'viandas';

  const instructions = isViandas
    ? `- Respondé en el idioma del usuario
- Ayudá a armar pedidos con cantidades y platos del menú únicamente
- Si preguntan precios, usá solo los valores del menú
- Para cerrar: pedí nombre, zona y ventana horaria; derivá a WhatsApp
- No inventes platos, precios ni horarios fuera de este contexto
- Máximo 3-4 párrafos por respuesta`
    : `- Respondé en el idioma del usuario
- Sé concreto y útil, sin rodeos
- Si preguntan precios, dá el precio base y aclará que depende del proyecto
- Si hay interés en contratar, mencioná WhatsApp o email
- No inventes información fuera de este contexto
- Máximo 3-4 párrafos por respuesta`;

  return `${c.persona}

## SOBRE ${(o.name || 'EL NEGOCIO').toUpperCase()}
${o.bio || ''}
Ubicación: ${o.location || ''} | Idiomas: ${(o.languages || []).join(', ')} | ${o.availability || ''}

${talentoBlock}

## MENÚ / SERVICIOS
${servicesBlock}

## ARTÍCULOS DEL BLOG
${articlesBlock}

## CONTACTO
WhatsApp: ${o.contact?.whatsapp || ''} | Email: ${o.contact?.email || ''} | Web: ${o.contact?.website || ''}

## INSTRUCCIONES
${instructions}`;
}

/** Perfiles allowlist: solo datos estáticos en public/chatbot/data/ */
function resolveDataProfile(raw) {
  return raw === 'viandas' ? 'viandas' : 'default';
}

async function getSystemPrompt(profileKey) {
  const profile = resolveDataProfile(profileKey);
  if (systemPromptCache.has(profile)) return systemPromptCache.get(profile);

  try {
    const paths =
      profile === 'viandas'
        ? {
            config: '/chatbot/data/config-viandas.json',
            services: '/chatbot/data/services-viandas.json',
            articles: '/chatbot/data/articles-viandas.json',
          }
        : {
            config: '/chatbot/data/config.json',
            services: '/chatbot/data/services.json',
            articles: '/chatbot/data/articles.json',
          };

    const [cfg, services, articles] = await Promise.all([
      loadJSON(paths.config),
      loadJSON(paths.services),
      loadJSON(paths.articles),
    ]);
    const built = buildSystemPrompt({ config: cfg, services, articles });
    systemPromptCache.set(profile, built);
    return built;
  } catch (err) {
    console.error('[chat] Error loading prompt data:', err);
    const fallback = 'Sos un asistente profesional y amigable. Respondé en el idioma del usuario.';
    systemPromptCache.set(profile, fallback);
    return fallback;
  }
}

// ── Handler ─────────────────────────────────────────────────────────
export default async function handler(req) {
  const origin = req.headers.get('origin') || '';

  // ── Preflight (SEC-004) ───────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    const allowed = ALLOWED_ORIGINS.includes(origin) || isLocalOrigin(origin);
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowed ? origin : '',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    });
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);

  // ── Capa 1: origin (SEC-004) ──────────────────────────────────────
  const isLocal = isLocalOrigin(origin);
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
  if (origin && !isLocal && !isAllowedOrigin) {
    return json({ error: 'Origen no permitido.' }, 403, origin);
  }

  // ── Capa 2: Content-Type (SEC-006) ────────────────────────────────
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Content-Type debe ser application/json.' }, 415, origin);
  }

  // ── Capa 3: rate limit (SEC-002) ──────────────────────────────────
  const ip    = getIP(req);
  const now   = Date.now();
  const entry = rateMap.get(ip);

  let remaining = RATE_LIMIT;

  if (!entry || now > entry.r) {
    rateMap.set(ip, { c: 1, r: now + RATE_WINDOW_MS });
    remaining = RATE_LIMIT - 1;
  } else if (entry.c >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.r - now) / 1000);
    return new Response(
      JSON.stringify({ error: 'Demasiadas solicitudes. Intentá en un momento.' }),
      {
        status: 429,
        headers: {
          ...corsHeaders(origin),
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  } else {
    entry.c++;
    remaining = RATE_LIMIT - entry.c;
  }

  // ── Capa 4: payload (SEC-003) ─────────────────────────────────────
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_SIZE) {
    return json({ error: 'Solicitud demasiado grande.' }, 413, origin);
  }

  let body;
  try { body = JSON.parse(rawBody); }
  catch { return json({ error: 'JSON inválido.' }, 400, origin); }

  // SEC-001: systemPrompt ya no se acepta del cliente
  if (!Array.isArray(body.history)) {
    return json({ error: 'Formato inválido.' }, 400, origin);
  }

  const dataProfile = resolveDataProfile(body.profile);

  // SEC-003: Truncar history a últimos N mensajes y sanitizar
  const history = body.history.slice(-MAX_HISTORY_LEN).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(msg.parts?.[0]?.text || '').slice(0, MAX_MSG_CHARS) }],
  }));

  // ── Capa 5: budget diario ─────────────────────────────────────────
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = nextMidnight();
  }
  if (dailyCount >= DAILY_BUDGET) {
    return json({
      error: 'El asistente no está disponible en este momento. Contactame por WhatsApp o email.'
    }, 503, origin);
  }
  dailyCount++;

  // ── SEC-001: construir system prompt server-side ──────────────────
  const systemPrompt = await getSystemPrompt(dataProfile);

  // ── Llamada a Gemini ──────────────────────────────────────────────
  const GEMINI_KEY   = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!GEMINI_KEY) {
    console.error('[chat] GEMINI_API_KEY no configurada');
    return json({ error: 'Error procesando la solicitud. Intentá de nuevo.' }, 500, origin);
  }

  // SEC-010 + SEC-011: circuit breaker + timeout para Gemini
  const GEMINI_TIMEOUT = 10_000;
  const FALLBACK_MSG = 'Nuestro asistente no está disponible. Contactanos por WhatsApp.';

  try {
    const reply = await withBreaker(
      'gemini',
      async () => {
        const res = await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: history,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          },
          GEMINI_TIMEOUT
        );

        if (!res.ok) {
          console.error('[chat] Gemini error:', res.status);
          throw new Error(`Gemini ${res.status}`);
        }

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      },
      () => FALLBACK_MSG,
      { threshold: 3, cooldownMs: 60_000 }
    );

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        'X-RateLimit-Limit': String(RATE_LIMIT),
        'X-RateLimit-Remaining': String(remaining),
      },
    });
  } catch (err) {
    console.error('[chat] Error interno:', err);
    return json({ error: 'Error procesando la solicitud. Intentá de nuevo.' }, 500, origin);
  }
}
