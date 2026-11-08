'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  ArrowLeft,
  Plus,
  X 
} from 'lucide-react';
import { REVIEWS } from '@/data/reviews';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [selectedRating, setSelectedRating] = useState<number | 'ALL'>('ALL');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [productTitle, setProductTitle] = useState('Anker Prime 20,000mAh Power Bank');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const filteredReviews = reviewsList.filter((r) => {
    if (selectedRating !== 'ALL' && r.rating !== selectedRating) return false;
    return true;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: name.trim(),
      location: location.trim(),
      verified: true,
      rating,
      date: 'Just now',
      productTitle,
      category: 'Gadget',
      comment: comment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsWriteModalOpen(false);
    setName('');
    setComment('');
  };

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Customer Reviews</span>
        </div>

        {/* Header Hero */}
        <div className="bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-6 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-3 right-4 text-xs font-bold text-zinc-400 uppercase tracking-wide">
            Verified Reviews • 320+ Purchases
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Verified Buyer Feedback</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Customer Reviews & Verification
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-2 leading-relaxed">
                Direct buyer testimonials from Bangladesh tech enthusiasts who tested our genuine gadgets, warranty claims, and rapid Cash on Delivery service.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center flex-shrink-0 min-w-[220px]">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-3xl font-black text-white block">4.9 / 5.0</span>
              <span className="text-xs text-zinc-400 font-semibold block mt-0.5">320+ Verified Purchases</span>
              
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Rating:</span>
          </span>
          <button
            onClick={() => setSelectedRating('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              selectedRating === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                selectedRating === star
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{star} Stars</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-zinc-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-400 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{rev.author}</h4>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{rev.location} • {rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs mb-3">
                  <span className="text-zinc-500 text-[11px] uppercase font-bold block mb-0.5">Purchased Device:</span>
                  <span className="text-zinc-900 font-bold text-xs">{rev.productTitle}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Serial Authenticated</span>
                </span>
                <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful (14)</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsWriteModalOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Write a Customer Review</h3>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shakib Al Hasan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Area</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Uttara, Dhaka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Purchased</label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Experience / Feedback</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the gadget's authenticity, packaging, and delivery speed..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Publish Verified Review
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

