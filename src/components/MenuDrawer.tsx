'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  MessageSquare,
  Headphones,
  BatteryCharging,
  Zap,
  Watch,
  Utensils,
  Sparkles,
  Radio,
  Laptop,
  Wind,
  Activity,
  ChevronRight,
  ArrowRight,
  Truck,
  Star,
  RotateCcw
} from 'lucide-react';
import { ALL_CATEGORY_DIRECTORIES } from '@/data/categories';
import { BrandLogo } from './BrandLogo';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryVisual {
  icon: React.ComponentType<{ className?: string }>;
  subtext: string;
  bg: string;
  text: string;
  badgeClass: string;
}

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  'Headphones & Audio': {
    icon: Headphones,
    subtext: 'AirPods, Sony XM5, Soundcore ANC',
    bg: 'bg-blue-50 group-hover:bg-blue-600',
    text: 'text-blue-600 group-hover:text-white',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/80',
  },
  'Power Banks & Portable Power': {
    icon: BatteryCharging,
    subtext: '20,000mAh, 140W Anker Prime & Baseus',
    bg: 'bg-amber-50 group-hover:bg-amber-600',
    text: 'text-amber-600 group-hover:text-white',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80',
  },
  'Fast GaN Chargers & Cables': {
    icon: Zap,
    subtext: 'GaN5 Pro, 65W–120W High Velocity',
    bg: 'bg-emerald-50 group-hover:bg-emerald-600',
    text: 'text-emerald-600 group-hover:text-white',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  },
  'Smart Watches & Fitness Bands': {
    icon: Watch,
    subtext: 'Apple Watch Ultra, AMOLED GPS Tracker',
    bg: 'bg-purple-50 group-hover:bg-purple-600',
    text: 'text-purple-600 group-hover:text-white',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/80',
  },
  'Smart Kitchen & Home Appliances': {
    icon: Utensils,
    subtext: 'Smart Air Fryers, OLED Kettles & Vacs',
    bg: 'bg-orange-50 group-hover:bg-orange-600',
    text: 'text-orange-600 group-hover:text-white',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200/80',
  },
  'Personal Grooming & Care': {
    icon: Sparkles,
    subtext: 'Wet & Dry Shavers, Ionic Hair Dryers',
    bg: 'bg-rose-50 group-hover:bg-rose-600',
    text: 'text-rose-600 group-hover:text-white',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  },
  'MagSafe Wireless Accessories': {
    icon: Radio,
    subtext: 'Magnetic Power Banks & Wireless Docks',
    bg: 'bg-cyan-50 group-hover:bg-cyan-600',
    text: 'text-cyan-600 group-hover:text-white',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  },
  'Laptop High-Wattage GaN Stations': {
    icon: Laptop,
    subtext: '100W–200W Multi-Port Desktop Hubs',
    bg: 'bg-slate-100 group-hover:bg-slate-900',
    text: 'text-slate-700 group-hover:text-white',
    badgeClass: 'bg-slate-100 text-slate-800 border border-slate-300',
  },
  'Robotic Vacuums & Air Purifiers': {
    icon: Wind,
    subtext: 'HEPA H11 Smart Laser Robot Cleaners',
    bg: 'bg-teal-50 group-hover:bg-teal-600',
    text: 'text-teal-600 group-hover:text-white',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
  },
  'Sonic Oral Care & Massage Guns': {
    icon: Activity,
    subtext: 'Sonic Electric Brushes & Deep Tissue',
    bg: 'bg-violet-50 group-hover:bg-violet-600',
    text: 'text-violet-600 group-hover:text-white',
    badgeClass: 'bg-pink-50 text-pink-700 border border-pink-200/80',
  },
};

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop with smooth blur */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        
        {/* =========================================================================
            DRAWER HEADER
           ========================================================================= */}
        <div className="px-4 py-4 sm:px-5 sm:py-4.5 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <BrandLogo variant="light" size="sm" showTagline={false} />
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Store</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shadow-2xs active:scale-95"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            PROMOTIONAL MEGA FEST CAMPAIGN STRIP (High Impact Event Card)
           ========================================================================= */}
        <div className="px-3 sm:px-4 pt-3 pb-1">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Grand Mega Fest • Nov 7–15</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 leading-snug truncate">
                  Save up to ৳8,500 + Free COD
                </h4>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">
                  Voucher: <strong className="text-amber-300 font-bold">MEGA2026</strong>
                </p>
              </div>

              <Link
                href="/category/headphones"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-[11px] transition shadow-xs flex items-center gap-1 shrink-0 active:scale-95"
              >
                <span>Deals</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SCROLLABLE CONTENT AREA
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-4 no-scrollbar">
          
          {/* Section: Product Categories */}
          <div>
            <div className="flex items-center justify-between px-2 py-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Product Categories ({ALL_CATEGORY_DIRECTORIES.length})
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                100% Genuine
              </span>
            </div>

            <nav className="space-y-1">
              {ALL_CATEGORY_DIRECTORIES.map((item, index) => {
                const visual = CATEGORY_VISUALS[item.name] || {
                  icon: Headphones,
                  subtext: 'Explore genuine gadgets',
                  bg: 'bg-blue-50 group-hover:bg-blue-600',
                  text: 'text-blue-600 group-hover:text-white',
                  badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
                };
                const Icon = visual.icon;

                return (
                  <Link
                    key={index}
                    href={`/category/${item.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-2xs transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Vibrant Color Icon Box */}
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 shadow-2xs ${visual.bg} ${visual.text}`}>
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>

                      {/* Category Title & Detailed Subtext */}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 truncate font-medium mt-0.5">
                          {visual.subtext}
                        </p>
                      </div>
                    </div>

                    {/* Badge & Navigation Arrow */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${visual.badgeClass}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Customer Help & Trust */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-2 py-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customer Help & Trust
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <Link
                href="/track-order"
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition block">
                      Track Active Order
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Nationwide real-time live dispatch status</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </Link>

              <Link
                href="/reviews"
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition block">
                      Customer Reviews
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">320+ authentic verified buyer ratings</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  4.9 ★
                </span>
              </Link>

              <Link
                href="/faq"
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition block">
                      Warranty & Authenticity FAQ
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Official distributor warranty terms</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </Link>

              <Link
                href="/refund-policy"
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition block">
                      7-Day Replacement Policy
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Hassle-free factory defect exchange</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>

        </div>

        {/* =========================================================================
            DRAWER FOOTER: Quick WhatsApp Sales Desk & Hotline
           ========================================================================= */}
        <div className="p-4 bg-slate-50/90 border-t border-slate-200/90">
          <a
            href="https://wa.me/8801712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Sales on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          
          <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Support Desk: 10:00 AM – 10:00 PM</span>
            <span className="text-slate-300">•</span>
            <a href="tel:+8801712345678" className="hover:text-blue-600 transition font-bold text-slate-700">
              01712-345678
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
