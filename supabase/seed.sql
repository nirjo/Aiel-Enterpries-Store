-- ============================================================
-- Aiel Enterprises — Seed Data
-- Storage bucket: product-images (public)
-- Base URL: https://vkhffylaaxkahmydijtn.supabase.co/storage/v1/object/public/product-images/
-- ============================================================

DO $$
DECLARE
  base TEXT := 'https://vkhffylaaxkahmydijtn.supabase.co/storage/v1/object/public/product-images/';
BEGIN

-- ── 1. Categories ─────────────────────────────────────────────────────────────
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
  ('c2000000-1000-4000-8000-000000000001', 'Home & Kitchen',    'home-kitchen',     'Smart kitchen & home essentials',         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=600&fit=crop&q=85', 1, true),
  ('c2000000-1000-4000-8000-000000000002', 'Electronics',       'electronics',      'Gadgets, appliances and tech products',    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=600&fit=crop&q=85', 2, true),
  ('c2000000-1000-4000-8000-000000000003', 'Gardening',         'gardening',        'Tools and accessories for your garden',    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&h=600&fit=crop&q=85', 3, true),
  ('c2000000-1000-4000-8000-000000000004', 'Aiel Toy Paradise', 'toys',             'Fun toys for kids of all ages',            'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&h=600&fit=crop&q=85', 4, true),
  ('c2000000-1000-4000-8000-000000000005', 'Wooden Toys',       'wooden-toys',      'Eco-friendly wooden educational toys',     'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&h=600&fit=crop&q=85', 5, true),
  ('c2000000-1000-4000-8000-000000000006', 'Home Decor',        'home-decor',       'Decorate your home in style',              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=600&fit=crop&q=85', 6, true),
  ('c2000000-1000-4000-8000-000000000007', 'Stationery Items',  'stationery-items', 'Office and school stationery',             'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=900&h=600&fit=crop&q=85', 7, true),
  ('c2000000-1000-4000-8000-000000000008', 'Sport & Exercise',  'sport-exercise',   'Fitness and sports equipment',             'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&h=600&fit=crop&q=85', 8, true),
  ('c2000000-1000-4000-8000-000000000009', 'Gift Items',        'gift-items',       'Thoughtful gifts for every occasion',      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&h=600&fit=crop&q=85', 9, true)
ON CONFLICT (id) DO UPDATE SET
  image_url  = EXCLUDED.image_url,
  updated_at = NOW();

-- ── 2. Electronics Products ────────────────────────────────────────────────────
INSERT INTO public.products (name, slug, short_description, price, compare_at_price, category_id, thumbnail_url, images, is_active, is_featured, tags)
VALUES
  ('3D Virtual Reality Headset','3d-virtual-reality-headset','Immersive VR headset compatible with all smartphones',1299,2499,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/3d-virtual-reality-headset/1.jpg',
   ARRAY[base||'electronics/3d-virtual-reality-headset/1.jpg',base||'electronics/3d-virtual-reality-headset/2.jpg',base||'electronics/3d-virtual-reality-headset/3.jpg',base||'electronics/3d-virtual-reality-headset/4.jpg',base||'electronics/3d-virtual-reality-headset/5.jpg',base||'electronics/3d-virtual-reality-headset/6.jpg'],
   true,true,ARRAY['vr','headset','gaming']),

  ('Night Lamp Bluetooth Speaker','night-lamp-bluetooth-speaker','2-in-1 LED night lamp with built-in Bluetooth speaker',799,1499,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/night-lamp-bluetooth-speaker/1.jpg',
   ARRAY[base||'electronics/night-lamp-bluetooth-speaker/1.jpg',base||'electronics/night-lamp-bluetooth-speaker/2.jpg',base||'electronics/night-lamp-bluetooth-speaker/3.jpg',base||'electronics/night-lamp-bluetooth-speaker/4.jpg',base||'electronics/night-lamp-bluetooth-speaker/5.jpg'],
   true,true,ARRAY['lamp','speaker','bluetooth']),

  ('Pink Headset Luminus','pink-headset-luminus','Pink wireless headset with crystal-clear audio and LED accents',899,1699,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/pink-headset-luminus/1.jpg',
   ARRAY[base||'electronics/pink-headset-luminus/1.jpg',base||'electronics/pink-headset-luminus/2.jpg',base||'electronics/pink-headset-luminus/3.jpg',base||'electronics/pink-headset-luminus/4.jpg',base||'electronics/pink-headset-luminus/5.jpg',base||'electronics/pink-headset-luminus/6.jpg',base||'electronics/pink-headset-luminus/7.jpg'],
   true,false,ARRAY['headset','wireless','pink']),

  ('Portable Steam Iron','steam-iron-portable','Compact travel steam iron with anti-drip soleplate',549,999,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/steam-iron-portable/3.jpg',
   ARRAY[base||'electronics/steam-iron-portable/3.jpg',base||'electronics/steam-iron-portable/1.jpg',base||'electronics/steam-iron-portable/2.jpg',base||'electronics/steam-iron-portable/4.jpg',base||'electronics/steam-iron-portable/5.jpg'],
   true,false,ARRAY['iron','portable','travel']),

  ('Stainless Steel Electric Hand Mixer','stainless-steel-electric-hand-mixer','5-speed hand mixer with stainless steel beaters',899,1599,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/stainless-steel-electric-hand-mixer/1.jpg',
   ARRAY[base||'electronics/stainless-steel-electric-hand-mixer/1.jpg',base||'electronics/stainless-steel-electric-hand-mixer/2.jpg',base||'electronics/stainless-steel-electric-hand-mixer/3.jpg',base||'electronics/stainless-steel-electric-hand-mixer/4.jpg'],
   true,false,ARRAY['mixer','kitchen','electric']),

  ('Teddy Fan','teddy-fan','Adorable teddy-bear desk fan with 3-speed settings',499,899,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/teddy-fan/1.jpg',
   ARRAY[base||'electronics/teddy-fan/1.jpg',base||'electronics/teddy-fan/2.jpg',base||'electronics/teddy-fan/3.jpg',base||'electronics/teddy-fan/4.jpg',base||'electronics/teddy-fan/5.jpg'],
   true,true,ARRAY['fan','cute','desk']),

  ('Wheel Bluetooth Speaker','wheel-speaker','Tyre-shaped portable Bluetooth speaker with 10hr battery',699,1299,'c2000000-1000-4000-8000-000000000002',
   base||'electronics/wheel-speaker/1.webp',
   ARRAY[base||'electronics/wheel-speaker/1.webp',base||'electronics/wheel-speaker/2.webp',base||'electronics/wheel-speaker/3.webp',base||'electronics/wheel-speaker/4.webp',base||'electronics/wheel-speaker/5.webp',base||'electronics/wheel-speaker/6.webp'],
   true,false,ARRAY['speaker','bluetooth','portable'])
ON CONFLICT (slug) DO NOTHING;

END $$;

-- ── 3. Inventory seed (50 units for every product without inventory) ──────────
INSERT INTO public.inventory (product_id, quantity, reserved_quantity, low_stock_threshold)
SELECT p.id, 50, 0, 5
FROM public.products p
LEFT JOIN public.inventory i ON i.product_id = p.id
WHERE i.product_id IS NULL
ON CONFLICT (product_id) DO NOTHING;

-- ── 4. Useful read queries (copy these into your app) ─────────────────────────

-- Fetch all active products with category and stock:
/*
SELECT
  p.id, p.name, p.slug, p.short_description,
  p.price, p.compare_at_price,
  p.thumbnail_url,           -- Supabase Storage URL
  p.images,                  -- Supabase Storage URL array
  p.tags,
  c.name  AS category_name,
  c.slug  AS category_slug,
  i.quantity AS stock
FROM public.products p
LEFT JOIN public.categories c  ON c.id = p.category_id
LEFT JOIN public.inventory  i  ON i.product_id = p.id
WHERE p.is_active = true
ORDER BY c.sort_order, p.name;
*/

-- Fetch single product by slug:
/*
SELECT
  p.*,
  c.name  AS category_name,
  c.slug  AS category_slug,
  i.quantity AS stock
FROM public.products p
LEFT JOIN public.categories c ON c.id = p.category_id
LEFT JOIN public.inventory  i ON i.product_id = p.id
WHERE p.slug = 'YOUR-PRODUCT-SLUG'
  AND p.is_active = true;
*/

-- Fetch all categories with their images:
/*
SELECT id, name, slug, description, image_url, sort_order
FROM public.categories
WHERE is_active = true
ORDER BY sort_order;
*/
