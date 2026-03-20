/**
 * api.js
 * Responsabilidades:
 *   1. Cargar los JSON de datos (config, services, articles)
 *   2. Construir el system prompt con esos datos
 *   3. Llamar a la Vercel Edge Function /api/chat (proxy seguro a Gemini)
 *
 * La API key NUNCA toca este archivo — vive en el servidor (api/chat.js).
 */

// ── Fallback para desarrollo sin servidor ──────────────────────────────────
const FALLBACK_CONFIG = {
  owner: {
    name: "Tu Nombre",
    bio: "",
    location: "",
    languages: [],
    availability: "Consultar",
    contact: { whatsapp: "", email: "", website: "" }
  },
  chatbot: {
    name: "Asistente",
    greeting: "¡Hola! ¿En qué puedo ayudarte?",
    cta_whatsapp: "Escribime por WhatsApp",
    cta_email: "Contactame por email",
    persona: "Sos un asistente profesional y amigable."
  },
  branding: {}
};

// ── Carga de datos ─────────────────────────────────────────────────────────
export async function loadData() {
  try {
    const [config, services, articles] = await Promise.all([
      fetch('/chatbot/data/config.json').then(r => r.json()),
      fetch('/chatbot/data/services.json').then(r => r.json()),
      fetch('/chatbot/data/articles.json').then(r => r.json()),
    ]);
    return { config, services, articles };
  } catch {
    return { config: FALLBACK_CONFIG, services: [], articles: [] };
  }
}

// ── Llamada a la Edge Function ─────────────────────────────────────────────
// SEC-001: systemPrompt se construye server-side, ya no se envía desde el cliente
export async function callChatAPI({ history }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.reply || 'Sin respuesta.';
}