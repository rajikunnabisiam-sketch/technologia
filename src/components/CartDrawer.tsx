'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatters';
import { buildCartWhatsAppUrl } from '@/utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    totalItems, 
    subtotal, 
    shippingFee, 
    totalAmount, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    isCartOpen, 
    setIsCartOpen,
    setIsCheckoutOpen,
    isMounted
  } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = 15000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Your Shopping Cart
              </h3>
              <p className="text-xs text-slate-500">
                {isMounted ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'} saved` : 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              aria-label="Close Shopping Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {items.length > 0 && (
          <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 text-xs">
            <div className="flex items-center justify-between font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Truck className="w-4 h-4" />
                {subtotal >= freeShippingThreshold ? (
                  <strong className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" /> Unlocked FREE Nationwide Delivery
                  </strong>
                ) : (
                  <>Add <strong>{formatCurrency(freeShippingThreshold - subtotal)}</strong> more for FREE delivery</>
                )}
              </span>
              <span className="text-[11px] font-bold text-slate-500">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Your cart is empty
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                Explore our 6 flagship categories to find 100% original gadgets with official warranties.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-white border border-slate-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/soundcore-r60i-main.jpg';
                  }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {item.product.brand}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatCurrency(item.product.price)} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity selector & Line Total */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Dual Checkout Buttons */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-800">{formatCurrency(shippingFee)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Micro trust stamp */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery or Advance • Official Warranty Guaranteed</span>
            </div>

            {/* Dual Path Ordering Action Buttons (FR-CHK-01, FR-CHK-04, ADR-004) */}
            <div className="space-y-2">
              
              {/* Path A: Standard Multi-Item Checkout */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Path B: Direct WhatsApp Multi-Item Auto-Fill (FR-CHK-04, ISS-CHK-01, ISS-CHK-04) */}
              <a
                href={buildCartWhatsAppUrl(items, totalAmount, 'COD')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Cart via WhatsApp (Auto-Filled)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

