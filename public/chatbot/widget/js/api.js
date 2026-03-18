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

// ── System prompt ──────────────────────────────────────────────────────────
export function buildSystemPrompt({ config, services, articles }) {
  const o = config.owner;
  const c = config.chatbot;

  return `${c.persona}

## SOBRE ${o.name.toUpperCase()}
${o.bio || ''}
Ubicación: ${o.location || ''} | Idiomas: ${(o.languages || []).join(', ')} | ${o.availability || ''}

## SERVICIOS
${services.map(s => `### ${s.emoji || ''} ${s.title} — desde ${s.price_from}
${s.description}
Incluye: ${s.includes.join(', ')} | Stack: ${s.stack.join(', ')}
Entrega: ${s.delivery} | Ideal para: ${s.ideal_for}`).join('\n\n')}

## ARTÍCULOS DEL BLOG
${articles.map(a => `- "${a.title}" (${a.reading_time}): ${a.summary} → ${a.url}`).join('\n')}

## CONTACTO
WhatsApp: ${o.contact?.whatsapp || ''} | Email: ${o.contact?.email || ''} | Web: ${o.contact?.website || ''}

## INSTRUCCIONES
- Respondé en el idioma del usuario
- Sé concreto y útil, sin rodeos
- Si preguntan precios, dá el precio base y aclará que depende del proyecto
- Si hay interés en contratar, mencioná WhatsApp o email
- No inventes información fuera de este contexto
- Máximo 3-4 párrafos por respuesta`;
}

// ── Llamada a la Edge Function ─────────────────────────────────────────────
export async function callChatAPI({ systemPrompt, history }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.reply || 'Sin respuesta.';
}