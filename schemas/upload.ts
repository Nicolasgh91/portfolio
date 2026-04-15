import { z } from "zod";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const UploadSchema = z.object({
  filename: z
    .string()
    .max(200)
    .regex(/^[a-zA-Z0-9._-]+$/, "Nombre de archivo inválido")
    .describe("Nombre seguro del archivo (alfanumérico, punto, guiones)."),
  mimeType: z
    .enum(ALLOWED_MIME_TYPES)
    .describe("Tipo MIME declarado; debe coincidir con magic bytes."),
  size: z
    .number()
    .positive()
    .max(MAX_FILE_SIZE)
    .describe("Tamaño en bytes; no mayor que MAX_FILE_SIZE."),
});

export const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // RIFF header
};

export function validateMagicBytes(
  buffer: ArrayBuffer,
  declaredMime: string,
): boolean {
  const expected = MAGIC_BYTES[declaredMime];
  if (!expected) return false;
  const bytes = new Uint8Array(buffer).slice(0, expected.length);
  return expected.every((b, i) => bytes[i] === b);
}
