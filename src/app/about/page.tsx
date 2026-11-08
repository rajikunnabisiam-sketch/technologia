'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Zap, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">About Technologia</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-slate-700 space-y-8">
          
          <div>
            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">
              OUR ORIGIN & COMMITMENT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Real Tech. Zero &ldquo;Trust Me Bro&rdquo; Guarantees.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              Technologia was founded with a single uncompromising mission: to put an end to the flood of fake power banks, counterfeit GaN chargers, and gray-market electronics that plague online gadget shopping in Bangladesh.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-3 right-4 text-xs font-bold text-zinc-400 uppercase tracking-wide">
              6 Core Categories
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>The 6-Pillar Discipline</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              We focus exclusively on the 6 essential tech pillars of modern life: Headphones, Power Banks, Chargers, Smart Watches, Home Appliances, and Personal Care. By staying specialized, we maintain direct distribution relationships with brands like Anker, Sony, Baseus, Xiaomi, and Philips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-block mb-3">
                100% Sealed
              </span>
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1">Authentic Hardware</h4>
              <p className="text-xs text-zinc-500">Every box is factory-sealed with scannable serial authenticity codes and warranty stickers.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md inline-block mb-3">
                Brand Backed
              </span>
              <Award className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1">Official Warranties</h4>
              <p className="text-xs text-zinc-500">6 to 24 Months official store and brand warranties with swift authorized service claims.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md inline-block mb-3">
                Speed Checkout
              </span>
              <Users className="w-6 h-6 text-indigo-600 mb-2" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1">Dual-Path Ordering</h4>
              <p className="text-xs text-zinc-500">Shop effortlessly through traditional cart checkout or instant 1-click WhatsApp with pre-filled SKU data.</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Our Operating Center:</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technologia Technologies Ltd.<br />
              Level 4, Police Plaza Concord, Gulshan 1, Dhaka - 1212<br />
              Hotline: +880 1712-345678 • Email: support@technologia.com
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

