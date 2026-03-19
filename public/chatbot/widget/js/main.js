/**
 * main.js
 * Orquestador principal. Responsabilidades:
 *   - Estado global (isOpen, isLoading, history, appData)
 *   - Toggle: cerrar = colapsa a ícono, ícono = restaura sesión
 *   - Init: carga datos, restaura sesión, muestra bienvenida
 *   - Coordina api.js + render.js + session.js
 */

import { loadData, buildSystemPrompt, callChatAPI } from './api.js';
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
function openChat() {
  isOpen = true;
  trigger.classList.add('open');
  chatWindow.classList.add('open');
  badge.style.opacity = '0';
  window.parent.postMessage({ chat: 'open' }, '*');
  setTimeout(() => input.focus(), 300);
}

function closeChat() {
  isOpen = false;
  trigger.classList.remove('open');
  chatWindow.classList.remove('open');
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
  if (e.data === 'chat:close' && isOpen) closeChat();
});

// ── Enviar mensaje ─────────────────────────────────────────────────────────
export async function sendMessage(text) {
  const trimmed = text?.trim() || input.value.trim();
  if (!trimmed || isLoading) return;

  input.value = '';
  input.style.height = 'auto';
  isLoading = true;
  sendBtn.disabled = true;

  appendMessage('user', trimmed);
  showTyping();

  try {
    const systemPrompt = buildSystemPrompt(appData);
    history.push({ role: 'user', parts: [{ text: trimmed }] });

    const reply = await callChatAPI({ systemPrompt, history });

    history.push({ role: 'model', parts: [{ text: reply }] });
    saveSession(history);

    removeTyping();
    const bubbleWrap = await appendStreamingMessage(reply);

    if (CONTACT_KEYWORDS.test(trimmed) && bubbleWrap) {
      const ctas = makeCTAs(appData.config);
      const copyBtn = bubbleWrap.querySelector('.copy-btn');
      bubbleWrap.insertBefore(ctas, copyBtn);
    }

  } catch (err) {
    removeTyping();
    appendMessage('bot', `Ups, hubo un error: ${err.message}. Intentá de nuevo.`);
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
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
  history = loadSession();

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
      appendMessage('bot', appData.config.chatbot.greeting, {
        quickReplies: [
          '¿Qué servicios ofrecés?',
          '¿Cuánto cuesta un chatbot?',
          '¿Trabajás con IA?',
          'Ver artículos del blog',
        ],
        onQuickReply: sendMessage,
      });
      if (!isOpen) badge.style.opacity = '1';
    }, 2500);
  }
}

init();