import { createClient } from '@/utils/supabase/client';

export const GADGETS_BUCKET = 'gadgets';

/**
 * Uploads a file to the Supabase Storage bucket `gadgets`
 * @param file The file to upload
 * @param folder Subfolder e.g. 'products' or 'slides'
 * @returns Public URL of the uploaded image
 */
export async function uploadGadgetImage(file: File, folder: 'products' | 'slides' | 'reviews' = 'products'): Promise<string> {
  const supabase = createClient();
  
  // Clean filename: remove special characters and add timestamp
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}-${cleanName}`;

  const { data, error } = await supabase.storage
    .from(GADGETS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL for the uploaded file
  const { data: urlData } = supabase.storage
    .from(GADGETS_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Deletes an image from the Supabase Storage bucket
 * @param fileUrl The full public URL or storage path
 */
export async function deleteGadgetImage(fileUrl: string): Promise<boolean> {
  if (!fileUrl || !fileUrl.includes(GADGETS_BUCKET)) {
    return false; // Local image or non-supabase url, ignore
  }

  const supabase = createClient();
  
  // Extract path from public URL
  const parts = fileUrl.split(`${GADGETS_BUCKET}/`);
  if (parts.length < 2) return false;
  const path = parts[1];

  const { error } = await supabase.storage
    .from(GADGETS_BUCKET)
    .remove([path]);

  if (error) {
    console.warn('Failed to delete image from storage:', error.message);
    return false;
  }
  return true;
}

/**
 * Resolves an image URL: returns public Supabase storage URL or falls back to local image path
 */
export function resolveImageUrl(url?: string): string {
  if (!url) return '/images/products/soundcore-r60i-main.jpg';
  return url;
}
