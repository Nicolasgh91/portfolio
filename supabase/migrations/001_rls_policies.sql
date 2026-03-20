-- SEC-013: Políticas de Row-Level Security
-- Ejecutar antes de cualquier módulo tier 2

-- ── Habilitar RLS ───────────────────────────────────────────────────
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE events      ENABLE ROW LEVEL SECURITY;

-- ── owner_id en cada tabla ──────────────────────────────────────────
ALTER TABLE products    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE customers   ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE events      ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- ── Políticas: cada usuario solo ve sus propios datos ───────────────
CREATE POLICY "Users see own products"  ON products    FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own orders"    ON orders      FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own customers" ON customers   FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own events"    ON events      FOR ALL USING (auth.uid() = owner_id);

-- order_items hereda acceso del order padre
CREATE POLICY "Users see own order items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.owner_id = auth.uid()
    )
  );

-- ── Eventos: inmutabilidad (solo INSERT) ────────────────────────────
CREATE POLICY "Events are immutable" ON events
  FOR UPDATE USING (false);
CREATE POLICY "Events cannot be deleted" ON events
  FOR DELETE USING (false);

-- ── Bucket de imágenes ──────────────────────────────────────────────
-- Configurar en Supabase Dashboard → Storage → Policies:
--   Bucket: product-images
--   SELECT: public (true)
--   INSERT: auth.uid() IS NOT NULL
--   UPDATE: auth.uid() = owner_id (metadata del objeto)
--   DELETE: auth.uid() = owner_id
