-- Seed data for Aiel Enterprises
-- Run this in Supabase SQL Editor after the migration

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronics', 'electronics', 'Latest gadgets and electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Fashion', 'fashion', 'Trendy fashion items', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Home & Living', 'home-living', 'Beautiful home decor', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Sports', 'sports', 'Sports and fitness gear', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO public.products (id, name, slug, description, short_description, price, compare_at_price, sku, category_id, images, thumbnail_url, is_active, is_featured, tags) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Wireless Bluetooth Headphones with Noise Cancellation',
    'wireless-bluetooth-headphones',
    '<p>Experience premium audio with active noise cancellation.</p><ul><li>40mm drivers</li><li>30 hours battery</li><li>Bluetooth 5.0</li></ul>',
    'Premium ANC headphones with immersive sound',
    2499.00,
    3999.00,
    'WBH-001',
    'c1000000-0000-0000-0000-000000000001',
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    true,
    true,
    ARRAY['electronics', 'audio', 'headphones']
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Smart Watch with Heart Rate Monitor',
    'smart-watch-heart-rate',
    '<p>Track your fitness goals with this feature-rich smartwatch.</p>',
    'Smart fitness watch with health tracking',
    4999.00,
    6999.00,
    'SW-001',
    'c1000000-0000-0000-0000-000000000001',
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    true,
    true,
    ARRAY['electronics', 'wearable', 'fitness']
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Premium Cotton T-Shirt',
    'premium-cotton-tshirt',
    '<p>Comfortable and stylish cotton t-shirt for everyday wear.</p>',
    'Soft premium cotton tee',
    599.00,
    899.00,
    'TS-001',
    'c1000000-0000-0000-0000-000000000002',
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    true,
    false,
    ARRAY['fashion', 'clothing', 'casual']
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Minimalist Desk Lamp',
    'minimalist-desk-lamp',
    '<p>Modern LED desk lamp with adjustable brightness levels.</p>',
    'Stylish LED desk lamp',
    1299.00,
    NULL,
    'DL-001',
    'c1000000-0000-0000-0000-000000000003',
    ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
    true,
    true,
    ARRAY['home', 'lighting', 'office']
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Leather Wallet - Brown',
    'leather-wallet-brown',
    '<p>Genuine leather wallet with multiple card slots and RFID protection.</p>',
    'Premium leather wallet',
    899.00,
    1499.00,
    'LW-001',
    'c1000000-0000-0000-0000-000000000002',
    ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    true,
    false,
    ARRAY['fashion', 'accessories', 'leather']
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Yoga Mat - Premium Quality',
    'yoga-mat-premium',
    '<p>Non-slip yoga mat for comfortable workouts. 6mm thick with carrying strap.</p>',
    'Premium non-slip yoga mat',
    799.00,
    1199.00,
    'YM-001',
    'c1000000-0000-0000-0000-000000000004',
    ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
    true,
    false,
    ARRAY['sports', 'fitness', 'yoga']
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'Portable Bluetooth Speaker',
    'portable-bluetooth-speaker',
    '<p>Compact waterproof speaker with 360° sound and 12 hours battery life.</p>',
    'Waterproof portable speaker',
    1999.00,
    2999.00,
    'BS-001',
    'c1000000-0000-0000-0000-000000000001',
    ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    true,
    true,
    ARRAY['electronics', 'audio', 'portable']
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Ceramic Coffee Mug Set',
    'ceramic-coffee-mug-set',
    '<p>Set of 4 elegant ceramic mugs. Microwave and dishwasher safe.</p>',
    'Elegant 4-piece mug set',
    699.00,
    NULL,
    'CM-001',
    'c1000000-0000-0000-0000-000000000003',
    ARRAY['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop'],
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    true,
    false,
    ARRAY['home', 'kitchen', 'drinkware']
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Inventory for products
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold) VALUES
  ('p1000000-0000-0000-0000-000000000001', 50, 10),
  ('p1000000-0000-0000-0000-000000000002', 30, 5),
  ('p1000000-0000-0000-0000-000000000003', 100, 20),
  ('p1000000-0000-0000-0000-000000000004', 25, 5),
  ('p1000000-0000-0000-0000-000000000005', 40, 10),
  ('p1000000-0000-0000-0000-000000000006', 60, 15),
  ('p1000000-0000-0000-0000-000000000007', 35, 10),
  ('p1000000-0000-0000-0000-000000000008', 45, 10)
ON CONFLICT (product_id) DO NOTHING;

-- Verify the data
SELECT 'Categories:' as table_name, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 'Products:', COUNT(*) FROM public.products
UNION ALL
SELECT 'Inventory:', COUNT(*) FROM public.inventory;
