'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase/client';

const IMAGE_FOLDER = 'spice-jars';
const BUCKET = 'product-images';
const SIGNED_URL_EXPIRY = 3600; // 1 hour

const SEO_ALT_TEXTS = [
  'Premium revolving wooden spice rack with 12 airtight jars – kitchen organizer',
  'Airtight spice jars set – masala box for Indian kitchen, 12-piece',
  '360 degree rotating wooden masala box – spice rack organizer',
  'Close-up of airtight lids on spice jars – fresh masala storage',
  'Wooden finish revolving spice rack on kitchen counter – home and kitchen',
  'Gift-ready packaging – premium 12-jar spice organizer set',
];

interface Props {
  /** Fallback images from the product record if Supabase Storage bucket is empty */
  productImages?: string[];
}

export function SpiceJarGallery({ productImages = [] }: Props) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const supabase = getSupabaseClient();

        // Try to list files in the spice-jars folder
        const { data: files, error } = await supabase.storage
          .from(BUCKET)
          .list(IMAGE_FOLDER, { limit: 6 });

        if (error || !files || files.length === 0) {
          // Fall back to product images from DB
          setImageUrls(productImages.slice(0, 6));
          setLoading(false);
          return;
        }

        // Generate signed URLs for each file
        const signedUrls = await Promise.all(
          files
            .filter((f) => f.name !== '.emptyFolderPlaceholder')
            .map(async (file) => {
              const { data } = await supabase.storage
                .from(BUCKET)
                .createSignedUrl(`${IMAGE_FOLDER}/${file.name}`, SIGNED_URL_EXPIRY);
              return data?.signedUrl ?? '';
            })
        );

        const valid = signedUrls.filter(Boolean);
        setImageUrls(valid.length > 0 ? valid : productImages.slice(0, 6));
      } catch {
        setImageUrls(productImages.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [productImages]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl"
            style={{ backgroundColor: 'var(--surface-200, #e5e7eb)' }}
          />
        ))}
      </div>
    );
  }

  if (imageUrls.length === 0) return null;

  return (
    <section aria-label="Spice Jar Set Product Gallery – Home & Kitchen">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <Image
              src={url}
              alt={
                SEO_ALT_TEXTS[index] ??
                'Premium revolving wooden spice rack – airtight masala box kitchen organizer'
              }
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={index === 0}
            />
            {index === 0 && (
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    color: '#1a1a1a',
                    backdropFilter: 'blur(4px)',
                  }}>
                  🌀 360° Revolving Rack
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
