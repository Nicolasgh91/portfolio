import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BookingSchema,
  CustomerSchema,
  CustomerUpdateSchema,
  EventSchema,
  LeadSchema,
  OrderItemSchema,
  OrderSchema,
  ProductAttributeSchema,
  ProductSchema,
  ProductUpdateSchema,
  UploadSchema,
  WhatsAppOrderSchema,
} from './index';

test('UploadSchema accepts valid payload', () => {
  const parsed = UploadSchema.safeParse({
    filename: 'foto.webp',
    mimeType: 'image/webp',
    size: 1024,
  });
  assert.equal(parsed.success, true);
});

test('UploadSchema rejects invalid mime', () => {
  const parsed = UploadSchema.safeParse({
    filename: 'foto.webp',
    mimeType: 'application/pdf',
    size: 1024,
  });
  assert.equal(parsed.success, false);
});

test('ProductAttributeSchema accepts valid payload', () => {
  const parsed = ProductAttributeSchema.safeParse({ key: 'Peso', value: '1kg', type: 'text' });
  assert.equal(parsed.success, true);
});

test('ProductAttributeSchema rejects invalid key', () => {
  const parsed = ProductAttributeSchema.safeParse({ key: 'peso#', value: '1kg', type: 'text' });
  assert.equal(parsed.success, false);
});

test('ProductSchema accepts valid payload', () => {
  const parsed = ProductSchema.safeParse({
    name: 'Empanadas',
    price: 1200,
    attributes: [{ key: 'Sabor', value: 'Carne' }],
  });
  assert.equal(parsed.success, true);
});

test('ProductSchema rejects negative price', () => {
  const parsed = ProductSchema.safeParse({
    name: 'Empanadas',
    price: -1,
  });
  assert.equal(parsed.success, false);
});

test('ProductUpdateSchema accepts valid payload', () => {
  const parsed = ProductUpdateSchema.safeParse({
    id: '550e8400-e29b-41d4-a716-446655440000',
    price: 1500,
  });
  assert.equal(parsed.success, true);
});

test('ProductUpdateSchema rejects invalid id', () => {
  const parsed = ProductUpdateSchema.safeParse({
    id: 'not-uuid',
    price: 1500,
  });
  assert.equal(parsed.success, false);
});

test('OrderItemSchema accepts valid payload', () => {
  const parsed = OrderItemSchema.safeParse({
    product_id: '550e8400-e29b-41d4-a716-446655440001',
    qty: 2,
    unit_price: 1000,
  });
  assert.equal(parsed.success, true);
});

test('OrderItemSchema rejects non-positive qty', () => {
  const parsed = OrderItemSchema.safeParse({
    product_id: '550e8400-e29b-41d4-a716-446655440001',
    qty: 0,
    unit_price: 1000,
  });
  assert.equal(parsed.success, false);
});

test('OrderSchema accepts valid payload', () => {
  const parsed = OrderSchema.safeParse({
    items: [{ product_id: '550e8400-e29b-41d4-a716-446655440002', qty: 1, unit_price: 2000 }],
    total: 2000,
    idempotency_key: '550e8400-e29b-41d4-a716-446655440003',
  });
  assert.equal(parsed.success, true);
});

test('OrderSchema rejects empty items', () => {
  const parsed = OrderSchema.safeParse({
    items: [],
    total: 2000,
    idempotency_key: '550e8400-e29b-41d4-a716-446655440003',
  });
  assert.equal(parsed.success, false);
});

test('WhatsAppOrderSchema accepts valid payload', () => {
  const parsed = WhatsAppOrderSchema.safeParse({
    customer_phone: '+5491112345678',
    items: [{ name: 'Combo 1', qty: 1, unit_price: 3000 }],
    source: 'whatsapp',
  });
  assert.equal(parsed.success, true);
});

test('WhatsAppOrderSchema rejects invalid source', () => {
  const parsed = WhatsAppOrderSchema.safeParse({
    customer_phone: '+5491112345678',
    items: [{ name: 'Combo 1', qty: 1, unit_price: 3000 }],
    source: 'web',
  });
  assert.equal(parsed.success, false);
});

test('LeadSchema accepts valid payload', () => {
  const parsed = LeadSchema.safeParse({
    name: 'Nico',
    source: 'web',
  });
  assert.equal(parsed.success, true);
});

test('LeadSchema rejects invalid email', () => {
  const parsed = LeadSchema.safeParse({
    name: 'Nico',
    email: 'invalid-email',
  });
  assert.equal(parsed.success, false);
});

test('CustomerSchema accepts valid payload', () => {
  const parsed = CustomerSchema.safeParse({
    name: 'Cliente 1',
    email: 'cliente@example.com',
  });
  assert.equal(parsed.success, true);
});

test('CustomerSchema rejects empty name', () => {
  const parsed = CustomerSchema.safeParse({
    name: '',
  });
  assert.equal(parsed.success, false);
});

test('CustomerUpdateSchema accepts valid payload', () => {
  const parsed = CustomerUpdateSchema.safeParse({
    id: '550e8400-e29b-41d4-a716-446655440004',
    notes: 'Cliente premium',
  });
  assert.equal(parsed.success, true);
});

test('CustomerUpdateSchema rejects invalid id', () => {
  const parsed = CustomerUpdateSchema.safeParse({
    id: 'bad-id',
    notes: 'Cliente premium',
  });
  assert.equal(parsed.success, false);
});

test('BookingSchema accepts valid payload', () => {
  const parsed = BookingSchema.safeParse({
    customer_name: 'Nico',
    service: 'Consultoria',
    date: '2026-03-20',
    time: '14:30',
  });
  assert.equal(parsed.success, true);
});

test('BookingSchema rejects invalid time format', () => {
  const parsed = BookingSchema.safeParse({
    customer_name: 'Nico',
    service: 'Consultoria',
    date: '2026-03-20',
    time: '2pm',
  });
  assert.equal(parsed.success, false);
});

test('EventSchema accepts valid payload', () => {
  const parsed = EventSchema.safeParse({
    type: 'order.created',
    entity_type: 'order',
    entity_id: '550e8400-e29b-41d4-a716-446655440005',
  });
  assert.equal(parsed.success, true);
});

test('EventSchema rejects invalid entity_id', () => {
  const parsed = EventSchema.safeParse({
    type: 'order.created',
    entity_type: 'order',
    entity_id: 'invalid',
  });
  assert.equal(parsed.success, false);
});
