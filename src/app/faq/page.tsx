'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { FAQS } from '@/data/faqs';

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Warranty & Authenticity', 'Ordering & Delivery', 'Payment & COD', 'Replacement & Refunds'];

  const filteredFaqs = FAQS.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false;
    return true;
  });

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
          <span className="text-slate-800 font-semibold">Frequently Asked Questions</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-2">
            <span>Help & Support Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Direct operational answers regarding factory-sealed authenticity, official distributor warranties, Cash on Delivery logistics, and 7-day replacement protocol.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 justify-center flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${activeCategory === cat
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3 mb-10">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-zinc-50 transition"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-900">
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-md bg-zinc-100 text-zinc-600 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p className="mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? WhatsApp Box */}
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center max-w-lg mx-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-sm sm:text-base font-bold text-emerald-950">
            Still Have Questions?
          </h3>
          <p className="text-xs text-emerald-800 mt-1 mb-4">
            Our tech specialists are available 10 AM to 10 PM to clarify any gadget specifications, warranty terms, or bulk orders.
          </p>
          <a
            href="https://wa.me/8801712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat With Sales on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>

      </div>
    </div>
  );
}

