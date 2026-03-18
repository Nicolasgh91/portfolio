/**
 * session.js
 * Persiste el historial de conversación en sessionStorage.
 * Al navegar entre páginas del sitio, el iframe se recarga pero
 * la sesión del browser se mantiene — el usuario no pierde la conversación.
 *
 * Formato del historial: Array de { role: 'user'|'model', parts: [{ text }] }
 * (compatible con la API de Gemini)
 */

const SESSION_KEY = 'chat_history';

export function saveSession(history) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(history));
  } catch {
    // sessionStorage lleno o bloqueado: falla silenciosamente
  }
}

export function loadSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}