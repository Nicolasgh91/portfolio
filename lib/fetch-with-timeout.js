/**
 * Wrapper de fetch con timeout via AbortController.
 *
 * SEC-011
 *
 * Timeouts recomendados:
 *   Gemini API:       10_000 ms
 *   Supabase queries:  5_000 ms
 *   Supabase uploads: 15_000 ms
 */

export async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Timeout: la solicitud a ${new URL(url).hostname} excedió ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
