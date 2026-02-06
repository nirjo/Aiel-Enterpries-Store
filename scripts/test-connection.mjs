import { createClient } from "@supabase/supabase-js";

async function testConnection() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing Supabase environment variables!");
        console.log("   Please check your .env.local file has:");
        console.log("   - NEXT_PUBLIC_SUPABASE_URL");
        console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
        process.exit(1);
    }

    console.log("🔄 Testing Supabase connection...\n");
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Test categories table
        const { data: categories, error: catError } = await supabase
            .from("categories")
            .select("id, name, slug")
            .limit(5);

        if (catError) {
            console.error("❌ Error fetching categories:", catError.message);
            if (catError.message.includes("does not exist")) {
                console.log("\n   💡 Tip: Run the migration SQL first!");
                console.log("   File: supabase/migrations/001_initial_schema.sql");
            }
            process.exit(1);
        }

        console.log(`✅ Categories table: ${categories?.length || 0} records`);

        // Test products table
        const { data: products, error: prodError } = await supabase
            .from("products")
            .select("id, name, price, is_featured")
            .limit(5);

        if (prodError) {
            console.error("❌ Error fetching products:", prodError.message);
            process.exit(1);
        }

        console.log(`✅ Products table: ${products?.length || 0} records`);

        // Show sample data
        if (products && products.length > 0) {
            console.log("\n📦 Sample products:");
            products.forEach((p) => {
                console.log(`   - ${p.name} (₹${p.price})`);
            });
        } else {
            console.log("\n⚠️  No products found. Run the seed SQL:");
            console.log("   File: supabase/seed.sql");
        }

        console.log("\n🎉 Supabase connection successful!");
        console.log("   Your database is ready to use.\n");

    } catch (error) {
        console.error("❌ Unexpected error:", error);
        process.exit(1);
    }
}

testConnection();
