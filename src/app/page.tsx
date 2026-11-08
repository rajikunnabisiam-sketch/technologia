'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  BatteryCharging, 
  Headphones, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  Star,
  RotateCcw,
  MessageCircle,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';
import { VisionaryScreen } from '@/components/VisionaryScreen';
import { CategoryIconGrid } from '@/components/CategoryIconGrid';
import { WarrantyTrustBanner } from '@/components/WarrantyTrustBanner';
import { LowerProductSlider } from '@/components/LowerProductSliders';
import { BrandsByShop } from '@/components/BrandsByShop';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { REVIEWS } from '@/data/reviews';

export default function HomePage() {
  // Curated subsets for homepage sections
  const flashDeals = PRODUCTS.filter((p) => p.badge === 'Hot Deal' || p.badge === 'Bestseller').slice(0, 4);
  const newLaunches = PRODUCTS.filter((p) => p.isNewLaunch || p.badge === 'New Launch').slice(0, 4);

  return (
    <div className="relative min-h-screen bg-slate-50/30">
      
      {/* 
        Soothing Modern Architectural Tech Studio Background Design
        Includes fine micro-dot matrix pattern, soft diffused ambient glows, and minimalist tech crosshair anchors
      */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Fine Architectural Micro-Dot Matrix Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Soft, Soothing Diffused Ambient Light Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -left-32 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-amber-100/25 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist Tech Geometric Crosshair Accents in negative margins */}
        <div className="hidden 2xl:flex flex-col justify-between absolute inset-y-16 left-6 text-slate-300 select-none">
          <span className="text-xs font-semibold tracking-tighter opacity-60">✦</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">+</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">✦</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">+</span>
        </div>
        <div className="hidden 2xl:flex flex-col justify-between absolute inset-y-16 right-6 text-slate-300 select-none">
          <span className="text-xs font-semibold tracking-tighter opacity-60">+</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">✦</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">+</span>
          <span className="text-xs font-semibold tracking-tighter opacity-60">✦</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10">
        
        {/* 
          1. Top "Visionary Screen" (Hero Carousel)
          FR-HOME-01, FR-HOME-02: Auto-advances every 4000ms, NO PAUSE BUTTON, touch-swipe resets timer.
        */}
        <VisionaryScreen />

        {/* 
          2. 6-Pillar Category Icon Grid
          FR-NAV-05, US-1.2, ADR-002: Strictly capped at 6 categories with custom vector icons.
        */}
        <CategoryIconGrid />

        {/* 
          3. Humorous Homepage Warranty & Authenticity Banner
          FR-HOME-03, US-2.2, ADR-008: Locked witty headline + 3 trust pills.
        */}
        <WarrantyTrustBanner />

        {/* 
          Dedicated Newly Launched Products Showcase
        */}
        <section className="py-8 sm:py-12 bg-white/70 backdrop-blur-xs border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Arrivals • 2026 Catalog</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                Newly Launched Devices
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Direct factory-sealed arrivals with official manufacturer warranties and scannable serial authenticity.
              </p>
            </div>
            
            <Link
              href="/category/headphones"
              className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 self-start sm:self-auto hover:underline"
            >
              <span>View Audio Devices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newLaunches.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 
        4. Lower Homepage Sliders & Product Highlights
        FR-HOME-04, US-2.3, ADR-003, ISS-HOME-03:
        STRICT RULE: All lower sliders must be STATIC and NOT auto-play.
      */}
      
      {/* Slider A: Power Banks & Laptop Chargers (Static Carousel) */}
      <LowerProductSlider
        title="High-Wattage Power Banks & GaN Chargers"
        subtitle="Up to 200W high-speed charging for laptops, smartphones & tablets."
        categoryFilter="power-banks"
        viewAllLink="/category/power-banks"
      />

      {/* Brands By Shop: Interactive Brand Scroller & Sort by Brand Repository */}
      <BrandsByShop />

      {/* Slider B: Headphones, Audio & Personal Care (Static Carousel) */}
      <LowerProductSlider
        title="Active Noise Cancelling & Grooming Tech"
        subtitle="Hi-Res wireless audio, hybrid ANC, and precision wet/dry grooming devices."
        categoryFilter="headphones"
        viewAllLink="/category/headphones"
      />

        {/* Flash Deals & Top Rated Grid */}
        <section className="py-8 sm:py-12 bg-white/70 backdrop-blur-xs border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-600 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Featured Hot Picks</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                  Top Rated Deals & Best Sellers
                </h2>
              </div>
              <Link
                href="/category/chargers"
                className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 hover:underline"
              >
                <span>View All Catalog Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Customer Trust & Verified Reviews Teaser */}
        <section className="py-10 sm:py-12 bg-slate-50/60 backdrop-blur-xs border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Reviews • 320+ Purchases</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                  Trusted by 10,000+ Gadget Enthusiasts
                </h2>
              </div>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-800 hover:border-neutral-400 shadow-2xs transition"
              >
                <span>Read All Verified Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {REVIEWS.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 uppercase">
                        Serial Verified
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 italic line-clamp-3 leading-relaxed mb-3">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-bold text-neutral-900">{rev.author}</span>
                    <span>{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
