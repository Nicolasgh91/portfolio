// api/chat.js — Vercel Edge Function
// Actúa como proxy entre el chatbot (browser) y Gemini API.
// La GEMINI_API_KEY vive en el servidor de Vercel, nunca llega al browser.

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Solo aceptar POST
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
  }

// Leer key y modelo desde variables de entorno del servidor
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  // Si no se define GEMINI_MODEL en el .env, usará gemini-2.5-flash por defecto
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'; 

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key no configurada en el servidor' }),
      { status: 500, headers: jsonHeaders() }
    );
  }

  // Parsear body enviado por el chatbot
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Body inválido' }),
      { status: 400, headers: jsonHeaders() }
    );
  }

  const { systemPrompt, history } = body;

  if (!history || !Array.isArray(history)) {
    return new Response(
      JSON.stringify({ error: 'history es requerido y debe ser un array' }),
      { status: 400, headers: jsonHeaders() }
    );
  }

  // Llamar a Gemini desde el servidor de forma dinámica
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt || '' }] },
          contents: history,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: err?.error?.message || `Gemini HTTP ${geminiRes.status}` }),
        { status: geminiRes.status, headers: jsonHeaders() }
      );
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta.';

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: jsonHeaders() }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Error interno: ${err.message}` }),
      { status: 500, headers: jsonHeaders() }
    );
  }
}

// ── Helpers ──────────────────────────────────
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    ...corsHeaders(),
  };
}