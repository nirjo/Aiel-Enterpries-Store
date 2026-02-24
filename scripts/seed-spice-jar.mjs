/**
 * seed-spice-jar.mjs
 * Inserts the Home & Kitchen category + Spice Jar product into Supabase
 * Run: node scripts/seed-spice-jar.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vkhffylaaxkahmydijtn.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraGZmeWxhYXhrYWhteWRpanRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM0NTkyOSwiZXhwIjoyMDg1OTIxOTI5fQ.BN5qfGZqmQStk4Jjr7BqozvIWmqxtDYxOWtLb_mLJ-s';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
});

// Valid UUID v4-style IDs
const CATEGORY_ID = 'c2000000-1000-4000-8000-000000000001';
const PRODUCT_ID = 'a1b2c3d4-5678-4000-8000-ae1100000001';

async function run() {
    console.log('🚀 Starting Supabase seed...\n');

    // ── 1. Insert category ──────────────────────────────────────────────────
    console.log('📂 Inserting Home & Kitchen category...');
    const { error: catErr } = await supabase.from('categories').upsert({
        id: CATEGORY_ID,
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Premium home essentials and kitchen organizers for the modern Indian home',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        sort_order: 5,
        is_active: true,
    }, { onConflict: 'slug' });

    if (catErr) {
        console.error('❌ Category insert failed:', catErr.message);
        process.exit(1);
    }
    console.log('✅ Category ready\n');

    // Fetch the actual category ID in case slug already existed with a different ID
    const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'home-kitchen')
        .single();
    const resolvedCategoryId = cat?.id ?? CATEGORY_ID;

    // ── 2. Insert product ───────────────────────────────────────────────────
    console.log('🛍️  Inserting Spice Jar product...');
    const { error: prodErr } = await supabase.from('products').upsert({
        id: PRODUCT_ID,
        name: 'Premium Revolving Wooden Finish Spice Jars Set | 12-Pc Round Plastic Masala Box Kitchen Organizer Rack | Airtight Storage for Spices & Condiments',
        slug: 'premium-revolving-spice-jar-set',
        short_description: 'Exquisite 12-jar revolving spice rack with wooden finish. Airtight lids keep masala & condiments fresh. Limited stock — order now!',
        description: `<p>Discover Timeless Elegance in Every Rotation...</p>
<p>Step into a kitchen transformed. Our <strong>Premium Revolving Wooden Finish Spice Jars Set</strong> is not merely a storage solution — it is a statement of culinary artistry. With a heirloom-quality wooden finish that radiates warmth and sophistication, this 12-piece masala box kitchen organizer rack becomes the centrepiece of your counter.</p>

<h3>🌀 Crafted for the Indian Kitchen, Built for Every Spice You Love</h3>
<p>From garam masala to turmeric, from jeera to red chilli powder — every spice deserves a home this beautiful. The 12 individual airtight spice jars keep your masalas as fresh as the day you filled them.</p>

<h3>360° Rotating Kitchen Organizer</h3>
<p>The smooth, noiseless 360° rotation mechanism is engineered for daily use. Whether you're reaching for coriander powder mid-recipe or grabbing cinnamon for your morning chai, the rack responds effortlessly.</p>

<h3>Key Features:</h3>
<ul>
  <li>🌀 <strong>360° Smooth-Rotating Spice Rack</strong> — Effortless noiseless rotation, instant access to all 12 jars</li>
  <li>🪵 <strong>Premium Wooden Finish Design</strong> — Heirloom-quality woodgrain texture</li>
  <li>🔒 <strong>Airtight Lids</strong> — Lock in flavor, block moisture, keep spices potent longer</li>
  <li>🧹 <strong>BPA-Free Food-Safe Plastic Jars</strong> — Crystal-clear bodies, dishwasher-safe lids</li>
  <li>📦 <strong>12-Piece Complete Set</strong> — 12 jars + rotating rack + spice labels</li>
  <li>🎁 <strong>Perfect Gift</strong> — For housewarmings, weddings, Diwali, anniversaries</li>
</ul>

<h3>Specifications:</h3>
<ul>
  <li>Base Diameter: ~22 cm | Height: ~28 cm | Jar Capacity: ~100ml each</li>
  <li>Material: BPA-free food-grade plastic, wooden-finish base</li>
</ul>

<p><strong>⚡ Limited Stock — Grab now before prices rise!</strong></p>`,
        price: 799.00,
        compare_at_price: 1499.00,
        cost_price: 450.00,
        sku: 'SJR-12PC-001',
        category_id: resolvedCategoryId,
        images: [
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=800&fit=crop',
        ],
        thumbnail_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
        is_active: true,
        is_featured: true,
        tags: ['home-kitchen', 'spice-rack', 'masala-box', 'kitchen-organizer', 'airtight-jars', 'revolving-rack', 'wooden-finish'],
        metadata: {
            brand: 'Aiel Enterprises',
            jar_count: 12,
            jar_capacity_ml: 100,
            pricing_tiers: {
                single: { price: 799, mrp: 1499, discount_pct: 47 },
                buy_2: { price: 1439, savings_pct: 10 },
                bulk_6plus: { contact: true, unit_price: 450 },
            },
        },
    }, { onConflict: 'slug' });

    if (prodErr) {
        console.error('❌ Product insert failed:', prodErr.message);
        process.exit(1);
    }
    console.log('✅ Product ready\n');

    // Fetch actual product ID (may differ if slug already existed)
    const { data: prod } = await supabase
        .from('products')
        .select('id')
        .eq('slug', 'premium-revolving-spice-jar-set')
        .single();
    const resolvedProductId = prod?.id ?? PRODUCT_ID;

    // ── 3. Insert inventory ─────────────────────────────────────────────────
    console.log('📦 Inserting inventory...');
    const { error: invErr } = await supabase.from('inventory').upsert({
        product_id: resolvedProductId,
        quantity: 50,
        low_stock_threshold: 10,
    }, { onConflict: 'product_id' });

    if (invErr) {
        console.error('❌ Inventory insert failed:', invErr.message);
        process.exit(1);
    }
    console.log('✅ Inventory ready\n');

    // ── 4. Verify ───────────────────────────────────────────────────────────
    const { data: verify } = await supabase
        .from('products')
        .select('name, slug, price, compare_at_price, is_featured')
        .eq('slug', 'premium-revolving-spice-jar-set')
        .single();

    if (verify) {
        console.log('📋 Verification:');
        console.log(`   Name    : ${verify.name.slice(0, 60)}...`);
        console.log(`   Slug    : ${verify.slug}`);
        console.log(`   Price   : ₹${verify.price} (MRP ₹${verify.compare_at_price})`);
        console.log(`   Featured: ${verify.is_featured}`);
    }

    console.log('\n🎉 All done! Product is live at:');
    console.log('   https://aiel-enterprises.vercel.app/products/premium-revolving-spice-jar-set\n');
}

run().catch(console.error);
