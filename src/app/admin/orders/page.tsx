'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  CreditCard,
  Banknote,
  PackageCheck
} from 'lucide-react';
import { getAllOrdersFromSupabase, updateOrderStatusInSupabase } from '@/services/orderService';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const STATUS_OPTIONS: Order['status'][] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function AdminOrdersPage() {
  const { orders: localOrders } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const dbOrders = await getAllOrdersFromSupabase();
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      } else {
        // Fall back to local storage orders if Supabase is unseeded or unconfigured
        setOrders(localOrders);
      }
    } catch (err) {
      console.warn('Failed to fetch orders from Supabase, using local:', err);
      setOrders(localOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [localOrders]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusInSupabase(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update status on server:', err);
      // Still update UI for client responsiveness
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      case 'Processing':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'Shipped':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'Out for Delivery':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80';
      case 'Delivered':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const openWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${order.customer.name}! Technologia Update: Your order #${order.orderId} status is currently "${order.status}". Items: ${order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}. Total: ৳${order.totalAmount}. Thank you for choosing Technologia!`
    );
    window.open(`https://wa.me/${phoneWithCode}?text=${text}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Order Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time customer orders, dispatch status updates, and direct courier routing.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer Name, or Phone..."
            className="w-full px-3.5 py-2.5 pl-10 text-xs sm:text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {STATUS_OPTIONS.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs">Fetching orders from Supabase...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <ShoppingCart className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No Orders Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'No orders match your filter criteria.'
              : 'When customers checkout on your storefront, orders will immediately arrive here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.orderId;

            return (
              <div
                key={order.orderId}
                className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-black text-white text-base sm:text-lg">
                      #{order.orderId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Recent'}
                    </span>
                  </div>

                  {/* Status Dropdown Controller */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400">Update Status:</span>
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value as Order['status'])
                      }
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {isUpdating && (
                      <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Customer Details */}
                  <div className="space-y-2 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/60">
                    <div className="font-bold text-white uppercase text-[11px] tracking-wider text-zinc-400">
                      Customer Information
                    </div>
                    <div className="font-bold text-white text-sm">{order.customer.name}</div>
                    <div className="text-zinc-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <a href={`tel:${order.customer.phone}`} className="hover:underline font-mono">
                        {order.customer.phone}
                      </a>
                    </div>
                    <div className="text-zinc-400 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{order.customer.address}, {order.customer.city}</span>
                    </div>
                    {order.customer.notes && (
                      <div className="text-zinc-400 italic bg-black/40 p-2 rounded text-[11px]">
                        Note: &quot;{order.customer.notes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Payment & Logistics */}
                  <div className="space-y-2 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/60">
                    <div className="font-bold text-white uppercase text-[11px] tracking-wider text-zinc-400">
                      Payment & Delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-300">Method:</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-zinc-800 text-white font-mono">
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Advance (Bkash/Nagad)'}
                      </span>
                    </div>
                    {order.customer.advanceTxnId && (
                      <div className="text-zinc-300 font-mono text-[11px] bg-black/40 p-2 rounded">
                        <span className="text-zinc-500 block">Txn ID:</span>
                        <strong className="text-emerald-400">{order.customer.advanceTxnId}</strong>
                      </div>
                    )}
                    <div className="text-zinc-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{order.estimatedDelivery}</span>
                    </div>
                  </div>

                  {/* Summary & WhatsApp Connect */}
                  <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-white uppercase text-[11px] tracking-wider text-zinc-400 mb-2">
                        Financial Summary
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Shipping:</span>
                        <span>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-zinc-800 mt-1">
                        <span>Total:</span>
                        <span className="text-emerald-400">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openWhatsAppCustomer(order)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Customer</span>
                    </button>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Items in this Order ({order.items.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs"
                      >
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                          ) : (
                            <PackageCheck className="w-4 h-4 text-zinc-500" />
                          )}
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-semibold text-white truncate">{item.title}</p>
                          <p className="text-[11px] text-zinc-400">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
