'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Headphones, 
  BatteryCharging, 
  Zap, 
  Watch, 
  Home, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FLAGSHIP_CATEGORIES } from '@/data/categories';
import { Category } from '@/types';

// Map icon names to Lucide components
const iconComponents = {
  Headphones: Headphones,
  BatteryCharging: BatteryCharging,
  Zap: Zap,
  Watch: Watch,
  Home: Home,
  Sparkles: Sparkles,
};

export const CategoryIconGrid: React.FC = () => {
  // STRICT RULE (ISS-NAV-03): Homepage icon grid strictly capped at exactly 6 categories
  const flagship6 = FLAGSHIP_CATEGORIES.filter((c) => c.isFlagship6).slice(0, 6);

  return (
    <section className="py-8 sm:py-10 bg-white/70 backdrop-blur-xs border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">
              <span>Core Gadget Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Flagship Hardware Categories
            </h2>
          </div>
          <span className="text-xs font-semibold text-neutral-500 hidden sm:inline-block">
            100% Genuine Brands • Zero Replicas
          </span>
        </div>

        {/* 6-Category Grid: 2x3 mobile, 3x2 tablet, 6x1 desktop (FR-NAV-05, ADR-002) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {flagship6.map((category: Category, idx: number) => {
            const IconComponent = iconComponents[category.iconName];
            const indexStr = `0${idx + 1}`;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/5 transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Top index number */}
                <div className="w-full flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-neutral-400 group-hover:text-blue-600 transition-colors">
                    {indexStr}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-bold bg-neutral-100 group-hover:bg-blue-50 group-hover:text-blue-700 px-2 py-0.5 rounded-md transition">
                    {category.itemCount} Items
                  </span>
                </div>

                {/* Vector Icon Container with custom background */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-100 group-hover:bg-blue-600 group-hover:text-white border border-neutral-200/80 group-hover:border-blue-600 flex items-center justify-center text-neutral-700 transition-all duration-200 mb-3 shadow-2xs">
                  {IconComponent && <IconComponent className="w-6 h-6 stroke-[1.75]" />}
                </div>

                {/* Category Name & Action */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {category.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-neutral-400 group-hover:text-blue-600 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
