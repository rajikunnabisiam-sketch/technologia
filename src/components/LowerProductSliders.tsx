'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Cpu } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from './ProductCard';

interface LowerProductSliderProps {
  title: string;
  subtitle: string;
  categoryFilter?: string;
  featuredOnly?: boolean;
  viewAllLink: string;
}

/**
 * Lower homepage horizontal product sliders.
 * STRICT SPECIFICATION (FR-HOME-04, ADR-003, ISS-HOME-03):
 * Lower sliders MUST NOT auto-play. They move only when swiped or scrolled manually by the user!
 */
export const LowerProductSlider: React.FC<LowerProductSliderProps> = ({
  title,
  subtitle,
  categoryFilter,
  featuredOnly,
  viewAllLink,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products according to category or featured flag
  const products = PRODUCTS.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (featuredOnly && !p.isFeatured) return false;
    return true;
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white/70 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar with Manual Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Distributor Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href={viewAllLink}
              className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 hover:underline mr-2"
            >
              <span>View All Category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Manual Scroll Buttons (Static carousel - no auto-play) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 flex items-center justify-center transition shadow-2xs hover:border-neutral-300 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 flex items-center justify-center transition shadow-2xs hover:border-neutral-300 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 
          Horizontal Product Carousel.
          STRICTLY STATIC: No autoPlay interval. Scrolls only when user swipes/clicks.
        */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] lg:w-[300px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
