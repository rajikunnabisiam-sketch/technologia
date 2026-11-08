'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PaymentMethod, Order } from '@/types';
import { formatCurrency, generateOrderId } from '@/utils/formatters';

interface CheckoutModalProps {
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOrderSuccess }) => {
  const { 
    items, 
    subtotal, 
    shippingFee, 
    totalAmount, 
    isCheckoutOpen, 
    setIsCheckoutOpen,
    saveOrder 
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [notes, setNotes] = useState('');
  
  // Mandatory payment preference selection (ISS-CHK-03)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [advanceTxnId, setAdvanceTxnId] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Full Name is required';
    if (!phone.trim()) {
      err.phone = 'Mobile phone number is required';
    } else if (phone.trim().length < 11) {
      err.phone = 'Please provide a valid 11-digit mobile number';
    }
    if (!address.trim()) err.address = 'Full delivery street address is required';
    if (paymentMethod === 'ADVANCE' && !advanceTxnId.trim()) {
      err.advanceTxnId = 'Please enter your bKash / Nagad Transaction ID or Card Reference';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Generate unique order ID
    const newOrderId = generateOrderId();
    const createdOrder: Order = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city,
        notes: notes.trim(),
        advanceTxnId: advanceTxnId.trim() || undefined,
      },
      paymentMethod,
      items: items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        brand: item.product.brand,
        quantity: item.quantity,
        unitPrice: item.product.price,
        image: item.product.image,
      })),
      subtotal,
      shippingFee,
      totalAmount,
      status: 'Confirmed',
      estimatedDelivery: city.toLowerCase().includes('dhaka') ? 'Within 24-48 Hours' : 'Within 48-72 Hours',
    };

    // Save order, clear cart (ISS-CHK-05), and transition to confirmation
    saveOrder(createdOrder);
    setIsSubmitting(false);
    setIsCheckoutOpen(false);
    onOrderSuccess(createdOrder);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-zinc-300 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Precision Industrial Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Secure Checkout • Official Dispatch
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Complete Your Order
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          
          {/* Order Summary Pill */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-zinc-900 block">
                {items.length} {items.length === 1 ? 'Item' : 'Items'} in Your Order
              </span>
              <span className="text-zinc-500 text-[11px]">
                Subtotal: {formatCurrency(subtotal)} | Courier Delivery: {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Payable</span>
              <span className="text-base font-extrabold text-zinc-900">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Customer Delivery Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>1. Delivery Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-blue-500 ring-blue-100'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-blue-500 ring-blue-100'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Road #, Sector/Area"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-blue-500 ring-blue-100'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Dhaka">Dhaka (24-48h)</option>
                  <option value="Chattogram">Chattogram (48-72h)</option>
                  <option value="Sylhet">Sylhet (48-72h)</option>
                  <option value="Rajshahi">Rajshahi (48-72h)</option>
                  <option value="Khulna">Khulna (48-72h)</option>
                  <option value="Other">Other Districts (72h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special courier instructions or landmark..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mandatory Payment Preference Selector (FR-CHK-03, US-4.1, ISS-CHK-03) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                2. Choose Payment Method <span className="text-red-500">*</span>
              </h4>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                100% Safe & Secure
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A: Cash on Delivery (COD) */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-zinc-900 focus:ring-zinc-900"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-xs sm:text-sm">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                    Pay in cash upon physical doorstep inspection of factory-sealed box.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Pay with Cash at Doorstep
                  </span>
                </div>
              </label>

              {/* Option B: Advance Payment (bKash / Nagad / Cards) */}
              <label
                onClick={() => setPaymentMethod('ADVANCE')}
                className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'ADVANCE'
                    ? 'border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ADVANCE"
                  checked={paymentMethod === 'ADVANCE'}
                  onChange={() => setPaymentMethod('ADVANCE')}
                  className="mt-1 text-zinc-900 focus:ring-zinc-900"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-xs sm:text-sm">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Advance Payment</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                    Direct digital transfer via bKash / Nagad / Card for contactless handover.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Priority Express Dispatch
                  </span>
                </div>
              </label>

            </div>

            {/* Advance Payment Details Sub-Panel */}
            {paymentMethod === 'ADVANCE' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Advance Payment Instructions:</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Please send <strong>{formatCurrency(totalAmount)}</strong> to our official Merchant Account:
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                  <span>bKash / Nagad Merchant: <strong>01712-345678</strong></span>
                  <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded font-bold text-amber-800">Payment</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Enter TrxID / Transaction Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={advanceTxnId}
                    onChange={(e) => setAdvanceTxnId(e.target.value)}
                    placeholder="e.g. 9J38FK20LM"
                    className={`w-full px-3 py-2 rounded-xl border text-xs uppercase font-semibold tracking-wide ${
                      errors.advanceTxnId ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.advanceTxnId && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.advanceTxnId}</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Trust Guarantees */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>100% Factory Sealed • 7-Day Instant Replacement • Official Store Warranty</span>
          </div>

          {/* Submission Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide border border-blue-700 shadow-md flex items-center justify-center gap-2 transition hover:shadow-lg disabled:opacity-50"
            >
              <span>Confirm Hardware Order • {formatCurrency(totalAmount)}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

