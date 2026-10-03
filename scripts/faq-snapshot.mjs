#!/usr/bin/env node
/**
 * Snapshot SEO/SSR de las rutas con FAQ, para comparar antes/después de un
 * refactor visual sin depender de inspección manual.
 *
 * Uso:
 *   node scripts/faq-snapshot.mjs --dist dist --out before.json
 *   node scripts/faq-snapshot.mjs --diff before.json after.json
 *
 * `--diff` termina con código 1 si hay diferencias fuera de la allowlist:
 * se permiten cambios en `<script src>` (bundles), ±5% de bytes de HTML y la
 * desaparición del glifo "+" del ícono (pasa a SVG decorativo).
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const FAQ_ROUTES = [
  "servicios",
  "en/services",
  "plantillas",
  "en/templates",
  "oferta/hub-creadores",
  "en/offer/creator-hub",
];

const sha = (s) => createHash("sha256").update(s).digest("hex");

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

function textOf(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
}

export function snapshotHtml(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map((m) => m[0]);
  const jsonLd = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);
  const faqPage = jsonLd
    .map((b) => JSON.parse(b))
    .find((d) => d["@type"] === "FAQPage");
  const body = html.slice(html.search(/<body\b/i));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const headings = (lvl) =>
    [...html.matchAll(new RegExp(`<h${lvl}\\b[\\s\\S]*?</h${lvl}>`, "gi"))].map(
      (m) => textOf(m[0]),
    );
  return {
    bytes: Buffer.byteLength(html),
    lang: attr(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang"),
    canonical: attr(
      html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "",
      "href",
    ),
    hreflang: [...html.matchAll(/<link[^>]*hreflang="[^"]*"[^>]*>/gi)].map(
      (m) => `${attr(m[0], "hreflang")}=${attr(m[0], "href")}`,
    ),
    jsonLdHashes: jsonLd.map(sha),
    faqMainEntity: faqPage
      ? faqPage.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])
      : null,
    h1: headings(1),
    h2: headings(2),
    links: [
      ...new Set([
        ...body.matchAll(/<a\b[^>]*href="([^"]*)"/gi).map((m) => m[1]),
      ]),
    ].sort(),
    scriptSrcs: scripts.map((t) => attr(t, "src")).filter(Boolean),
    inlineExecutableScripts: scripts.filter(
      (t) => !attr(t, "src") && attr(t, "type") !== "application/ld+json",
    ).length,
    duplicateIds: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
    // El glifo "+" del ícono viejo se normaliza: el nuevo ícono es SVG.
    visibleText: textOf(body)
      .replace(/(^| )\+(?= |$)/g, "$1")
      .replace(/\s+/g, " "),
  };
}

function snapshotDist(dist) {
  const out = {};
  for (const route of FAQ_ROUTES) {
    out[route] = snapshotHtml(
      readFileSync(join(dist, route, "index.html"), "utf8"),
    );
  }
  return out;
}

function diff(a, b) {
  const problems = [];
  for (const route of FAQ_ROUTES) {
    const x = a[route];
    const y = b[route];
    for (const key of [
      "lang",
      "canonical",
      "hreflang",
      "jsonLdHashes",
      "faqMainEntity",
      "h1",
      "h2",
      "links",
      "visibleText",
    ]) {
      if (JSON.stringify(x[key]) !== JSON.stringify(y[key])) {
        problems.push(`${route}: "${key}" cambió`);
        if (key === "visibleText") {
          const i = [...x[key]].findIndex((c, k) => c !== y[key][k]);
          problems.push(
            `  antes:   …${x[key].slice(Math.max(0, i - 80), i + 80)}…`,
            `  después: …${y[key].slice(Math.max(0, i - 80), i + 80)}…`,
          );
        }
      }
    }
    if (y.inlineExecutableScripts > 0)
      problems.push(
        `${route}: ${y.inlineExecutableScripts} <script> inline ejecutables (CSP)`,
      );
    if (y.duplicateIds.length > x.duplicateIds.length)
      problems.push(
        `${route}: IDs duplicados nuevos: ${y.duplicateIds.join(", ")}`,
      );
    const delta = (y.bytes - x.bytes) / x.bytes;
    if (Math.abs(delta) > 0.05)
      problems.push(
        `${route}: bytes HTML ${x.bytes} → ${y.bytes} (${(delta * 100).toFixed(1)}%)`,
      );
    const removed = x.scriptSrcs.filter((s) => !y.scriptSrcs.includes(s));
    const added = y.scriptSrcs.filter((s) => !x.scriptSrcs.includes(s));
    console.log(
      `${route}: bytes ${x.bytes} → ${y.bytes} (${(delta * 100).toFixed(1)}%), scripts ${x.scriptSrcs.length} → ${y.scriptSrcs.length}` +
        (removed.length ? `\n  − ${removed.join("\n  − ")}` : "") +
        (added.length ? `\n  + ${added.join("\n  + ")}` : ""),
    );
  }
  return problems;
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

if (args.includes("--diff")) {
  const i = args.indexOf("--diff");
  const [a, b] = [args[i + 1], args[i + 2]].map((f) =>
    JSON.parse(readFileSync(f, "utf8")),
  );
  const problems = diff(a, b);
  if (problems.length) {
    console.error(
      `\n✗ ${problems.length} diferencia(s) fuera de la allowlist:\n${problems.join("\n")}`,
    );
    process.exit(1);
  }
  console.log("\n✓ Sin regresiones SSR/SEO en las rutas FAQ");
} else if (flag("--out")) {
  writeFileSync(
    flag("--out"),
    JSON.stringify(snapshotDist(flag("--dist") ?? "dist"), null, 2),
  );
  console.log(`snapshot → ${flag("--out")}`);
}
