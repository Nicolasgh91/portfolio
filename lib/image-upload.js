/**
 * Módulo de validación y upload de imágenes.
 *
 * SEC-014
 *
 * Flujo: tamaño → magic bytes → MIME → rename UUID → upload Supabase Storage
 */

import { validateMagicBytes, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../schemas/upload.ts';

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Valida y sube una imagen a Supabase Storage.
 * @param {File} file - Archivo del FormData
 * @param {string} ownerId - UUID del usuario autenticado
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Cliente Supabase
 * @returns {Promise<string>} URL pública del archivo subido
 */
export async function processImageUpload(file, ownerId, supabase) {
  // 1. Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Archivo demasiado grande. Máximo 5 MB.');
  }

  // 2. Validar MIME type declarado
  const declaredMime = file.type;
  if (!ALLOWED_MIME_TYPES.includes(declaredMime)) {
    throw new Error('Tipo de archivo no permitido. Solo JPEG, PNG y WebP.');
  }

  // 3. Validar magic bytes
  const buffer = await file.arrayBuffer();
  if (!validateMagicBytes(buffer, declaredMime)) {
    throw new Error(
      'El contenido del archivo no coincide con su tipo declarado.',
    );
  }

  // 4. Generar nombre seguro con UUID
  const ext = MIME_TO_EXT[declaredMime] || 'bin';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${ownerId}/${filename}`;

  // 5. Upload a Supabase Storage
  const { error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, buffer, {
      contentType: declaredMime,
      upsert: false,
    });

  if (error) throw error;

  // 6. Obtener URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(storagePath);

  return publicUrl;
}
