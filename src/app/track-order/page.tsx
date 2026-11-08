'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle,
  MessageCircle,
  Banknote,
  CreditCard
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { getOrderFromSupabase } from '@/services/orderService';

const TIMELINE_STEPS = [
  { key: 'Order Placed', label: 'Order Received', desc: 'Order details verified' },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Stock allocated in warehouse' },
  { key: 'Processing', label: 'Quality Tested & Packed', desc: 'Serial numbers verified & sealed' },
  { key: 'Shipped', label: 'Handed to Courier', desc: 'Dispatched via express delivery' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier rider on the way' },
  { key: 'Delivered', label: 'Delivered to Doorstep', desc: 'Parcel safely received' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id') || '';

  const { orders } = useCart();
  const [query, setQuery] = useState(idFromUrl || 'ORD-84920');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-search if ID is passed in URL
  useEffect(() => {
    async function lookupInitial() {
      if (idFromUrl) {
        setQuery(idFromUrl);
        setIsLoading(true);
        const supabaseMatch = await getOrderFromSupabase(idFromUrl);
        if (supabaseMatch) {
          setFoundOrder(supabaseMatch);
        } else {
          const match = orders.find(
            (o) => o.orderId.toLowerCase() === idFromUrl.toLowerCase()
          );
          setFoundOrder(match || null);
        }
        setIsLoading(false);
        setSearched(true);
      } else {
        // Default initial demo order
        const initial = orders.find((o) => o.orderId === 'ORD-84920') || orders[0];
        if (initial) {
          setFoundOrder(initial);
        }
      }
    }
    lookupInitial();
  }, [idFromUrl, orders]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const clean = query.trim().toLowerCase();

    // 1. Try fetching live from Supabase
    const liveOrder = await getOrderFromSupabase(clean);
    if (liveOrder) {
      setFoundOrder(liveOrder);
      setIsLoading(false);
      setSearched(true);
      return;
    }

    // 2. Fall back to local store
    const localMatch = orders.find(
      (o) =>
        o.orderId.toLowerCase() === clean ||
        o.customer.phone.replace(/\D/g, '').includes(clean)
    );

    setFoundOrder(localMatch || null);
    setIsLoading(false);
    setSearched(true);
  };

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const stepOrder = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const thisIndex = stepOrder.indexOf(stepKey);

    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'active';
    return 'upcoming';
  };

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
          <span className="text-slate-800 font-semibold">Live Order Tracking</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your official Order ID (e.g. <strong className="text-slate-700">ORD-84920</strong>) or Mobile Number to view live courier status.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center shadow-md rounded-2xl overflow-hidden bg-white border border-slate-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (e.g. ORD-84920) or Phone..."
              className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-11 text-xs sm:text-sm text-slate-900 focus:outline-none"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 flex-shrink-0"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Track</span>
              )}
            </button>
          </div>
        </form>

        {/* Tracking Results Card */}
        {foundOrder ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-300">
            
            {/* Order Header Summary */}
            <div className="p-5 sm:p-6 bg-zinc-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block">
                  Live Courier Tracking • Official Order
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {foundOrder.orderId}
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <span>Logged: {new Date(foundOrder.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    {foundOrder.paymentMethod === 'COD' ? (
                      <>
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cash on Delivery</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        <span>Advance Paid</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: {foundOrder.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Courier Timeline Stepper */}
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                Live Shipment Progress
              </h3>

              <div className="relative">
                {/* Horizontal progress bar for desktop */}
                <div className="hidden md:block absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0" />

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const status = getStepStatus(step.key, foundOrder.status);

                    return (
                      <div key={idx} className="flex md:flex-col items-start md:items-center gap-3 md:text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs flex-shrink-0 ${
                            status === 'completed'
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : status === 'active'
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold ${
                            status === 'active' ? 'text-blue-600' : 'text-slate-800'
                          }`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Customer & Destination Details */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">
                  Recipient Details
                </span>
                <p className="font-bold text-slate-800 text-sm">{foundOrder.customer.name}</p>
                <p className="text-slate-600 mt-0.5">{foundOrder.customer.phone}</p>
                <p className="text-slate-600 mt-1">{foundOrder.customer.address}, {foundOrder.customer.city}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">
                    Estimated Delivery
                  </span>
                  <p className="font-black text-slate-900 text-base text-blue-600">
                    {foundOrder.estimatedDelivery}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Courier partner: Steadfast Express / RedX
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Need to reschedule?</span>
                  <a
                    href={`https://wa.me/8801712345678?text=${encodeURIComponent(
                      `Hello! Regarding my order ${foundOrder.orderId}, I want to check/reschedule my delivery.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Courier Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Itemized Order List */}
            <div className="p-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Items in This Shipment ({foundOrder.items.length})
              </h4>
              <div className="space-y-2">
                {foundOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                        }}
                      />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-slate-400 text-[11px]">Brand: {item.brand} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Grand Total (with shipping)</span>
                <span className="text-base font-black text-blue-600">{formatCurrency(foundOrder.totalAmount)}</span>
              </div>
            </div>

          </div>
        ) : (
          searched && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Order ID Not Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                We couldn&rsquo;t find an order matching &ldquo;{query}&rdquo;. Please verify your 5-digit Order ID (e.g. ORD-84920) or check the phone number entered at checkout.
              </p>
              <a
                href={`https://wa.me/8801712345678?text=${encodeURIComponent(
                  `Hello Technologia! I am trying to track my order with query "${query}" but cannot find it. Can you assist?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Support on WhatsApp</span>
              </a>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-xs text-slate-500">
          Loading order tracking dashboard...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
