import { z } from "zod";

export const ProductAttributeSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(64)
    .regex(
      /^[a-zA-Z0-9_\u00C0-\u024F ]+$/,
      "Solo letras, números, espacios y guiones bajos",
    )
    .describe("Nombre del atributo (alfanumérico, espacios y guión bajo)."),
  value: z.string().max(500).describe("Valor visible del atributo."),
  type: z
    .enum(["text", "number", "select"])
    .default("text")
    .describe("Tipo de dato para validación o UI (texto, número o selección)."),
});

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(200)
    .trim()
    .describe("Nombre comercial del producto."),
  description: z
    .string()
    .max(5000)
    .trim()
    .default("")
    .describe("Descripción larga; vacío si no aplica."),
  category: z
    .string()
    .max(100)
    .trim()
    .optional()
    .describe("Categoría o rubro para filtros."),
  price: z
    .number()
    .nonnegative()
    .max(99_999_999)
    .describe("Precio de lista en moneda base."),
  image_url: z
    .string()
    .url()
    .nullable()
    .default(null)
    .describe("URL pública de la imagen principal; null si no hay imagen."),
  active: z
    .boolean()
    .default(true)
    .describe("Si el producto se muestra en catálogos activos."),
  attributes: z
    .array(ProductAttributeSchema)
    .max(20)
    .default([])
    .describe("Metadatos extensibles (talla, color, SKU legible, etc.)."),
});

export const ProductUpdateSchema = ProductSchema.partial().extend({
  id: z.string().uuid().describe("UUID del producto a actualizar."),
});
