'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  ShieldCheck, 
  X, 
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Truck,
  Calendar,
  Sparkles,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { buildSearchFallbackWhatsAppUrl } from '@/utils/whatsapp';
import { formatCurrency } from '@/utils/formatters';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenMenu: () => void;
}

const MARQUEE_NEWS = [
  {
    badge: 'MEGA SALE OFFER',
    badgeColor: 'bg-red-600 text-white',
    title: 'Grand Gadget Mega Fest: Save up to ৳8,500 on Flagship Audio, Power Banks & Smartwatches',
    highlight: 'Use Voucher: MEGA2026 for Extra ৳500 Discount',
    icon: Sparkles,
  },
  {
    badge: 'FREE DELIVERY',
    badgeColor: 'bg-emerald-600 text-white',
    title: 'Free Express Delivery Nationwide with Cash on Delivery (COD)',
    highlight: 'Zero delivery charges on all gadget orders over ৳2,000',
    icon: Truck,
  },
  {
    badge: 'EVENT PERIOD',
    badgeColor: 'bg-amber-400 text-slate-950 font-black',
    title: 'Festival Offer Valid: November 07 – November 15, 2026',
    highlight: 'Strictly limited 48-hour distributor allotment • Factory-sealed serials only',
    icon: Calendar,
  },
  {
    badge: '100% OFFICIAL',
    badgeColor: 'bg-blue-600 text-white',
    title: '100% Original Tech with Official Manufacturer Warranty',
    highlight: '7-Day Instant Defect Replacement Guarantee across Bangladesh',
    icon: ShieldCheck,
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenu }) => {
  const router = useRouter();
  const { totalItems, setIsCartOpen, isMounted } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search over title, brand, and category
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches = PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    setSearchResults(matches);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      {/* Continuous Marquee Headline: Sale Offer, Free Delivery News & Date Period */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 sm:py-2.5 border-b border-slate-800/90 overflow-hidden relative select-none group shadow-inner">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-16 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-16 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10" />

        {/* Continuous ticker track: pauses on hover for effortless reading */}
        <div className="animate-marquee-track flex items-center gap-8 whitespace-nowrap">
          {/* Track Sequence 1 */}
          {MARQUEE_NEWS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-2.5 flex-shrink-0 text-[11px] sm:text-xs">
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase shadow-xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{item.title}</span>
                </span>
                <span className="text-slate-400 font-medium">({item.highlight})</span>
                <span className="text-slate-600 font-bold ml-5">✦</span>
              </div>
            );
          })}

          {/* Track Sequence 2 (Cloned for seamless infinite loop) */}
          {MARQUEE_NEWS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-2.5 flex-shrink-0 text-[11px] sm:text-xs">
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase shadow-xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{item.title}</span>
                </span>
                <span className="text-slate-400 font-medium">({item.highlight})</span>
                <span className="text-slate-600 font-bold ml-5">✦</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Left: Corner Three-Bar (≡) Menu Button & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Corner Three-Bar Button (FR-NAV-04) */}
            <button
              onClick={onOpenMenu}
              type="button"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              aria-label="Open Category Navigation Menu"
              title="Browse All Categories (≡)"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bespoke Hand-Crafted Brand Logo */}
            <BrandLogo variant="light" size="md" />
          </div>

          {/* Center: Search Bar with EXACT placeholder (FR-NAV-02, ISS-NAV-01) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Looking for any product?"
                className="w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm rounded-2xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Instant Real-Time Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[75vh] flex flex-col">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Results for &ldquo;<strong className="text-slate-800">{searchQuery}</strong>&rdquo; ({searchResults.length})
                  </span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="hover:text-slate-800 font-medium"
                  >
                    Close
                  </button>
                </div>

                <div className="overflow-y-auto divide-y divide-slate-100 p-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50/60 rounded-xl cursor-pointer transition group"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {product.brand}
                            </span>
                            <span className="text-[10px] text-blue-600 font-medium">
                              {product.categoryLabel}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                      </div>
                    ))
                  ) : (
                    /* Zero Search Results Fallback (PRD Sec 5.2 / Edge Cases) */
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        No exact match for &ldquo;{searchQuery}&rdquo;
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Don&rsquo;t worry! We source authentic gadgets directly upon request.
                      </p>
                      
                      {/* Direct WhatsApp auto-fill search button */}
                      <a
                        href={buildSearchFallbackWhatsAppUrl(searchQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Ask us on WhatsApp about &ldquo;{searchQuery}&rdquo;
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Cart Button with Persistent Item Count Badge (FR-NAV-03, ISS-NAV-04) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900 active:scale-95 shadow-2xs"
              aria-label="View Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              
              {/* Badge rendered with isMounted check to eliminate SSR hydration mismatch */}
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-bold text-[10px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

