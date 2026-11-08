'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
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
          <span className="text-slate-800 font-semibold">Terms & Conditions</span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 sm:p-10 text-zinc-700 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Official Store Terms & Policies</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Terms of Service & Customer Policies
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-medium">Effective Date: November 2026</p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
            <h3 className="font-bold text-zinc-950 text-sm">1. Ordering & Contract</h3>
            <p>
              By placing an order on Technologia (either via the web checkout or direct WhatsApp auto-fill), you agree to receive genuine merchandise under the listed price and warranty terms. Orders placed with Cash on Delivery (COD) are confirmed by telephone or WhatsApp prior to courier dispatch.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
            <h3 className="font-bold text-zinc-950 text-sm">2. Authentic Packaging & Warranty Terms</h3>
            <p>
              Products must be returned in their original packaging with serial tags intact to qualify for the 7-day instant defect replacement. Intentional physical abuse, liquid submersion beyond IP rating, or unauthorized third-party repairs void the warranty.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
            <h3 className="font-bold text-zinc-950 text-sm">3. Pricing & Taxes</h3>
            <p>
              All prices displayed on Technologia are inclusive of VAT and statutory taxes. Delivery charges are calculated transparently at checkout before order confirmation.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

