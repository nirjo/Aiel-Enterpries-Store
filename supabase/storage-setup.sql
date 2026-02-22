-- ============================================================
-- Supabase Storage Setup for Product Images
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Allow anyone to READ images (public bucket)
CREATE POLICY "Allow public read access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- 3. Allow authenticated/service-role uploads
CREATE POLICY "Allow service role uploads to product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- 4. Allow service-role to overwrite/update existing images
CREATE POLICY "Allow service role updates on product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- 5. Allow service-role to delete images
CREATE POLICY "Allow service role deletes on product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
