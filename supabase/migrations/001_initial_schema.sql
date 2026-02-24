-- ============================================================
-- Aiel Enterprises — Full Database Schema
-- Applied to: vkhffylaaxkahmydijtn (Supabase project)
-- Run via: Supabase MCP Server or SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Categories ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,           -- Unsplash or Supabase Storage URL for category card
  parent_id   UUID REFERENCES public.categories(id),
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Products ──────────────────────────────────────────────────────────────────
-- images[]       → array of Supabase Storage public URLs
-- thumbnail_url  → first image URL (used for product cards/cart)
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  short_description TEXT,
  price             DECIMAL(10,2) NOT NULL,
  compare_at_price  DECIMAL(10,2),
  cost_price        DECIMAL(10,2),
  sku               TEXT UNIQUE,
  barcode           TEXT,
  category_id       UUID REFERENCES public.categories(id),
  images            TEXT[] DEFAULT '{}',   -- Supabase Storage URLs
  thumbnail_url     TEXT,                  -- Supabase Storage URL
  is_active         BOOLEAN DEFAULT true,
  is_featured       BOOLEAN DEFAULT false,
  tags              TEXT[] DEFAULT '{}',
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Inventory ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity            INTEGER NOT NULL DEFAULT 0,
  reserved_quantity   INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  warehouse_location  TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- ── Addresses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type          TEXT DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  postal_code   TEXT NOT NULL,
  country       TEXT DEFAULT 'IN',
  is_default    BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,
  user_id          UUID REFERENCES public.profiles(id),
  status           TEXT DEFAULT 'pending' CHECK (status IN (
                     'pending','confirmed','processing','shipped','delivered','cancelled','refunded'
                   )),
  subtotal         DECIMAL(10,2) NOT NULL,
  discount         DECIMAL(10,2) DEFAULT 0,
  shipping_cost    DECIMAL(10,2) DEFAULT 0,
  tax              DECIMAL(10,2) DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  currency         TEXT DEFAULT 'INR',
  shipping_address JSONB NOT NULL,
  billing_address  JSONB,
  notes            TEXT,
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Order Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.products(id),
  product_name  TEXT NOT NULL,
  product_image TEXT,           -- Snapshot of Supabase Storage URL at time of order
  quantity      INTEGER NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  total_price   DECIMAL(10,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider            TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe', 'cod')),
  provider_order_id   TEXT,
  provider_payment_id TEXT,
  provider_signature  TEXT,
  amount              DECIMAL(10,2) NOT NULL,
  currency            TEXT DEFAULT 'INR',
  status              TEXT DEFAULT 'pending' CHECK (status IN (
                        'pending','authorized','captured','failed','refunded'
                      )),
  method              TEXT,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Carts ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  items      JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- ── Performance Indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug      ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active    ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug    ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order     ON public.payments(order_id);

-- ── Enable RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts        ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ─────────────────────────────────────────────────────────────

-- Helper: is the current user an admin?
-- Usage: EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')

-- Profiles
CREATE POLICY "profiles_select_own"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories (public read, admin write)
CREATE POLICY "categories_select_active" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all"     ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Products (public read of active, admin write)
CREATE POLICY "products_select_active" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all"     ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Inventory (public read, admin write)
CREATE POLICY "inventory_select_all" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "inventory_admin_all"  ON public.inventory FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders
CREATE POLICY "orders_select_own"    ON public.orders FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own"    ON public.orders FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_own"    ON public.orders FOR UPDATE  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all"     ON public.orders FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order Items
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "order_items_admin_all"  ON public.order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payments
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "payments_admin_all"  ON public.payments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Addresses
CREATE POLICY "addresses_select_own" ON public.addresses FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON public.addresses FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON public.addresses FOR UPDATE  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON public.addresses FOR DELETE  USING (auth.uid() = user_id);

-- Carts
CREATE POLICY "carts_select_own" ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "carts_insert_own" ON public.carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "carts_update_own" ON public.carts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "carts_delete_own" ON public.carts FOR DELETE USING (auth.uid() = user_id);

-- ── Functions ─────────────────────────────────────────────────────────────────

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at   BEFORE UPDATE ON public.profiles   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at   BEFORE UPDATE ON public.products   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at     BEFORE UPDATE ON public.orders     FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_payments_updated_at   BEFORE UPDATE ON public.payments   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_carts_updated_at      BEFORE UPDATE ON public.carts      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_inventory_updated_at  BEFORE UPDATE ON public.inventory  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
