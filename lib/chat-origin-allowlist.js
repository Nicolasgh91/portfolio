/**
 * SEC-004: strict Origin checks for /api/chat CORS (Edge-safe, no deps).
 * @param {string} origin
 * @returns {boolean}
 */
function canonicalHostname(hostname) {
  const h = hostname.toLowerCase();
  if (h.startsWith("[") && h.endsWith("]")) return h.slice(1, -1);
  return h;
}

export function isLocalOrigin(origin) {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const h = canonicalHostname(u.hostname);
    return h === "localhost" || h === "127.0.0.1" || h === "::1";
  } catch {
    return false;
  }
}

/**
 * Build hostname set for this Vercel deployment (system env + canonical project host).
 * @param {Record<string, string | undefined>} env
 * @returns {Set<string>}
 */
export function vercelDeploymentHostnames(env) {
  const hosts = new Set();
  const project = String(env.VERCEL_PROJECT_NAME ?? "")
    .toLowerCase()
    .trim();
  if (project) hosts.add(`${project}.vercel.app`);
  for (const key of ["VERCEL_URL", "VERCEL_BRANCH_URL"]) {
    const raw = env[key];
    if (!raw) continue;
    const host = String(raw)
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//i, "")
      .split("/")[0];
    if (host) hosts.add(host);
  }
  return hosts;
}

/**
 * True when Origin is https and hostname matches this deployment's Vercel hostnames.
 * @param {string} origin
 * @param {Record<string, string | undefined>} [env]
 */
export function isVercelDeploymentOrigin(origin, env = process.env) {
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return vercelDeploymentHostnames(env).has(host);
  } catch {
    return false;
  }
}
