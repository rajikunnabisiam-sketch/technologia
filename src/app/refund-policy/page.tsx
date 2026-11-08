'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export default function RefundPolicyPage() {
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
          <span className="text-slate-800 font-semibold">Refund & Replacement Policy</span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 sm:p-10 text-zinc-700 space-y-6">
          
          <div className="border-b border-zinc-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3 border border-slate-200">
              <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
              <span>Official Replacement Guarantee • 7-Day Defect Coverage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              7-Day Instant Defect Replacement Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Clear, transparent guidelines for hardware exchanges, warranty fulfillment, and claims.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>1. 7-Day Instant Defect Replacement Eligibility</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600">
              At Technologia, we inspect every product before dispatch. If you receive an item with any manufacturing defect, physical damage caused during courier transit, or missing accessories, you are entitled to a <strong>100% free doorstep replacement</strong> within <strong>7 calendar days</strong> from the delivery date.
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5 font-normal">
              <li>Product fails to power on or function according to manufacturer specifications.</li>
              <li>Visible physical transit cracks, broken ports, or unsealed packaging.</li>
              <li>Incorrect product variant, color, or missing cables/adapters.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>2. How to Claim Your Replacement (3 Easy Steps)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                <span className="w-6 h-6 rounded-md bg-zinc-950 text-white font-bold flex items-center justify-center mb-2">01</span>
                <h4 className="font-bold text-zinc-900 mb-1">Send WhatsApp Alert</h4>
                <p className="text-zinc-500 text-[11px]">Message our support desk with your Order ID and photo/video of defect.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                <span className="w-6 h-6 rounded-md bg-zinc-950 text-white font-bold flex items-center justify-center mb-2">02</span>
                <h4 className="font-bold text-zinc-900 mb-1">Instant Verification</h4>
                <p className="text-zinc-500 text-[11px]">Our tech lab reviews the serial code and authorizes the replacement unit.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                <span className="w-6 h-6 rounded-md bg-zinc-950 text-white font-bold flex items-center justify-center mb-2">03</span>
                <h4 className="font-bold text-zinc-900 mb-1">Doorstep Swap</h4>
                <p className="text-zinc-500 text-[11px]">Courier rider delivers the fresh replacement unit and collects the defective piece.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>3. Conditions for Full Refund</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              If an identical replacement unit is out of stock, we provide an immediate 100% monetary refund to your bKash, Nagad, bank account, or original payment card within 24 to 48 hours.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Need immediate assistance with an ongoing order?</span>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Claims Desk on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

