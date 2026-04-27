import crypto from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import textToSpeech from "@google-cloud/text-to-speech";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src/content/blog");
const blogEnDir = path.join(rootDir, "src/content/blog-en");
const audioDir = path.join(rootDir, "public/audio");
const manifestPath = path.join(audioDir, "manifest.json");

const ENGINE = "google-cloud-tts-neural2";
const ENGINE_VERSION = process.env.TTS_ENGINE_VERSION ?? "1";
const MANIFEST_VERSION = "1.0";
const CHUNK_BYTE_LIMIT = Number(process.env.TTS_CHUNK_BYTE_LIMIT ?? 3000);
const DEFAULT_MAX_CHARS = 800000;
const MAX_CHARS = Number(process.env.TTS_MAX_CHARS ?? DEFAULT_MAX_CHARS);
const MAX_TTS_RETRIES = Number(process.env.TTS_MAX_RETRIES ?? 3);

const voices = {
  es: {
    name: process.env.TTS_ES_VOICE ?? "es-US-Neural2-B",
    languageCode: "es-US",
  },
  en: {
    name: process.env.TTS_EN_VOICE ?? "en-US-Neural2-J",
    languageCode: "en-US",
  },
};

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [rawKey, ...rawValue] = arg.replace(/^--/, "").split("=");
    return [rawKey, rawValue.length > 0 ? rawValue.join("=") : "true"];
  }),
);

const dryRun = args.has("dry-run");
const onlySlug = args.get("slug");

if (
  process.env.GOOGLE_TTS_SA_KEY_PATH &&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    rootDir,
    process.env.GOOGLE_TTS_SA_KEY_PATH,
  );
}

const nowIso = () => new Date().toISOString();

const stripJsonComments = (input) =>
  input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

const readJson = async (filePath, fallback) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
};

const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const listMdxFiles = async (directory) => {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => path.join(directory, entry.name))
      .sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const slugFromFile = (filePath) => path.basename(filePath, ".mdx");

const normalizeText = (input) =>
  input
    .replace(/\r\n?/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/^import\s.+$/gm, " ")
    .replace(/^export\s.+$/gm, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\{[^{}\n]*\}/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const readPost = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  return {
    slug: slugFromFile(filePath),
    data: parsed.data,
    text: normalizeText(parsed.content),
  };
};

const textHash = ({ slug, lang, voice, text }) =>
  crypto
    .createHash("sha256")
    .update([slug, lang, voice, text, ENGINE_VERSION].join("\0"))
    .digest("hex")
    .slice(0, 8);

const byteLength = (value) => Buffer.byteLength(value, "utf8");

const splitText = (text) => {
  const sentences = text.match(/[^.!?;:]+[.!?;:]?|.+$/g) ?? [text];
  const chunks = [];
  let current = "";

  const flushWords = (value) => {
    const words = value.split(/\s+/).filter(Boolean);
    let chunk = "";

    for (const word of words) {
      const next = chunk ? `${chunk} ${word}` : word;
      if (byteLength(next) > CHUNK_BYTE_LIMIT && chunk) {
        chunks.push(chunk);
        chunk = word;
      } else {
        chunk = next;
      }
    }

    if (chunk) chunks.push(chunk);
  };

  for (const sentence of sentences.map((item) => item.trim()).filter(Boolean)) {
    if (byteLength(sentence) > CHUNK_BYTE_LIMIT) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      flushWords(sentence);
      continue;
    }

    const next = current ? `${current} ${sentence}` : sentence;
    if (byteLength(next) > CHUNK_BYTE_LIMIT) {
      chunks.push(current);
      current = sentence;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
};

const estimateDurationSeconds = (text) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round((words / 150) * 60));
};

const createManifest = (articles = {}) => ({
  version: MANIFEST_VERSION,
  engine: ENGINE,
  engine_version: ENGINE_VERSION,
  generated: nowIso(),
  articles,
});

const getClient = (() => {
  let client;
  return () => {
    if (!client) client = new textToSpeech.TextToSpeechClient();
    return client;
  };
})();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const synthesizeChunk = async ({ chunk, voice, attempt = 1 }) => {
  const client = getClient();

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text: chunk },
      voice,
      audioConfig: { audioEncoding: "MP3" },
    });

    if (!response.audioContent) {
      throw new Error("Google Cloud TTS returned an empty audio response.");
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    if (attempt >= MAX_TTS_RETRIES) throw error;

    const code = error?.code;
    const isTransient = code === 4 || code === 10 || code === 13 || code === 14;
    if (!isTransient) throw error;

    const retryDelay = 1000 * attempt;
    console.log(`  transient TTS error; retrying in ${retryDelay}ms`);
    await wait(retryDelay);
    return synthesizeChunk({ chunk, voice, attempt: attempt + 1 });
  }
};

const synthesizeMp3 = async ({ text, voice }) => {
  const chunks = splitText(text);
  const buffers = [];

  for (const [index, chunk] of chunks.entries()) {
    console.log(`  TTS chunk ${index + 1}/${chunks.length}`);
    buffers.push(await synthesizeChunk({ chunk, voice }));
  }

  return Buffer.concat(buffers);
};

const collectEntries = async () => {
  const [spanishFiles, englishFiles] = await Promise.all([
    listMdxFiles(blogDir),
    listMdxFiles(blogEnDir),
  ]);
  const englishBySlug = new Map(
    englishFiles.map((file) => [slugFromFile(file), file]),
  );
  const entries = [];

  for (const file of spanishFiles) {
    const spanish = await readPost(file);
    if (spanish.data.draft === true) continue;
    if (onlySlug && spanish.slug !== onlySlug) continue;

    entries.push({ slug: spanish.slug, lang: "es", text: spanish.text });

    const englishFile = englishBySlug.get(spanish.slug);
    if (englishFile) {
      const english = await readPost(englishFile);
      if (english.text) {
        entries.push({ slug: spanish.slug, lang: "en", text: english.text });
      }
    }
  }

  return entries;
};

const removeOrphanMp3s = async (validFiles) => {
  const files = await fs.readdir(audioDir);
  const mp3Files = files.filter((file) => file.endsWith(".mp3"));

  for (const file of mp3Files) {
    if (validFiles.has(file)) continue;
    const filePath = path.join(audioDir, file);
    console.log(`Removing orphan audio ${file}`);
    await fs.unlink(filePath);
  }
};

const assertCredentials = () => {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath || !existsSync(credentialsPath)) {
    throw new Error(
      "Missing Google credentials. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_SA_KEY_PATH before generating audio.",
    );
  }
};

const main = async () => {
  await fs.mkdir(audioDir, { recursive: true });

  const manifest = createManifest(
    (await readJson(manifestPath, createManifest())).articles ?? {},
  );
  const entries = await collectEntries();
  const validAudioFiles = new Set();
  const pending = [];

  for (const entry of entries) {
    const voice = voices[entry.lang];
    const hash = textHash({ ...entry, voice: voice.name });
    const file = `${entry.slug}.${entry.lang}.mp3`;
    validAudioFiles.add(file);

    const current = manifest.articles?.[entry.slug]?.[entry.lang];
    if (current?.hash === hash && current?.file === file) {
      console.log(`Skipping ${entry.slug} (${entry.lang}); hash unchanged.`);
      continue;
    }

    pending.push({ ...entry, voice, hash, file });
  }

  const pendingChars = pending.reduce(
    (total, entry) => total + entry.text.length,
    0,
  );
  console.log(
    `${pending.length} audio file(s) pending; ${pendingChars.toLocaleString("en-US")} character(s).`,
  );

  if (pendingChars > MAX_CHARS) {
    throw new Error(
      `Pending TTS text has ${pendingChars} characters, above TTS_MAX_CHARS=${MAX_CHARS}.`,
    );
  }

  if (dryRun) {
    for (const entry of pending) {
      console.log(
        `[dry-run] ${entry.slug} (${entry.lang}) -> ${entry.file}, hash ${entry.hash}`,
      );
    }
    return;
  }

  if (pending.length > 0) assertCredentials();

  for (const entry of pending) {
    console.log(`Generating ${entry.file} with ${entry.voice.name}`);
    const audio = await synthesizeMp3({ text: entry.text, voice: entry.voice });
    await fs.writeFile(path.join(audioDir, entry.file), audio);

    manifest.articles[entry.slug] ??= {};
    manifest.articles[entry.slug][entry.lang] = {
      file: entry.file,
      hash: entry.hash,
      voice: entry.voice.name,
      duration_seconds: estimateDurationSeconds(entry.text),
      size_bytes: audio.byteLength,
      generated_at: nowIso(),
    };
  }

  for (const slug of Object.keys(manifest.articles)) {
    if (onlySlug && slug !== onlySlug) continue;

    for (const lang of Object.keys(manifest.articles[slug])) {
      const manifestFile = manifest.articles[slug][lang].file;
      if (validAudioFiles.has(manifestFile)) continue;
      delete manifest.articles[slug][lang];
    }
    if (Object.keys(manifest.articles[slug]).length === 0) {
      delete manifest.articles[slug];
    }
  }

  if (!onlySlug) await removeOrphanMp3s(validAudioFiles);
  manifest.generated = nowIso();
  await writeJson(manifestPath, manifest);
  console.log(`Updated ${path.relative(rootDir, manifestPath)}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
