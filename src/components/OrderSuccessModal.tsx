'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MessageCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Banknote,
  CreditCard
} from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappConfirmUrl = `https://wa.me/8801712345678?text=${encodeURIComponent(
    `Hello Technologia! I have placed order ${order.orderId} on your website for ৳${order.totalAmount.toLocaleString()} (${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Advance Payment'}). Please confirm my dispatch!`
  )}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2.5 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-zinc-300 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Precision Industrial Header */}
        <div className="p-4 sm:p-6 bg-zinc-950 text-white relative overflow-hidden border-b border-zinc-800">
          <div className="absolute top-2 right-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Official Order Confirmation
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                Order Confirmed & Logged
              </span>
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-white">
                Dispatch Order Confirmed
              </h3>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 max-w-md">
            Thank you, {order.customer.name}. Your order has been placed and assigned an official tracking ID.
          </p>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 flex-1 text-slate-800">
          
          {/* Order ID Badge Box */}
          <div className="p-3 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Official Tracking ID
              </span>
              <span className="text-base sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                {order.orderId}
              </span>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition"
              title="Copy Order ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>COPY ID</span>
                </>
              )}
            </button>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Payment Mode:</span>
              <span className="font-bold text-zinc-900 mt-1 flex items-center gap-1.5">
                {order.paymentMethod === 'COD' ? (
                  <>
                    <Banknote className="w-4 h-4 text-emerald-600 inline" />
                    <span>Cash on Delivery (COD)</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-blue-600 inline" />
                    <span>Advance Payment</span>
                  </>
                )}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Estimated Arrival:</span>
              <span className="font-bold text-zinc-900 mt-1 block">
                {order.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 block font-medium mb-1">Delivering To:</span>
            <p className="font-semibold text-slate-800">{order.customer.name} ({order.customer.phone})</p>
            <p className="text-slate-600 mt-0.5">{order.customer.address}, {order.customer.city}</p>
          </div>

          {/* Ordered Products Itemized */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Purchased Items ({order.items.length})
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                      }}
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-800 truncate block">{item.title}</span>
                      <span className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 ml-2">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Guarantee */}
          <div className="p-3.5 rounded-xl bg-zinc-950 text-white border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Official Warranty Active
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  Digital Invoice Logged
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block uppercase font-medium">Total Amount</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row gap-2.5">
          <a
            href={whatsappConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <Link
            href={`/track-order?id=${order.orderId}`}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Track Order Status</span>
          </Link>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-bold text-xs transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

