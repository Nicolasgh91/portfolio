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

// ── Perfil demo (debe coincidir con allowlist en api/chat.js) ─────────────
function getDataProfile() {
  try {
    const q = new URLSearchParams(window.location.search);
    return q.get('demo') === 'viandas' ? 'viandas' : 'default';
  } catch {
    return 'default';
  }
}

// ── Carga de datos ─────────────────────────────────────────────────────────
export async function loadData() {
  const profile = getDataProfile();
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

  try {
    const [config, services, articles] = await Promise.all([
      fetch(paths.config).then((r) => r.json()),
      fetch(paths.services).then((r) => r.json()),
      fetch(paths.articles).then((r) => r.json()),
    ]);
    return { config, services, articles, profile };
  } catch {
    return { config: FALLBACK_CONFIG, services: [], articles: [], profile: 'default' };
  }
}

// ── Llamada a la Edge Function ─────────────────────────────────────────────
// SEC-001: systemPrompt se construye server-side, ya no se envía desde el cliente
export async function callChatAPI({ history, profile }) {
  const prof = profile === 'viandas' ? 'viandas' : undefined;
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof ? { history, profile: prof } : { history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.reply || 'Sin respuesta.';
}