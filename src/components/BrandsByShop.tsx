'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

interface BrandConfig {
  id: string;
  name: string;
  tagline: string;
  renderLogo: () => React.ReactNode;
}

const BRANDS_LIST: BrandConfig[] = [
  {
    id: 'ALL',
    name: 'All Brands',
    tagline: 'Storewide Authorized',
    renderLogo: () => (
      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs tracking-wider">
        ALL
      </div>
    ),
  },
  {
    id: 'AMD Ryzen',
    name: 'AMD Ryzen',
    tagline: 'High-Performance Processors',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <path
            d="M50 10 A40 40 0 1 0 88 65 A32 32 0 1 1 50 18 Z"
            fill="url(#ryzenGrad)"
          />
          <defs>
            <linearGradient id="ryzenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EA1D2C" />
              <stop offset="100%" stopColor="#FA5F1C" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-black text-[9px] tracking-wider text-slate-900 mt-0.5">RYZEN</span>
      </div>
    ),
  },
  {
    id: 'Anker',
    name: 'Anker',
    tagline: 'Fast Charging & Audio',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <span className="font-black text-sm sm:text-base tracking-wider text-slate-950 font-sans">
          ANKER
        </span>
        <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-0.5" />
      </div>
    ),
  },
  {
    id: 'Apple',
    name: 'Apple',
    tagline: 'Official Apple Ecosystem',
    renderLogo: () => (
      <svg viewBox="0 0 170 170" className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.44-6.42-9.84-11.39-21.2-14.92-34.07-3.52-12.87-5.28-24.81-5.28-35.81 0-14.77 3.59-26.68 10.77-35.73 7.18-9.05 16.29-13.68 27.34-13.9 4.88 0 10.37 1.34 16.48 4.02 6.11 2.68 10.08 4.09 11.9 4.23 1.58-.27 5.76-1.74 12.54-4.4 6.78-2.67 12.33-3.8 16.65-3.39 12.74.88 22.84 5.37 30.3 13.48-10.88 6.64-16.19 15.68-15.93 27.12.26 9.84 4.07 18.06 11.43 24.66 4.35 3.91 9.4 6.77 15.15 8.57-2.32 6.84-5.36 14.16-9.12 21.96zm-29.36-114.7c0 7.42-2.76 14.37-8.28 20.85-5.52 6.48-12.29 10.45-20.31 11.91-.4-1.33-.6-2.53-.6-3.6 0-7.14 2.89-14.28 8.67-21.41 5.78-7.13 12.78-11.23 21-12.3.13 1.5.21 2.83.21 4.55z" />
      </svg>
    ),
  },
  {
    id: 'ASUS',
    name: 'ASUS',
    tagline: 'Hardware & Peripherals',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <span className="font-black text-sm sm:text-base tracking-widest text-[#00539B] font-sans">
          ASUS
        </span>
        <div className="w-7 h-0.5 bg-[#00539B] mt-0.5 opacity-80" />
      </div>
    ),
  },
  {
    id: 'Awei',
    name: 'Awei',
    tagline: 'Smart Lifestyle Audio',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <span className="font-extrabold text-sm sm:text-base tracking-wide text-slate-900 font-sans lowercase">
          awei<span className="text-red-500 font-bold">®</span>
        </span>
      </div>
    ),
  },
  {
    id: 'Baseus',
    name: 'Baseus',
    tagline: 'Base on User',
    renderLogo: () => (
      <div className="w-9 h-9 rounded-full bg-[#FFD600] flex items-center justify-center shadow-2xs">
        <span className="font-black text-lg text-slate-950 font-sans leading-none pb-0.5 pl-0.5">
          b
        </span>
      </div>
    ),
  },
  {
    id: 'Colmi',
    name: 'Colmi',
    tagline: 'Smart Wearables',
    renderLogo: () => (
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00D2D3] to-[#01a3a4] flex items-center justify-center p-1.5 shadow-2xs">
        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    ),
  },
  {
    id: 'DREAME',
    name: 'DREAME',
    tagline: 'Intelligent Home & Living',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <span className="font-black text-xs sm:text-sm tracking-[0.2em] text-slate-900 font-sans">
          DREAME
        </span>
      </div>
    ),
  },
  {
    id: 'Sony',
    name: 'Sony',
    tagline: 'Acoustic Masterpieces',
    renderLogo: () => (
      <span className="font-serif font-black text-base sm:text-lg tracking-wider text-slate-950">
        SONY
      </span>
    ),
  },
  {
    id: 'Xiaomi',
    name: 'Xiaomi',
    tagline: 'Innovation for Everyone',
    renderLogo: () => (
      <div className="w-9 h-9 rounded-xl bg-[#FF6900] flex items-center justify-center shadow-2xs">
        <span className="text-white font-black text-sm tracking-tighter font-sans">
          mi
        </span>
      </div>
    ),
  },
  {
    id: 'Ugreen',
    name: 'Ugreen',
    tagline: 'Nexode Power Solutions',
    renderLogo: () => (
      <div className="flex items-center gap-0.5">
        <span className="font-black text-xs sm:text-sm tracking-wider text-slate-900 font-sans">
          UGREEN
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
    ),
  },
  {
    id: 'Amazfit',
    name: 'Amazfit',
    tagline: 'Precision GPS Smartwatches',
    renderLogo: () => (
      <span className="font-black text-xs sm:text-sm tracking-widest text-slate-900 font-sans">
        AMAZFIT
      </span>
    ),
  },
  {
    id: 'Philips',
    name: 'Philips',
    tagline: 'Sense and Simplicity',
    renderLogo: () => (
      <span className="font-black text-xs sm:text-sm tracking-wider text-[#0066B2] font-sans">
        PHILIPS
      </span>
    ),
  },
  {
    id: 'Haylou',
    name: 'Haylou',
    tagline: 'Hear the World',
    renderLogo: () => (
      <span className="font-black text-xs sm:text-sm tracking-widest text-slate-900 font-sans">
        HAYLOU
      </span>
    ),
  },
  {
    id: 'Deerma',
    name: 'Deerma',
    tagline: 'Smart Home Appliances',
    renderLogo: () => (
      <span className="font-black text-xs sm:text-sm tracking-wider text-slate-900 font-sans">
        DEERMA
      </span>
    ),
  },
  {
    id: 'Oral-B',
    name: 'Oral-B',
    tagline: 'Personal Dental Care',
    renderLogo: () => (
      <div className="px-2 py-0.5 rounded-full bg-[#002F6C] text-white flex items-center justify-center shadow-2xs">
        <span className="font-bold text-[10px] sm:text-xs font-sans tracking-tight">
          Oral-B
        </span>
      </div>
    ),
  },
];

export const BrandsByShop: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Filter products by selected brand and sort
  const filteredProducts = useMemo(() => {
    let list: Product[] = [];
    if (selectedBrand === 'ALL') {
      list = [...PRODUCTS];
    } else {
      list = PRODUCTS.filter(
        (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    const sorted = [...list];
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [selectedBrand, sortOption]);

  const activeBrandConfig = BRANDS_LIST.find((b) => b.id === selectedBrand);

  return (
    <section className="py-10 bg-slate-50/60 backdrop-blur-xs border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            HEADER ROW: Matching Image 2 ("Brands By Shop" + Left/Right Arrow Controls)
           ========================================================================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Brands By <span className="text-red-600">Shop</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Click any authorized brand to filter & sort authentic factory-sealed gadgets.
            </p>
          </div>

          {/* Navigation Controls: Circular arrows matching Image 2 */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs active:scale-95 hover:border-slate-300"
              aria-label="Scroll Brands Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs active:scale-95 hover:border-slate-300"
              aria-label="Scroll Brands Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            BRAND CARDS HORIZONTAL SCROLLER: Exactly matching Image 2 Layout
           ========================================================================= */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BRANDS_LIST.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`w-[98px] sm:w-[130px] p-2.5 sm:p-3.5 rounded-2xl bg-white border flex flex-col items-center justify-between shrink-0 transition-all duration-200 text-center group cursor-pointer ${
                  isSelected
                    ? 'border-red-400 ring-2 ring-red-100 shadow-md bg-red-50/20'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Logo Box matching Image 2 */}
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center p-1.5 sm:p-2 mb-1.5 sm:mb-2 transition-transform duration-200 group-hover:scale-105 ${
                  isSelected ? 'bg-white shadow-2xs' : 'bg-slate-50'
                }`}>
                  {brand.renderLogo()}
                </div>

                {/* Brand Name Text below logo */}
                <span className={`text-[11px] sm:text-sm font-bold tracking-tight truncate w-full transition-colors ${
                  isSelected ? 'text-red-600' : 'text-slate-800 group-hover:text-red-600'
                }`}>
                  {brand.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            DYNAMIC "SORT BY BRAND" PRODUCT REPOSITORY
           ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          
          {/* Subheader with Status & Sorting Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {selectedBrand === 'ALL' ? 'All Brands' : selectedBrand}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredProducts.length > 0
                  ? `Showing ${filteredProducts.length} verified products`
                  : 'Distributor Pre-Order / Special Allotment'}
              </span>
              {selectedBrand !== 'ALL' && (
                <button
                  onClick={() => setSelectedBrand('ALL')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to All</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="brand-product-sort" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>SORT:</span>
              </label>
              <select
                id="brand-product-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs"
              >
                <option value="featured">Featured Ranking</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Special Order / Distributor Pre-order Desk when brand currently has zero shelf items */
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                Official {activeBrandConfig?.name || selectedBrand} Allotment Desk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-md">
                We supply genuine factory-sealed {activeBrandConfig?.name || selectedBrand} hardware with scannable serial authenticity and official distributor warranties on special dispatch.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/8801712345678?text=${encodeURIComponent(
                    `Hello Technologia! I am looking for official ${activeBrandConfig?.name || selectedBrand} gadgets/components. Can you check inventory and pricing for me?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp Desk</span>
                </a>
                <button
                  onClick={() => setSelectedBrand('ALL')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-2xs transition"
                >
                  <span>Explore Available Brands</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

