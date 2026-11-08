import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { FLAGSHIP_CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import { mapProductToRow } from './productService';

export interface SeedResult {
  success: boolean;
  categoriesCount: number;
  productsCount: number;
  message: string;
}

/**
 * Seeds the initial catalog (Categories & Products) into Supabase.
 * Safe to run multiple times: uses UPSERT to prevent duplicate errors.
 */
export async function seedInitialCatalogToSupabase(): Promise<SeedResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      categoriesCount: 0,
      productsCount: 0,
      message: 'Supabase is not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.',
    };
  }

  const supabase = createClient();

  try {
    // 1. Seed Categories
    const categoryRows = FLAGSHIP_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      is_flagship6: cat.isFlagship6 ?? true,
      icon_name: cat.iconName,
      subcategories: cat.subcategories,
      accent_color: cat.accentColor,
      item_count: cat.itemCount,
      updated_at: new Date().toISOString(),
    }));

    const { error: catError } = await supabase
      .from('categories')
      .upsert(categoryRows, { onConflict: 'id' });

    if (catError) {
      throw new Error(`Category seed failed: ${catError.message}`);
    }

    // 2. Seed Products
    const productRows = PRODUCTS.map((prod) => mapProductToRow(prod));

    const { error: prodError } = await supabase
      .from('products')
      .upsert(productRows, { onConflict: 'id' });

    if (prodError) {
      throw new Error(`Product seed failed: ${prodError.message}`);
    }

    return {
      success: true,
      categoriesCount: categoryRows.length,
      productsCount: productRows.length,
      message: `Successfully seeded ${categoryRows.length} categories and ${productRows.length} authentic products to Supabase!`,
    };
  } catch (err: any) {
    console.error('Seed catalog error:', err);
    return {
      success: false,
      categoriesCount: 0,
      productsCount: 0,
      message: err?.message || 'Unknown error occurred while seeding database.',
    };
  }
}
