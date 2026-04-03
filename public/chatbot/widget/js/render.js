/**
 * render.js
 * Responsabilidades:
 *   - Crear y agregar elementos al DOM del chat
 *   - Renderizar burbujas de usuario y bot
 *   - Efecto de streaming (texto aparece char a char)
 *   - Indicador de typing (tres puntos animados)
 *   - CTAs de contacto (WhatsApp / email)
 *   - Quick replies
 *   - Botón copiar
 *
 * No contiene lógica de negocio ni llamadas a API.
 * Recibe datos y los muestra — nada más.
 */

const messages = document.getElementById('chat-messages');

const COPY_ICON = `<svg width="10" height="10" fill="none" viewBox="0 0 24 24">
  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
</svg>`;

// ── Helpers de escape / markdown ───────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function markdownToHtml(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ── Avatares ───────────────────────────────────────────────────────────────
function makeBotAvatar() {
  const el = document.createElement('div');
  el.className = 'msg-avatar';
  el.innerHTML = 'nh<span style="color:var(--accent);font-size:13px;line-height:1">.</span>';
  return el;
}

function makeUserAvatar() {
  const el = document.createElement('div');
  el.className = 'msg-avatar';
  el.style.fontSize = '9px';
  el.textContent = 'tú';
  return el;
}

// ── Botón copiar ───────────────────────────────────────────────────────────
function makeCopyBtn(text) {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.innerHTML = `${COPY_ICON} Copiar`;
  btn.onclick = () => {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = `${COPY_ICON} Copiar`;
        btn.classList.remove('copied');
      }, 2000);
    });
  };
  return btn;
}

// ── CTAs de contacto ───────────────────────────────────────────────────────
export function makeCTAs(config) {
  const contact = config.owner.contact;
  const chatbot  = config.chatbot;
  const ctas = document.createElement('div');
  ctas.className = 'contact-ctas';

  if (contact?.whatsapp) {
    const wa = document.createElement('a');
    wa.className = 'cta-btn whatsapp';
    wa.href = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
    wa.target = '_blank';
    wa.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.556 4.115 1.527 5.842L.057 23.885l6.201-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-4.964-1.354l-.356-.211-3.683.966.983-3.595-.231-.369A9.795 9.795 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
    </svg>${chatbot.cta_whatsapp || 'WhatsApp'}`;
    ctas.appendChild(wa);
  }

  if (contact?.email) {
    const em = document.createElement('a');
    em.className = 'cta-btn email';
    em.href = `mailto:${contact.email}`;
    em.innerHTML = `<svg width="14" height="14" fill="none" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8"/>
      <path d="M22 6L12 13 2 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>${chatbot.cta_email || 'Email'}`;
    ctas.appendChild(em);
  }

  return ctas;
}

// ── Mensaje estático (usuario o bot sin streaming) ─────────────────────────
export function appendMessage(role, text, extras = {}) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;

  const avatar = role === 'bot' ? makeBotAvatar() : makeUserAvatar();

  const bubbleWrap = document.createElement('div');
  bubbleWrap.className = 'bubble-wrap';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = markdownToHtml(text);

  // Quick replies
  if (extras.quickReplies?.length) {
    const qr = document.createElement('div');
    qr.className = 'quick-replies';
    extras.quickReplies.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply';
      btn.textContent = label;
      btn.onclick = () => { qr.remove(); extras.onQuickReply?.(label); };
      qr.appendChild(btn);
    });
    bubble.appendChild(qr);
  }

  bubbleWrap.appendChild(bubble);

  if (role === 'bot') {
    if (extras.showContact && extras.config) {
      bubbleWrap.appendChild(makeCTAs(extras.config));
    }
    bubbleWrap.appendChild(makeCopyBtn(text));
  }

  wrap.appendChild(avatar);
  wrap.appendChild(bubbleWrap);
  messages.appendChild(wrap);
  scrollToBottom();
}

// ── Mensaje con efecto streaming ───────────────────────────────────────────
export function appendStreamingMessage(text) {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';

  const avatar = makeBotAvatar();
  const bubbleWrap = document.createElement('div');
  bubbleWrap.className = 'bubble-wrap';

  const bubble = document.createElement('div');
  bubble.className = 'bubble streaming-cursor';

  bubbleWrap.appendChild(bubble);
  wrap.appendChild(avatar);
  wrap.appendChild(bubbleWrap);
  messages.appendChild(wrap);

  const chars = [...text];
  let i = 0;

  return new Promise(resolve => {
    function tick() {
      if (i < chars.length) {
        i += Math.floor(Math.random() * 3) + 1;
        bubble.innerHTML = markdownToHtml(chars.slice(0, Math.min(i, chars.length)).join(''));
        scrollToBottom();
        setTimeout(tick, 10 + Math.random() * 8);
      } else {
        bubble.innerHTML = markdownToHtml(text);
        bubble.classList.remove('streaming-cursor');
        bubbleWrap.appendChild(makeCopyBtn(text));
        scrollToBottom();
        resolve(bubbleWrap);
      }
    }
    tick();
  });
}

// ── Typing indicator ───────────────────────────────────────────────────────
export function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.id = 'typing';

  const ind = document.createElement('div');
  ind.className = 'typing-indicator';
  ind.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;

  wrap.appendChild(makeBotAvatar());
  wrap.appendChild(ind);
  messages.appendChild(wrap);
  scrollToBottom();
}

export function removeTyping() {
  document.getElementById('typing')?.remove();
}

// ── Utilidades ─────────────────────────────────────────────────────────────
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}