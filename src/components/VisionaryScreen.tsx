'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Sparkles,
  Calendar,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { HERO_SLIDES } from '@/data/heroSlides';
import { formatCurrency } from '@/utils/formatters';

const AUTO_SLIDE_INTERVAL = 4000; // 4000ms (4 seconds) as defined in FR-HOME-01

export const VisionaryScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = HERO_SLIDES.length;

  /**
   * Resets and restarts the 4000ms auto-advance timer.
   * Anti-hijack rule (FR-HOME-02, ISS-HOME-01): Timer is cleared on touchstart and restarts only when touch ends.
   */
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_INTERVAL);
  }, [totalSlides]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Initialize auto-advance timer on mount & clean up on unmount (ISS-HOME-04)
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const goToSlide = (index: number) => {
    stopTimer();
    setCurrentSlide(index);
    startTimer();
  };

  const nextSlide = () => {
    stopTimer();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    startTimer();
  };

  const prevSlide = () => {
    stopTimer();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    startTimer();
  };

  // Touch handlers for mobile finger swipes (FR-HOME-02, ISS-HOME-01)
  const handleTouchStart = (e: React.TouchEvent) => {
    stopTimer();
    setIsSwiping(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null) {
      if (touchDeltaX > 50) {
        prevSlide();
      } else if (touchDeltaX < -50) {
        nextSlide();
      }
    }
    setIsSwiping(false);
    setTouchStartX(null);
    setTouchDeltaX(0);
    startTimer();
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    stopTimer();
    setIsSwiping(true);
    setTouchStartX(e.clientX);
    setTouchDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || touchStartX === null) return;
    setTouchDeltaX(e.clientX - touchStartX);
  };

  const handleMouseUp = () => {
    if (isSwiping && touchStartX !== null) {
      if (touchDeltaX > 50) {
        prevSlide();
      } else if (touchDeltaX < -50) {
        nextSlide();
      }
    }
    setIsSwiping(false);
    setTouchStartX(null);
    setTouchDeltaX(0);
    startTimer();
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="py-2.5 sm:py-6 bg-slate-100/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* =========================================================================
              LEFT COLUMN: MAIN HERO GADGET CAROUSEL (lg:col-span-8)
              Preserves FR-HOME-01 (4000ms auto-advance) & FR-HOME-02 (no pause button)
             ========================================================================= */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (isSwiping) handleMouseUp();
              }}
              className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-br ${slide.accentBg || 'from-white via-slate-50 to-slate-100'} text-slate-900 min-h-[440px] sm:min-h-[480px] lg:h-[480px] flex flex-col justify-between shadow-sm select-none cursor-grab active:cursor-grabbing group transition-all duration-500`}
            >
              {/* Subtle background studio dot pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

              {/* Dynamic ambient color backlights */}
              <div className={`absolute -right-8 -bottom-8 w-80 h-80 rounded-full ${slide.glowColor || 'bg-blue-400/20'} blur-3xl pointer-events-none transition-all duration-700`} />
              <div className={`absolute -left-10 -top-10 w-64 h-64 rounded-full ${slide.glowColor || 'bg-blue-400/15'} blur-3xl pointer-events-none transition-all duration-700`} />

              {/* Top Bar inside slider */}
              <div className="relative z-10 px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full ${slide.badgeBg || 'bg-slate-900 text-white'} text-[10px] sm:text-xs font-bold tracking-wide shadow-sm animate-pulse-glow`}>
                  {slide.isCampaignSlide ? (
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  )}
                  <span>{slide.tag}</span>
                </div>

                {/* Integrated Interactive Arrow Controls + Slide Counter (Zero overlapping text or images) */}
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 border border-slate-200/90 px-2 sm:px-3 py-1 rounded-full shadow-2xs backdrop-blur-xs text-xs font-bold text-slate-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="p-1 hover:text-blue-600 active:scale-90 transition rounded-full"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] sm:text-xs font-bold px-1 select-none">
                    {currentSlide + 1} / {totalSlides}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="p-1 hover:text-blue-600 active:scale-90 transition rounded-full"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Slide Content Split with Entrance Animation */}
              <div 
                key={currentSlide}
                className="relative z-10 px-4 sm:px-8 py-2 sm:py-6 flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-6 items-center flex-1 animate-slide-pop"
              >
                
                {/* Popped Up Animated Gadget Showcase (Rendered first on mobile for immediate visual impact) */}
                <div className="order-1 md:order-2 md:col-span-5 flex flex-col items-center justify-center relative py-1 sm:py-2">
                  
                  {/* Floating Ambient Glow Spotlight behind image */}
                  <div className={`absolute w-36 h-36 sm:w-64 sm:h-64 rounded-full ${slide.glowColor || 'bg-blue-400/20'} blur-2xl animate-pulse-glow pointer-events-none`} />

                  {/* Primary Floating Image Canvas */}
                  <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-56 sm:h-56 flex items-center justify-center">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] animate-float transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                      }}
                    />

                    {/* Secondary Angle Floating Preview Card (Clean on tablet & desktop) */}
                    {slide.secondaryImageUrl && (
                      <div className="hidden xs:flex absolute -bottom-1 -right-1 w-14 h-14 sm:w-24 sm:h-24 rounded-2xl bg-white/95 border border-slate-200/90 p-1 shadow-lg shadow-slate-300/40 items-center justify-center overflow-hidden animate-float-delayed group/thumb">
                        <img
                          src={slide.secondaryImageUrl}
                          alt="Product view"
                          className="w-full h-full object-contain transition-transform duration-300 group-hover/thumb:scale-110"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) parent.style.display = 'none';
                          }}
                        />
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-[9px] font-bold bg-slate-900 text-white px-1 py-0.2 rounded shadow-xs">
                          {slide.isCampaignSlide ? 'EVENT' : 'ANGLE'}
                        </span>
                      </div>
                    )}

                    {/* Floating Campaign Badge OR Factory Sealed badge */}
                    {slide.isCampaignSlide ? (
                      <div className="absolute -top-2 -left-2 bg-slate-950 text-white border border-slate-800 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1 sm:gap-1.5 animate-float-delayed">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-wide text-amber-300">
                          MEGA SALE
                        </span>
                      </div>
                    ) : (
                      <div className="absolute -top-2 -left-2 bg-white/95 border border-slate-200/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold text-emerald-700 flex items-center gap-1 shadow-md shadow-slate-200/60 animate-float-delayed">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                        <span>OFFICIAL SEALED</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row if slide has multiple gallery angles (Tablet / Desktop only) */}
                  {slide.images && slide.images.length > 1 && (
                    <div className="hidden md:flex items-center gap-2 mt-4 bg-white/70 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                      {slide.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden hover:border-blue-400 transition"
                        >
                          <img
                            src={img}
                            alt="Preview thumbnail"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) parent.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Text Content Column */}
                <div className="order-2 md:order-1 md:col-span-7 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  
                  {/* UNIFIED SLIDE TITLE: Same exact size across all slides */}
                  <h1 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 leading-tight mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
                    {slide.title}
                  </h1>
                  
                  {/* UNIFIED SLIDE SUBTITLE */}
                  <p className="text-[11px] sm:text-sm text-slate-600 leading-snug sm:leading-relaxed max-w-md mb-2 line-clamp-1 sm:line-clamp-2 font-medium">
                    {slide.subtitle}
                  </p>

                  {/* UNIFIED HIGHLIGHT PILL */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/95 border border-slate-200/90 text-[10px] sm:text-xs font-bold text-slate-800 mb-2 sm:mb-4 shadow-2xs">
                    {slide.isCampaignSlide ? (
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
                    ) : (
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
                    )}
                    <span>{slide.highlight}</span>
                  </div>

                  {/* Price / Offer Highlight & Action Buttons */}
                  <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 w-full">
                    {slide.isCampaignSlide ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950">
                          UP TO ৳8,500
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          MAX DISCOUNT
                        </span>
                      </div>
                    ) : (
                      slide.price && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950">
                            {formatCurrency(slide.price)}
                          </span>
                          {slide.originalPrice && (
                            <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                              {formatCurrency(slide.originalPrice)}
                            </span>
                          )}
                          {slide.originalPrice && slide.originalPrice > slide.price && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                              SAVE {formatCurrency(slide.originalPrice - slide.price)}
                            </span>
                          )}
                        </div>
                      )
                    )}

                    <div className="flex items-center gap-2 w-full md:w-auto mt-1 md:mt-0 justify-center">
                      <Link
                        href={slide.productSlug ? `/product/${slide.productSlug}` : `/category/${slide.categorySlug}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-slate-900/15 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex-1 md:flex-initial text-center"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={
                          slide.isCampaignSlide
                            ? `https://wa.me/8801712345678?text=${encodeURIComponent(
                                `Hello Technologia! I want to get early updates and reserve deals for the Tech Mega Fest 2026 (Code: MEGA2026).`
                              )}`
                            : `https://wa.me/8801712345678?text=${encodeURIComponent(
                                `Hello Technologia! I am inquiring about: ${slide.title} (${slide.price ? '৳' + slide.price : ''}). Is it in stock?`
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex-1 md:flex-initial text-center"
                      >
                        <span>{slide.isCampaignSlide ? 'WhatsApp Desk' : 'WhatsApp Order'}</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Pagination Dots */}
              <div className="relative z-10 pb-3 sm:pb-4 flex items-center justify-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === idx
                        ? 'w-7 h-2 bg-slate-900 shadow-xs'
                        : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: TWO STACKED PROMOTIONAL GADGET CARDS (lg:col-span-4)
              Clean, professional Apple & wearable cards - NO AI FLAME BADGES
              ONLY GADGETS - NO SMARTPHONES!
             ========================================================================= */}
          <div className="lg:col-span-4 grid grid-cols-1 xs:grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-4 justify-between lg:h-[480px]">
            
            {/* Top Card: Apple AirPods Pro (2nd Gen) */}
            <Link
              href="/product/prod-hp-02"
              className="flex-1 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-3 sm:p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group overflow-hidden relative shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                
                {/* Floating Dual AirPods Earbuds Image */}
                <div className="w-16 h-16 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-50 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none" />
                  <img
                    src="/images/products/airpods-pro-pair.png"
                    alt="Apple AirPods Pro 2"
                    className="w-full h-full object-contain filter drop-shadow-md animate-float relative z-10"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1 flex-wrap">
                    <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 sm:px-2.5 py-0.2 rounded border border-slate-200">
                      Apple Official
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2.5 py-0.2 rounded border border-emerald-200">
                      In Stock
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition truncate">
                    AirPods Pro 2
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1 sm:line-clamp-2">
                    H2 Chip • 2x ANC • Adaptive Audio
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-xs sm:text-base font-black text-slate-950">
                      {formatCurrency(28500)}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                      -11%
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] sm:text-[11px] truncate">MagSafe USB-C</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[10px] sm:text-[11px]">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Bottom Card: Apple Watch Ultra & Smartwatch Flagships */}
            <Link
              href="/category/smart-watches"
              className="flex-1 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-3 sm:p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group overflow-hidden relative shadow-2xs"
            >
              <div>
                
                {/* Header Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 sm:px-2.5 py-0.2 rounded border border-slate-200">
                      Smartwatch
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2.5 py-0.2 rounded border border-emerald-200">
                      In Stock
                    </span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-lg font-black text-slate-950 group-hover:text-blue-600 transition truncate">
                  Apple Watch Ultra
                </h3>

                {/* Multi-angle Product Photo (Case + Straps) */}
                <div className="w-full h-16 sm:h-28 my-1 flex items-center justify-center p-1 bg-slate-50/80 rounded-xl sm:rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none" />
                  <img
                    src="/images/products/apple-watch-ultra-gng.jpg"
                    alt="Apple Watch Ultra"
                    className="w-full h-full object-contain filter drop-shadow-md animate-float-delayed relative z-10"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                    }}
                  />
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                  49mm Titanium Case • Dual GPS
                </p>

              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] sm:text-[11px] truncate">Official Warranty</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[10px] sm:text-[11px]">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};
