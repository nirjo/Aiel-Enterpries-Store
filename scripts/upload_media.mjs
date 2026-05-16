import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

let envFile = '';
try {
  envFile = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Could not read .env.local:', e.message);
}

const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'uploads';
const SOURCE_DIR = 'F:\\amazon\\amazon';

async function uploadFile(filePath, relativePath) {
  const fileBuffer = fs.readFileSync(filePath);
  
  // Create bucket if it doesn't exist (Supabase might throw an error if it exists, but we can check first)
  const destPath = relativePath.replace(/\\/g, '/'); // Normalize for Storage

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(destPath, fileBuffer, {
      upsert: true,
      contentType: getContentType(filePath)
    });

  if (uploadError) {
    console.error(`Failed to upload ${destPath}:`, uploadError.message);
    return false;
  }

  // Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(destPath);

  const fileUrl = publicUrlData.publicUrl;

  // Insert into media table
  const { data: insertData, error: insertError } = await supabase
    .from('media')
    .insert([
      {
        file_name: path.basename(filePath),
        file_path: destPath,
        file_url: fileUrl
      }
    ]);

  if (insertError) {
    console.error(`Failed to insert ${destPath} into media table. Error:`, insertError.message);
    if (insertError.code === '42P01') {
      console.error('\nIMPORTANT: The "media" table does not exist. Please run the CREATE TABLE SQL in your Supabase Dashboard.');
      process.exit(1);
    }
    return false;
  }

  console.log(`Successfully uploaded and logged: ${destPath}`);
  return true;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4'
  };
  return map[ext] || 'application/octet-stream';
}

async function main() {
  // Check/Create Bucket
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('Error listing buckets:', bucketsError);
    process.exit(1);
  }

  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.log(`Creating bucket '${BUCKET_NAME}'...`);
    const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true
    });
    if (createBucketError) {
      console.error('Failed to create bucket:', createBucketError.message);
      process.exit(1);
    }
  }

  // Walk directory
  let totalUploaded = 0;
  async function walkDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await walkDir(fullPath);
      } else {
        const relativePath = path.relative(SOURCE_DIR, fullPath);
        const success = await uploadFile(fullPath, relativePath);
        if (success) totalUploaded++;
      }
    }
  }

  console.log(`Starting upload from ${SOURCE_DIR} to bucket '${BUCKET_NAME}'...`);
  await walkDir(SOURCE_DIR);
  
  console.log(`\nFinished! Total files uploaded and logged: ${totalUploaded}`);
  
  // Fetch sample rows
  const { data: sampleMedia, error: sampleError } = await supabase
    .from('media')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(3);

  if (sampleError) {
    console.error('Could not fetch sample media rows:', sampleError.message);
  } else {
    console.log('\nSample rows from "media" table:');
    console.table(sampleMedia);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
});
