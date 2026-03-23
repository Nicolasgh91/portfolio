/**
 * session.js
 * Persiste el historial de conversación en sessionStorage.
 * Al navegar entre páginas del sitio, el iframe se recarga pero
 * la sesión del browser se mantiene — el usuario no pierde la conversación.
 *
 * Formato del historial: Array de { role: 'user'|'model', parts: [{ text }] }
 * (compatible con la API de Gemini)
 */

const SESSION_PREFIX = 'nh_chat_history_';

function sessionKey(profile) {
  return SESSION_PREFIX + (profile === 'viandas' ? 'viandas' : 'default');
}

export function saveSession(history, profile = 'default') {
  try {
    sessionStorage.setItem(sessionKey(profile), JSON.stringify(history));
  } catch {
    // sessionStorage lleno o bloqueado: falla silenciosamente
  }
}

export function loadSession(profile = 'default') {
  try {
    const stored = sessionStorage.getItem(sessionKey(profile));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearSession(profile = 'default') {
  try {
    sessionStorage.removeItem(sessionKey(profile));
  } catch {}
}