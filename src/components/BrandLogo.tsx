'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  // Size configurations
  const iconSize = size === 'lg' ? 'w-10 h-10 sm:w-11 sm:h-11' : size === 'sm' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10';
  const svgSize = size === 'lg' ? 'w-5 h-5 sm:w-6 sm:h-6' : size === 'sm' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5';
  const textSize = size === 'lg' ? 'text-xl sm:text-3xl' : size === 'sm' ? 'text-base sm:text-lg' : 'text-lg sm:text-2xl';

  return (
    <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group select-none">
      {/* 
        Bespoke Minimalist Tech Monogram Emblem
        Clean geometric geometry with dynamic electric blue accent node
      */}
      <div 
        className={`${iconSize} rounded-xl ${
          isDark 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'bg-slate-900 text-white shadow-xs group-hover:bg-blue-600'
        } flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0`}
      >
        <svg
          className={`${svgSize} transition-transform duration-200`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top crossbar with precision chamfer */}
          <path
            d="M3.5 5.5C3.5 4.67157 4.17157 4 5 4H19C19.8284 4 20.5 4.67157 20.5 5.5V6.75C20.5 7.44036 19.9404 8 19.25 8H4.75C4.05964 8 3.5 7.44036 3.5 6.75V5.5Z"
            fill="currentColor"
          />
          {/* Main vertical stem */}
          <path
            d="M10 8H14V17.5C14 18.8807 12.8807 20 11.5 20C10.6716 20 10 19.3284 10 18.5V8Z"
            fill="currentColor"
          />
          {/* Distinctive cobalt tech node accent */}
          <circle 
            cx="17" 
            cy="14" 
            r="2.5" 
            className={isDark ? 'fill-white' : 'fill-blue-400 group-hover:fill-white transition-colors'} 
          />
        </svg>
      </div>

      {/* Modern Typographic Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <span
            className={`font-black tracking-[-0.03em] leading-none ${textSize} ${
              isDark ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
            } transition-colors`}
          >
            TECHNOLOGIA
          </span>
        </div>

        {/* Clean, authentic subtitle - hidden on mobile to maximize horizontal headroom */}
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase mt-1 leading-none hidden sm:block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Official Gadget Store
          </span>
        )}
      </div>
    </Link>
  );
};
