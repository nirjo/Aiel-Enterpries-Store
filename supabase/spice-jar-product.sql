-- ============================================================
-- Spice Jar Product Seed
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Insert Home & Kitchen category (if not already present)
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES (
  'c2000000-0000-0000-0000-000000000001',
  'Home & Kitchen',
  'home-kitchen',
  'Premium home essentials and kitchen organizers for the modern Indian home',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  5,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert the Spice Jar Set product
INSERT INTO public.products (
  id,
  name,
  slug,
  description,
  short_description,
  price,
  compare_at_price,
  cost_price,
  sku,
  category_id,
  images,
  thumbnail_url,
  is_active,
  is_featured,
  tags,
  metadata
)
VALUES (
  'p2000000-0000-0000-0000-000000000001',
  'Premium Revolving Wooden Finish Spice Jars Set | 12-Pc Round Plastic Masala Box Kitchen Organizer Rack | Airtight Storage for Spices & Condiments',
  'premium-revolving-spice-jar-set',
  '<p>Discover Timeless Elegance in Every Rotation...</p>
<p>Step into a kitchen transformed. Our <strong>Premium Revolving Wooden Finish Spice Jars Set</strong> is not merely a storage solution — it is a statement of culinary artistry, designed for the Indian home that values both beauty and function. With a heirloom-quality wooden finish that radiates warmth and sophistication, this 12-piece masala box kitchen organizer rack becomes the centrepiece of your counter.</p>

<h3>🌀 Crafted for the Indian Kitchen, Built for Every Spice You Love</h3>
<p>From the fragrant depth of garam masala to the golden warmth of turmeric, from jeera to red chilli powder — every spice deserves a home this beautiful. The 12 individual airtight spice jars are sized perfectly for the everyday Indian cook, keeping your masalas as fresh as the day you filled them.</p>

<h3>360° Rotating Kitchen Organizer</h3>
<p>The smooth, noiseless 360° rotation mechanism is engineered for daily use. Whether you''re reaching for coriander powder mid-recipe or grabbing cinnamon for your morning chai, the kitchen organizer rack responds effortlessly.</p>

<h3>Key Features:</h3>
<ul>
  <li>🌀 <strong>360° Smooth-Rotating Spice Rack</strong> — Effortless, noiseless rotation; instant access to all 12 jars</li>
  <li>🪵 <strong>Premium Wooden Finish Design</strong> — Heirloom-quality woodgrain texture; rustic warmth and sophistication</li>
  <li>🔒 <strong>Airtight Lids</strong> — Precision-seal lids lock in flavor; blocks moisture; spices stay potent longer</li>
  <li>🧹 <strong>BPA-Free Food-Safe Plastic Jars</strong> — Crystal-clear bodies for instant visibility; dishwasher-safe lids</li>
  <li>📦 <strong>12-Piece Complete Set</strong> — 12 jars + rotating rack + labels; set-up in under 2 minutes</li>
  <li>🎁 <strong>Perfect Gift</strong> — Beautiful packaging for housewarmings, weddings, Diwali, anniversaries</li>
  <li>✨ <strong>Compact Footprint</strong> — Replaces cluttered masala dabbas with one gorgeous revolving spice rack</li>
</ul>

<h3>Specifications:</h3>
<ul>
  <li>Base Diameter: ~22 cm</li>
  <li>Total Height: ~28 cm</li>
  <li>Jar Capacity: ~100ml each</li>
  <li>Number of Jars: 12</li>
  <li>Material: BPA-free food-grade plastic with wooden-finish base</li>
  <li>Includes: 12 jars + rotating rack + spice labels</li>
</ul>

<p><strong>⚡ Limited Stock — Order now before prices rise!</strong></p>',
  'Exquisite 12-jar revolving spice rack with wooden finish. Airtight lids keep masala & condiments fresh. Limited stock — order now!',
  799.00,
  1499.00,
  450.00,
  'SJR-12PC-001',
  'c2000000-0000-0000-0000-000000000001',
  ARRAY[
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=800&fit=crop'
  ],
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
  true,
  true,
  ARRAY['home-kitchen', 'spice-rack', 'masala-box', 'kitchen-organizer', 'airtight-jars', 'revolving-rack', 'wooden-finish'],
  '{
    "brand": "Aiel Enterprises",
    "material": "BPA-free food-grade plastic, wooden-finish base",
    "dimensions": {"base_diameter_cm": 22, "height_cm": 28},
    "jar_capacity_ml": 100,
    "jar_count": 12,
    "includes_labels": true,
    "pricing_tiers": {
      "single": {"price": 799, "mrp": 1499, "discount_pct": 47},
      "buy_2": {"price": 1439, "savings_pct": 10},
      "bulk_6plus": {"contact": true, "unit_price": 450}
    }
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert inventory
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
VALUES ('p2000000-0000-0000-0000-000000000001', 50, 10)
ON CONFLICT (product_id) DO NOTHING;

-- 4. Verify
SELECT
  p.name,
  p.slug,
  p.price,
  p.compare_at_price,
  p.is_featured,
  c.name AS category,
  i.quantity AS stock
FROM public.products p
JOIN public.categories c ON c.id = p.category_id
LEFT JOIN public.inventory i ON i.product_id = p.id
WHERE p.slug = 'premium-revolving-spice-jar-set';
