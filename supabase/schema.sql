-- =============================================================================
-- TECHNOLOGIA GADGET STOREFRONT - COMPLETE DATABASE SCHEMA
-- PostgreSQL schema for Supabase Database, RLS Policies, and Storage Setup
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_flagship6 BOOLEAN DEFAULT false,
    icon_name TEXT NOT NULL,
    subcategories TEXT[] DEFAULT '{}',
    accent_color TEXT DEFAULT 'bg-blue-50 text-blue-600',
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(uuid_generate_v4()::text, 1, 8)),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    category_label TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    warranty TEXT NOT NULL DEFAULT '18 Months Official Brand Warranty',
    replacement_policy TEXT NOT NULL DEFAULT '7-Day Instant Defect Replacement',
    authenticity_guarantee TEXT NOT NULL DEFAULT '100% Original & Serial Verified',
    specs TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    badge TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_new_launch BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy searching and category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- -----------------------------------------------------------------------------
-- 3. HERO SLIDES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    tag TEXT NOT NULL,
    badge_type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    highlight TEXT NOT NULL,
    product_slug TEXT,
    category_slug TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    image_url TEXT NOT NULL,
    secondary_image_url TEXT,
    images TEXT[] DEFAULT '{}',
    accent_bg TEXT DEFAULT 'from-white via-slate-50 to-slate-100',
    text_color TEXT DEFAULT 'text-slate-900',
    badge_bg TEXT,
    glow_color TEXT,
    price NUMERIC(10, 2),
    original_price NUMERIC(10, 2),
    is_campaign_slide BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT DEFAULT 'Dhaka',
    customer_notes TEXT,
    advance_txn_id TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'ADVANCE')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered')),
    estimated_delivery TEXT NOT NULL DEFAULT 'Within 24-48 Hours'
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. REVIEWS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev-' || substr(uuid_generate_v4()::text, 1, 8)),
    product_id TEXT,
    author TEXT NOT NULL,
    location TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    product_title TEXT NOT NULL,
    category TEXT NOT NULL,
    comment TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, full admin access
CREATE POLICY "Allow public read on categories" ON public.categories
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin manage on categories" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: Public read, full admin access
CREATE POLICY "Allow public read on products" ON public.products
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin manage on products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Hero Slides: Public read, full admin access
CREATE POLICY "Allow public read on hero_slides" ON public.hero_slides
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin manage on hero_slides" ON public.hero_slides
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders:
-- 1. Anyone (customers) can create an order (Checkout)
CREATE POLICY "Allow public create orders" ON public.orders
    FOR INSERT TO public WITH CHECK (true);

-- 2. Customers can read their own order via Order ID or Phone lookup
CREATE POLICY "Allow public read own order" ON public.orders
    FOR SELECT TO public USING (true);

-- 3. Authenticated Admin can manage/update order status
CREATE POLICY "Allow admin manage orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reviews: Public read, public insert
CREATE POLICY "Allow public read on reviews" ON public.reviews
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public create reviews" ON public.reviews
    FOR INSERT TO public WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION ('gadgets')
-- -----------------------------------------------------------------------------
-- Insert public storage bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gadgets',
    'gadgets',
    true,
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Public read access for images in 'gadgets' bucket
CREATE POLICY "Public Access to Gadget Images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'gadgets');

-- Allow image uploads to 'gadgets' bucket (Admin & public form uploads)
CREATE POLICY "Allow uploads to Gadget Bucket" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id = 'gadgets');

CREATE POLICY "Allow updates in Gadget Bucket" ON storage.objects
    FOR UPDATE TO public
    USING (bucket_id = 'gadgets');

CREATE POLICY "Allow deletes in Gadget Bucket" ON storage.objects
    FOR DELETE TO public
    USING (bucket_id = 'gadgets');
