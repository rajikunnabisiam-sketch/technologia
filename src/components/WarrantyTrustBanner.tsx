'use client';

import React from 'react';
import { ShieldCheck, Award, RotateCcw, CheckCircle2 } from 'lucide-react';

export const WarrantyTrustBanner: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-slate-50/70 text-slate-900 relative overflow-hidden border-b border-slate-200/80">
      
      {/* Eye-soothing subtle studio dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Gentle ambient colored blur orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Bold Typographic Trust Statement */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold mb-3 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="tracking-wide text-[10px] sm:text-[11px]">OFFICIAL DISTRIBUTOR & AUTHENTICITY ASSURANCE</span>
            </div>

            {/* Exact Locked Headline with Eye-Soothing Typography */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-snug sm:leading-tight max-w-3xl text-balance text-slate-900">
              &ldquo;100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank &mdash;{' '}
              <span className="text-blue-600">Real Tech, Official Warranty, Zero &lsquo;Trust Me Bro&rsquo; Guarantees.</span>&rdquo;
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every unit dispatched from Technologia arrives in factory-sealed distributor packaging with verifiable manufacturer serial numbers. No gray-market replicas. Period.
            </p>
          </div>

          {/* Right Column: 3 Clean Eye-Soothing Hardware Assurance Modules */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            
            {/* Module 1: 100% Genuine */}
            <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Authentic Brands</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Factory-sealed with scannable serial code</p>
              </div>
            </div>

            {/* Module 2: Official Warranty */}
            <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Official Brand Warranty</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">6 to 24 Months authorized distributor backing</p>
              </div>
            </div>

            {/* Module 3: 7-Day Replacement Reliance */}
            <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">7-Day Instant Replacement</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Hassle-free exchange for any factory defect</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
