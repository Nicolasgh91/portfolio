/**
 * Circuit breaker reutilizable para Edge Functions.
 * Estados: CLOSED → OPEN → HALF_OPEN → CLOSED
 *
 * SEC-010
 */

const breakers = new Map();

/**
 * Envuelve una función asíncrona con circuit breaker.
 * @param {string} name - Identificador del circuito
 * @param {Function} fn - Función async a ejecutar
 * @param {Function} fallback - Función que devuelve valor por defecto
 * @param {Object} opts - { threshold: 3, cooldownMs: 60_000 }
 */
export function withBreaker(name, fn, fallback, opts = {}) {
  const { threshold = 3, cooldownMs = 60_000 } = opts;

  if (!breakers.has(name)) {
    breakers.set(name, { state: "CLOSED", failures: 0, lastFailure: 0 });
  }

  const b = breakers.get(name);

  // OPEN: no ejecutar, devolver fallback
  if (b.state === "OPEN") {
    if (Date.now() - b.lastFailure > cooldownMs) {
      b.state = "HALF_OPEN";
    } else {
      return Promise.resolve(fallback());
    }
  }

  // CLOSED o HALF_OPEN: intentar
  return fn().then(
    (result) => {
      b.failures = 0;
      b.state = "CLOSED";
      return result;
    },
    () => {
      b.failures++;
      b.lastFailure = Date.now();
      if (b.failures >= threshold) {
        b.state = "OPEN";
      }
      return fallback();
    },
  );
}
