#!/usr/bin/env node
/**
 * Calcula los hashes SHA-256 de los scripts inline del widget del chatbot.
 *
 * Uso:
 *   node scripts/csp-hash.mjs
 *
 * Si modificás los <script> inline de public/chatbot/widget/index.html,
 * corré esto y actualizá los valores 'sha256-...' del header
 * Content-Security-Policy en vercel.json (ruta /chatbot/widget/(.*)).
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = resolve(__dirname, '../public/chatbot/widget/index.html');
const html = readFileSync(file, 'utf8');

// Captura solo <script> sin atributos (los inline). Los <script type="module">
// se cargan como recursos externos y no necesitan hash.
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

if (matches.length === 0) {
  console.error('No se encontraron scripts inline en', file);
  process.exit(1);
}

console.log(`Encontrados ${matches.length} scripts inline en ${file}\n`);
for (const [i, [, body]] of matches.entries()) {
  const hash = createHash('sha256').update(body, 'utf8').digest('base64');
  console.log(`Script ${i + 1}: 'sha256-${hash}'`);
}
