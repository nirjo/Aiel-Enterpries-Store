-- ============================================================
-- Aiel Enterprises — Supabase Storage Setup
-- Bucket: product-images (public, no auth required for GET)
-- ============================================================

-- Run this ONCE in the Supabase SQL Editor (not via migrations)

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                          -- public = anyone can GET
  5242880,                       -- 5 MB per file
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS: Public read (GET) — no auth needed
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- 3. Storage RLS: Only admins can upload / update / delete
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── How image URLs are structured ─────────────────────────────────────────────
-- Base: https://vkhffylaaxkahmydijtn.supabase.co/storage/v1/object/public/product-images/
--
-- Folder structure inside the bucket:
--   {category-slug}/{product-slug}/{image-number}.{ext}
--
-- Examples:
--   electronics/3d-virtual-reality-headset/1.jpg
--   home-kitchen/12-jar-revolving-spice-rack-masala-box-price-787/1.jpg
--   toys/54-block-wood-4-dice/1.jpg
--   wooden-toys/aditi-wooden-educational-learning-clock-toy-with-movable-hands/1.jpg
--   gardening/152-cm-rake-gardening-stainless-steel-broom/1.jpg
--
-- In products table:
--   thumbnail_url = base || 'category-slug/product-slug/1.jpg'
--   images        = ARRAY[ base||'1.jpg', base||'2.jpg', ... ]
