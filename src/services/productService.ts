import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { Product } from '@/types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '@/data/products';

// Helper to convert database row (snake_case) to Product interface (camelCase)
export function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    categoryLabel: row.category_label,
    brand: row.brand,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    inStock: Boolean(row.in_stock),
    warranty: row.warranty,
    replacementPolicy: row.replacement_policy,
    authenticityGuarantee: row.authenticity_guarantee,
    specs: Array.isArray(row.specs) ? row.specs : [],
    description: row.description,
    features: Array.isArray(row.features) ? row.features : [],
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    badge: row.badge || undefined,
    isFeatured: Boolean(row.is_featured),
    isNewLaunch: Boolean(row.is_new_launch),
  };
}

// Helper to convert Product interface to database row
export function mapProductToRow(p: Partial<Product>) {
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.title !== undefined) row.title = p.title;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.category !== undefined) row.category = p.category;
  if (p.categoryLabel !== undefined) row.category_label = p.categoryLabel;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.price !== undefined) row.price = p.price;
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.reviewsCount !== undefined) row.reviews_count = p.reviewsCount;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.warranty !== undefined) row.warranty = p.warranty;
  if (p.replacementPolicy !== undefined) row.replacement_policy = p.replacementPolicy;
  if (p.authenticityGuarantee !== undefined) row.authenticity_guarantee = p.authenticityGuarantee;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.description !== undefined) row.description = p.description;
  if (p.features !== undefined) row.features = p.features;
  if (p.image !== undefined) row.image = p.image;
  if (p.images !== undefined) row.images = p.images;
  if (p.badge !== undefined) row.badge = p.badge;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.isNewLaunch !== undefined) row.is_new_launch = p.isNewLaunch;
  row.updated_at = new Date().toISOString();
  return row;
}

/**
 * Fetch all products dynamically from Supabase.
 * Gracefully falls back to bundled catalog if Supabase is offline or empty.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_PRODUCTS;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_PRODUCTS;
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn('Failed to fetch products from Supabase, using defaults:', err);
    return DEFAULT_PRODUCTS;
  }
}

/**
 * Get product by ID or Slug
 */
export async function getProductById(idOrSlug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const fallback = DEFAULT_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return fallback || null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (error || !data) {
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      return fallback || null;
    }

    return mapRowToProduct(data);
  } catch {
    const fallback = DEFAULT_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return fallback || null;
  }
}

/**
 * Create a new product in Supabase
 */
export async function createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const supabase = createClient();
  const row = mapProductToRow(product);

  const { data, error } = await supabase
    .from('products')
    .insert([row])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return mapRowToProduct(data);
}

/**
 * Update an existing product in Supabase
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const supabase = createClient();
  const row = mapProductToRow(updates);

  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return mapRowToProduct(data);
}

/**
 * Delete a product from Supabase
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return true;
}
