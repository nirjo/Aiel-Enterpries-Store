/**
 * Batch Upload Product Images to Supabase Storage
 * ================================================
 * Usage:  npm run upload-images
 *
 * Reads images from G:\AielEnterprises\Aielproductpictures\
 * Uploads to Supabase bucket "product-images" under category/product-slug/filename
 * Generates scripts/uploaded-urls.json with all public URLs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

// ── Load .env.local ──────────────────────────────────────────
function loadEnv() {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) {
        console.error("❌  .env.local not found at", envPath);
        process.exit(1);
    }
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = val;
    }
}

loadEnv();

// ── Config ───────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
});

// ── Source folder → Supabase category slug mapping ───────────
const SOURCE_ROOT = "G:\\AielEnterprises\\Aielproductpictures";

const FOLDER_MAP = [
    { localPath: "toys\\tOYS", category: "toys" },
    { localPath: "toys\\wooden items", category: "wooden-toys" },
    { localPath: "Kitchen\\AielKitchen", category: "home-kitchen" },
    { localPath: "Kitchen\\KITCHEN ITEMS", category: "home-kitchen" },
    { localPath: "electronics\\electronics", category: "electronics" },
    { localPath: "garden\\gardening", category: "gardening" },
];

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ── Helpers ──────────────────────────────────────────────────
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}

function getMimeType(ext) {
    const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
    return map[ext] || "application/octet-stream";
}

function getPublicUrl(storagePath) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

/** Collect all image files from a directory (recursive into product subfolders) */
function collectImages(dirPath) {
    const results = [];
    if (!fs.existsSync(dirPath)) return results;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            // Product subfolder — scan it
            const productName = entry.name;
            const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });
            for (const sub of subEntries) {
                if (!sub.isFile()) continue;
                const ext = path.extname(sub.name).toLowerCase();
                if (!ALLOWED_EXT.has(ext)) continue;
                results.push({
                    localFile: path.join(fullPath, sub.name),
                    productName,
                    fileName: sub.name,
                    ext,
                });
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (ALLOWED_EXT.has(ext)) {
                results.push({
                    localFile: fullPath,
                    productName: "_uncategorized",
                    fileName: entry.name,
                    ext,
                });
            }
        }
    }
    return results;
}

// ── Main Upload Logic ────────────────────────────────────────
async function uploadAll() {
    console.log("🚀  Supabase Batch Image Uploader");
    console.log("─".repeat(50));
    console.log(`📦  Bucket: ${BUCKET}`);
    console.log(`🔗  Project: ${SUPABASE_URL}`);
    console.log(`📂  Source: ${SOURCE_ROOT}`);
    console.log("─".repeat(50));

    const allUrls = {}; // { category: [ { product, images: [url] } ] }
    let totalUploaded = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const mapping of FOLDER_MAP) {
        const srcDir = path.join(SOURCE_ROOT, mapping.localPath);
        const category = mapping.category;

        console.log(`\n📁  Category: ${category} (from ${mapping.localPath})`);

        const images = collectImages(srcDir);
        if (images.length === 0) {
            console.log(`   ⚠️  No images found, skipping.`);
            continue;
        }

        console.log(`   Found ${images.length} images across ${new Set(images.map(i => i.productName)).size} products`);

        if (!allUrls[category]) allUrls[category] = [];

        // Group by product
        const byProduct = {};
        for (const img of images) {
            if (!byProduct[img.productName]) byProduct[img.productName] = [];
            byProduct[img.productName].push(img);
        }

        let uploaded = 0;
        const total = images.length;

        for (const [productName, productImages] of Object.entries(byProduct)) {
            const productSlug = slugify(productName);
            const productUrls = [];

            for (const img of productImages) {
                const storagePath = `${category}/${productSlug}/${slugify(path.parse(img.fileName).name)}${img.ext}`;

                try {
                    const fileBuffer = fs.readFileSync(img.localFile);

                    const { error } = await supabase.storage
                        .from(BUCKET)
                        .upload(storagePath, fileBuffer, {
                            contentType: getMimeType(img.ext),
                            upsert: true,
                        });

                    if (error) {
                        if (error.message?.includes("already exists")) {
                            totalSkipped++;
                            productUrls.push(getPublicUrl(storagePath));
                        } else {
                            console.error(`   ❌  Failed: ${storagePath} — ${error.message}`);
                            totalFailed++;
                        }
                    } else {
                        productUrls.push(getPublicUrl(storagePath));
                        totalUploaded++;
                    }

                    uploaded++;
                    if (uploaded % 5 === 0 || uploaded === total) {
                        process.stdout.write(`\r   [${category}] ${uploaded}/${total} uploaded`);
                    }
                } catch (err) {
                    console.error(`\n   ❌  Error reading ${img.localFile}: ${err.message}`);
                    totalFailed++;
                    uploaded++;
                }
            }

            if (productUrls.length > 0) {
                allUrls[category].push({
                    product: productName,
                    slug: productSlug,
                    images: productUrls,
                });
            }
        }

        console.log(""); // newline after progress
    }

    // ── Write URL manifest ───────────────────────────────────
    const outPath = path.join(process.cwd(), "scripts", "uploaded-urls.json");
    fs.writeFileSync(outPath, JSON.stringify(allUrls, null, 2), "utf-8");

    // ── Generate categoryImages.ts ───────────────────────────
    generateCategoryImagesTS(allUrls);

    // ── Summary ──────────────────────────────────────────────
    console.log("\n" + "═".repeat(50));
    console.log("✅  UPLOAD COMPLETE!");
    console.log(`   📤  Uploaded: ${totalUploaded}`);
    console.log(`   ⏭️   Skipped (already exists): ${totalSkipped}`);
    console.log(`   ❌  Failed: ${totalFailed}`);
    console.log(`   📄  URL manifest: ${outPath}`);
    console.log(`   📄  categoryImages.ts generated`);
    console.log("═".repeat(50));
}

// ── Auto-generate src/lib/categoryImages.ts ──────────────────
function generateCategoryImagesTS(allUrls) {
    const tsPath = path.join(process.cwd(), "src", "lib", "categoryImages.ts");

    let ts = `// AUTO-GENERATED by scripts/upload-images.mjs — do not edit manually
// Generated at: ${new Date().toISOString()}

export interface ProductImages {
  product: string;
  slug: string;
  images: string[];
}

export type CategoryImagesMap = Record<string, ProductImages[]>;

export const categoryImages: CategoryImagesMap = {\n`;

    for (const [category, products] of Object.entries(allUrls)) {
        ts += `  "${category}": [\n`;
        for (const prod of products) {
            ts += `    {\n`;
            ts += `      product: ${JSON.stringify(prod.product)},\n`;
            ts += `      slug: ${JSON.stringify(prod.slug)},\n`;
            ts += `      images: [\n`;
            for (const url of prod.images) {
                ts += `        "${url}",\n`;
            }
            ts += `      ],\n`;
            ts += `    },\n`;
        }
        ts += `  ],\n`;
    }

    ts += `};\n\n`;

    // Helper: get a hero image for a category (first image of first product)
    ts += `/** Get the first available image for a category (for carousel/hero use) */
export function getCategoryHeroImage(slug: string): string | null {
  const products = categoryImages[slug];
  if (!products || products.length === 0) return null;
  return products[0].images[0] || null;
}

/** Get all images for a category (flat array) */
export function getAllCategoryImages(slug: string): string[] {
  const products = categoryImages[slug];
  if (!products) return [];
  return products.flatMap((p) => p.images);
}

/** Get all category slugs that have uploaded images */
export function getUploadedCategories(): string[] {
  return Object.keys(categoryImages).filter(
    (key) => categoryImages[key].length > 0
  );
}
`;

    fs.writeFileSync(tsPath, ts, "utf-8");
    console.log(`\n📝  Generated: ${tsPath}`);
}

// ── Run ──────────────────────────────────────────────────────
uploadAll().catch((err) => {
    console.error("💥  Fatal error:", err);
    process.exit(1);
});
