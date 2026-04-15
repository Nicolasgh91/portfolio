import { z } from "zod";

export const OrderItemSchema = z.object({
  product_id: z.string().uuid().describe("UUID del producto en el catálogo."),
  qty: z
    .number()
    .int()
    .positive()
    .max(9_999)
    .describe("Cantidad de unidades (entero positivo)."),
  unit_price: z
    .number()
    .positive()
    .max(99_999_999)
    .describe(
      "Precio unitario en la moneda del pedido (sin impuestos según reglas de negocio).",
    ),
});

export const OrderSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1)
    .max(100)
    .describe("Líneas del pedido; al menos una, máximo 100."),
  total: z
    .number()
    .positive()
    .max(999_999_999)
    .describe("Importe total del pedido."),
  delivery_date: z
    .string()
    .date()
    .optional()
    .describe("Fecha de entrega deseada (ISO date)."),
  delivery_address: z
    .string()
    .max(500)
    .trim()
    .optional()
    .describe("Dirección de envío en texto libre."),
  customer_id: z
    .string()
    .uuid()
    .optional()
    .describe("UUID del cliente si ya está registrado."),
  source: z
    .enum(["web", "chatbot", "whatsapp"])
    .default("web")
    .describe("Canal de origen del pedido para analítica y reglas."),
  idempotency_key: z
    .string()
    .uuid()
    .describe(
      "Clave única por intento de creación para evitar duplicados en reintentos.",
    ),
});

export const WhatsAppOrderSchema = z.object({
  customer_phone: z
    .string()
    .min(7)
    .max(30)
    .trim()
    .describe("Teléfono del cliente en formato WhatsApp."),
  items: z
    .array(
      z.object({
        name: z
          .string()
          .min(1)
          .max(200)
          .describe("Nombre del producto tal como lo envía el canal."),
        qty: z
          .number()
          .int()
          .positive()
          .max(9_999)
          .describe("Cantidad pedida."),
        unit_price: z
          .number()
          .positive()
          .max(99_999_999)
          .describe("Precio unitario acordado o de lista."),
      }),
    )
    .min(1)
    .max(100)
    .describe("Ítems del pedido parseados desde el mensaje o flujo WhatsApp."),
  notes: z
    .string()
    .max(500)
    .trim()
    .default("")
    .describe("Notas adicionales del cliente."),
  source: z.literal("whatsapp").describe("Marcador fijo de canal WhatsApp."),
});
