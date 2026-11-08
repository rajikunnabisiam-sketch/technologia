'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Check, 
  Zap,
  ArrowUpRight 
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency, getDiscountPercentage } from '@/utils/formatters';
import { buildProductWhatsAppUrl } from '@/utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const discountPercent = getDiscountPercentage(product.price, product.originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xl hover:shadow-neutral-900/5 transition-all duration-200 flex flex-col justify-between overflow-hidden h-full">
      
      {/* Top Media Showcase */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-neutral-200/80">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-2 bg-white group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-neutral-950 text-white shadow-xs">
              {product.badge.toUpperCase()}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs w-fit">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Hardware Brand Stamp on Top-Right */}
        <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-neutral-800 shadow-2xs border border-neutral-200">
          {product.brand}
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Verified Rating Line */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-neutral-700 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Precision Hardware Spec Badges */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.specs.slice(0, 2).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/60 truncate max-w-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Reliance Strip */}
        <div className="mt-3.5 pt-2.5 border-t border-neutral-100">
          
          {/* Price Block */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-base sm:text-lg font-black text-neutral-950">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-neutral-400 line-through ml-1.5">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              IN STOCK
            </span>
          </div>

          {/* Official Warranty Meta */}
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium flex items-center gap-1.5 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>

          {/* Dual Action CTA Buttons (FR-PDP-03, US-4.1, US-4.2) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            
            {/* 1. Add to Cart Button with Tactile Physical Feel */}
            <button
              onClick={handleAddToCart}
              type="button"
              className={`py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-xs active:scale-[0.98] ${
                added 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-900'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* 2. Order via WhatsApp Button with exact auto-fill link */}
            <a
              href={buildProductWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-1.5 sm:px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-xs shadow-emerald-600/20 active:scale-[0.98]"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

          </div>

        </div>

      </div>
    </div>
  );
};
