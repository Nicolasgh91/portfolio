#!/usr/bin/env node
/**
 * Guard against raw hex colors leaking back into components.
 *
 * Rule: any `#RGB`, `#RRGGBB`, or `#RRGGBBAA` literal under src/ outside
 * `src/styles/tokens.css` is a violation, unless the line carries an
 * `allow-raw-hex` marker (HTML/JS/TS comment) explaining why.
 *
 * Token system lives in `src/styles/tokens.css`; everything else should
 * consume `var(--token-name)` or Tailwind utilities backed by tokens.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SRC_DIR = join(ROOT, "src");
const ALLOWED_FILES = new Set([join("src", "styles", "tokens.css")]);
const FILE_EXTS = new Set([".astro", ".css", ".ts", ".tsx", ".js", ".jsx"]);

// Hex literal that's a real color. Skip anchors (#hash-id only when not in
// a CSS-ish context) by ignoring matches preceded by `=`/`href`/`url(`
// — anchor URLs and SVG fragment refs aren't colors.
const HEX = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      yield* walk(full);
    } else if (FILE_EXTS.has(getExt(entry))) {
      yield full;
    }
  }
}

function getExt(name) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot);
}

function hasMarker(lines, index) {
  // Allow the marker on the offending line or up to 8 lines above
  // (to support a `{/* allow-raw-hex */}` comment placed before a JSX
  // block of decorative literals such as a multi-attribute <svg>).
  const start = Math.max(0, index - 8);
  for (let i = start; i <= index; i += 1) {
    if (/allow-raw-hex/.test(lines[i])) return true;
  }
  return false;
}

function isLikelyAnchorOrId(matchIndex, line) {
  // Skip url fragments (#anchor) and SVG references like url(#foo) or
  // xlink:href="#foo" by checking the preceding character context.
  const before = line.slice(Math.max(0, matchIndex - 6), matchIndex);
  return /href=["']$|url\(\s*$|xlink:href=["']$/.test(before);
}

const violations = [];
for (const file of walk(SRC_DIR)) {
  const rel = relative(ROOT, file);
  if (ALLOWED_FILES.has(rel)) continue;
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (hasMarker(lines, i)) return;
    HEX.lastIndex = 0;
    let m;
    while ((m = HEX.exec(line)) !== null) {
      if (isLikelyAnchorOrId(m.index, line)) continue;
      violations.push({
        file: rel,
        line: i + 1,
        col: m.index + 1,
        match: m[0],
        snippet: line.trim(),
      });
    }
  });
}

if (violations.length > 0) {
  console.error(
    `\nRaw hex color literals found outside src/styles/tokens.css.\n` +
      `Replace with a token (var(--...)) or add an "allow-raw-hex: <reason>" ` +
      `comment on the line if intentional.\n`,
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.col}  ${v.match}`);
    console.error(`    ${v.snippet}`);
  }
  console.error(`\n${violations.length} violation(s).`);
  process.exit(1);
}

console.log("No raw hex violations found.");
