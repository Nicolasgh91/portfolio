/**
 * main.js
 * Orquestador principal. Responsabilidades:
 *   - Estado global (isOpen, isLoading, history, appData)
 *   - Toggle: cerrar = colapsa a ícono, ícono = restaura sesión
 *   - Init: carga datos, restaura sesión, muestra bienvenida
 *   - Coordina api.js + render.js + session.js
 */

import { loadData, callChatAPI } from './api.js';
import {
  appendMessage,
  appendStreamingMessage,
  showTyping,
  removeTyping,
  makeCTAs,
} from './render.js';
import { saveSession, loadSession } from './session.js';

// ── Estado ─────────────────────────────────────────────────────────────────
let appData   = null;
let history   = [];
let isOpen    = false;
let isLoading = false;

// ── DOM refs ───────────────────────────────────────────────────────────────
const trigger    = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const input      = document.getElementById('chat-input');
const sendBtn    = document.getElementById('send-btn');
const badge      = document.getElementById('chat-badge');
const headerName = document.getElementById('header-name');
const closeBtn   = document.getElementById('close-btn');

// ── Keywords que disparan CTAs de contacto ─────────────────────────────────
const CONTACT_KEYWORDS = /presupuesto|precio|costo|contratar|trabajar|proyecto|cotiz|contact|whatsapp|email|llamar/i;

// ── Abrir / cerrar ─────────────────────────────────────────────────────────
// Cerrar (cruz): colapsa la ventana, el ícono queda visible
// Click en ícono: restaura la ventana exactamente como estaba
function syncTriggerA11y() {
  trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  trigger.setAttribute('aria-label', isOpen ? 'Cerrar chat' : 'Abrir chat');
}

function openChat() {
  isOpen = true;
  trigger.classList.add('open');
  chatWindow.classList.add('open');
  badge.style.opacity = '0';
  syncTriggerA11y();
  window.parent.postMessage({ chat: 'open' }, '*');
  setTimeout(() => input.focus(), 300);
}

function closeChat() {
  isOpen = false;
  trigger.classList.remove('open');
  chatWindow.classList.remove('open');
  syncTriggerA11y();
  window.parent.postMessage({ chat: 'close' }, '*');
}

trigger.addEventListener('click', () => {
  if (!isOpen) openChat();
  else closeChat();
});

closeBtn.addEventListener('click', e => {
  e.stopPropagation();
  closeChat();
});

// ── Cerrar desde el padre (click fuera del iframe) ──────────────────────────
window.addEventListener('message', e => {
  if (e.source !== window.parent) return;
  if (e.data === 'chat:close' && isOpen) closeChat();
});

// ── Enviar mensaje ─────────────────────────────────────────────────────────
const MAX_INPUT = 2_000; // SEC-003: límite de caracteres por mensaje

export async function sendMessage(text) {
  // SEC-003: truncar input del lado del cliente
  const trimmed = (text?.trim() || input.value.trim()).slice(0, MAX_INPUT);
  if (!trimmed || isLoading) return;

  input.value = '';
  input.style.height = 'auto';

  // SEC-008: inhabilitar input completo durante carga
  isLoading = true;
  sendBtn.disabled = true;
  input.disabled = true;
  input.placeholder = 'Esperando respuesta...';

  appendMessage('user', trimmed);
  showTyping();

  try {
    // SEC-001: systemPrompt se construye server-side
    history.push({ role: 'user', parts: [{ text: trimmed }] });

    const reply = await callChatAPI({
      history,
      profile: appData?.profile,
    });

    history.push({ role: 'model', parts: [{ text: reply }] });
    saveSession(history, appData?.profile || 'default');

    removeTyping();
    const bubbleWrap = await appendStreamingMessage(reply);

    if (CONTACT_KEYWORDS.test(trimmed) && bubbleWrap) {
      const ctas = makeCTAs(appData.config);
      const copyBtn = bubbleWrap.querySelector('.copy-btn');
      bubbleWrap.insertBefore(ctas, copyBtn);
    }

  } catch (err) {
    removeTyping();
    // SEC-007: no exponer err.message al usuario
    const isRateLimit = err.message?.includes('429') || err.message?.includes('Demasiadas');
    const userMessage = isRateLimit
      ? 'Estás enviando mensajes muy rápido. Esperá un momento e intentá de nuevo.'
      : 'Nuestro asistente no está disponible en este momento. Podés contactarnos por WhatsApp.';

    appendMessage('bot', userMessage, {
      showContact: true,
      config: appData.config,
    });
  } finally {
    // SEC-008: rehabilitar input
    isLoading = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.placeholder = 'Escribí tu mensaje...';
    input.focus();
  }
}

// ── Eventos de input ───────────────────────────────────────────────────────
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 110) + 'px';
});

sendBtn.addEventListener('click', () => sendMessage());

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
  appData = await loadData();
  history = loadSession(appData.profile || 'default');

  headerName.textContent = appData.config.owner?.name || 'Asistente';

  // Mailto funcional: el nombre en el header abre el cliente de email
  const email = appData.config.owner?.contact?.email;
  if (email) {
    headerName.href = `mailto:${email}`;
    headerName.title = `Enviar email a ${email}`;
  } else {
    headerName.removeAttribute('href');
    headerName.style.cursor = 'default';
  }

  if (history.length > 0) {
    // Restaurar conversación previa sin delay
    history.forEach(msg => {
      const role = msg.role === 'user' ? 'user' : 'bot';
      appendMessage(role, msg.parts[0].text);
    });
  } else {
    // Primera visita: bienvenida con delay para sentirse natural
    setTimeout(() => {
      const defaultQuick = [
        '¿Qué servicios ofrecés?',
        '¿Cuánto cuesta un chatbot?',
        '¿Trabajás con IA?',
        'Ver artículos del blog',
      ];
      const qr = appData.config.chatbot.quick_replies || defaultQuick;
      appendMessage('bot', appData.config.chatbot.greeting, {
        quickReplies: qr,
        onQuickReply: sendMessage,
      });
      if (!isOpen) badge.style.opacity = '1';
    }, 2500);
  }
}

init();