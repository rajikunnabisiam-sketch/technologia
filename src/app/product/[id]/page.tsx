'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShoppingCart, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  Truck, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Heart
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { getProductById } from '@/services/productService';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { RelianceStrip } from '@/components/RelianceStrip';
import { ProductCard } from '@/components/ProductCard';
import { ProductReviewsSection } from '@/components/ProductReviewsSection';
import { formatCurrency, getDiscountPercentage } from '@/utils/formatters';
import { buildProductWhatsAppUrl } from '@/utils/whatsapp';

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  // Find product by id or slug with live Supabase sync
  const [product, setProduct] = useState<Product | null>(() => {
    return PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  });

  React.useEffect(() => {
    if (idOrSlug) {
      getProductById(idOrSlug).then((p) => {
        if (p) setProduct(p);
      });
    }
  }, [idOrSlug]);

  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'specs' | 'features' | 'warranty' | 'reviews'>('specs');
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');

  React.useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested gadget could not be located in our catalog.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const discountPercent = getDiscountPercentage(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  // Related products from the same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-slate-50/60 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href={`/category/${product.category}`} className="hover:text-blue-600 transition">
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 lg:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-lg rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-4 shadow-xs">
                <img
                  src={activeImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-xl transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                  }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-zinc-950 text-white shadow-md border border-zinc-700">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-md">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Factory Sealed</span>
                </div>
              </div>

              {/* Gallery Thumbnails (Other images) */}
              {product.images && product.images.length > 1 && (
                <div className="w-full max-w-lg flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 p-1.5 bg-white transition-all flex-shrink-0 flex items-center justify-center ${
                        activeImage === imgUrl
                          ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                      title={`View image angle ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} angle ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) parent.style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-zinc-900/80 text-white px-1.5 py-0.2 rounded">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trust assurance line below image */}
              <div className="w-full max-w-lg flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>Doorstep Delivery Nationwide</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>100% Factory Sealed</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Dual Buttons & Mandatory 3-Point Trust Strip */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                
                {/* Brand & Category pill */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    {product.brand}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Category: {product.categoryLabel}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Rating & In-Stock row */}
                <div className="flex items-center gap-4 text-xs mb-4 pb-4 border-b border-slate-100">
                  <a href="#customer-reviews" className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition group" title="Jump to customer reviews">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span className="text-slate-400 group-hover:text-blue-500 font-normal">({product.reviewsCount} verified reviews)</span>
                  </a>

                  <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock (Ready to Ship)
                  </span>
                </div>

                {/* Clean, Authentic Pricing Display */}
                <div className="my-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-normal">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Price inclusive of VAT • Eligible for Cash on Delivery nationwide</span>
                  </p>
                </div>

                {/* 
                  MANDATORY 3-POINT RELIANCE STRIP (FR-PDP-02, US-3.2, ADR-008, ISS-PDP-01, ISS-PDP-02)
                  Positioned directly adjacent to purchase buttons so customers see warranty assurance at point of decision!
                */}
                <RelianceStrip
                  warranty={product.warranty}
                  replacementPolicy={product.replacementPolicy}
                  authenticityGuarantee={product.authenticityGuarantee}
                />

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 my-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total: <strong>{formatCurrency(product.price * quantity)}</strong>
                  </span>
                </div>

                {/* 
                  DUAL ACTION BUTTONS (FR-PDP-03, US-4.1, US-4.2)
                  1. Add to Cart
                  2. Order via WhatsApp (auto-fill single item inquiry)
                */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* 1. Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                        added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Quick Buy Now */}
                    <button
                      onClick={handleBuyNow}
                      className="py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
                    >
                      Instant Checkout
                    </button>

                  </div>

                  {/* 2. Direct WhatsApp Auto-Fill Button */}
                  <a
                    href={buildProductWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Order / Inquire via WhatsApp (Auto-Filled)</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Detailed Tabs: Specs, Features & Warranty Terms */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-12">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setSelectedTab('specs')}
              className={`px-4 sm:px-6 py-3 sm:py-4 transition border-b-2 shrink-0 ${
                selectedTab === 'specs'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setSelectedTab('features')}
              className={`px-4 sm:px-6 py-3 sm:py-4 transition border-b-2 shrink-0 ${
                selectedTab === 'features'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Product Highlights
            </button>
            <button
              onClick={() => setSelectedTab('warranty')}
              className={`px-4 sm:px-6 py-3 sm:py-4 transition border-b-2 shrink-0 ${
                selectedTab === 'warranty'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Warranty & Authenticity Guarantee
            </button>
            <button
              onClick={() => {
                setSelectedTab('reviews');
                const el = document.getElementById('customer-reviews');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 transition border-b-2 shrink-0 flex items-center gap-1.5 ${
                selectedTab === 'reviews'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                {product.reviewsCount}
              </span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            {selectedTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Key Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              </div>
            )}

            {selectedTab === 'features' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Engineered Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-800 font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'warranty' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>{product.warranty}</span>
                  </h4>
                  <p className="text-emerald-800 text-xs">
                    This item is covered under our official manufacturer-backed warranty policy. Any hardware fault or factory defect during the coverage window will be serviced or replaced according to standard brand terms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-1">Authenticity Pledge</h5>
                    <p className="text-xs text-slate-500">
                      We strictly sell brand-new, factory-sealed goods with verifiable serial numbers. If this product fails brand verification, we guarantee a 200% refund.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-1">7-Day Replacement Policy</h5>
                    <p className="text-xs text-slate-500">
                      Received a damaged or malfunctioning unit? Notify us on WhatsApp within 7 calendar days of delivery for immediate doorstep replacement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Dedicated Verified Customer Reviews Section with Star Rating & Photo Attachment */}
        <ProductReviewsSection
          productId={product.id}
          productTitle={product.title}
          productCategory={product.categoryLabel}
          initialRating={product.rating}
          initialReviewsCount={product.reviewsCount}
          productImage={product.image}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  More in {product.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  You Might Also Like
                </h3>
              </div>
              <Link
                href={`/category/${product.category}`}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All {product.categoryLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

