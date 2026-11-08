'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Database,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Copy,
  Check
} from 'lucide-react';
import { getProducts } from '@/services/productService';
import { getAllOrdersFromSupabase } from '@/services/orderService';
import { seedInitialCatalogToSupabase, SeedResult } from '@/services/seedService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { Product, Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        getProducts(),
        getAllOrdersFromSupabase(),
      ]);
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!confirm('This will upload all 18 authentic starter products and categories to your Supabase Database. Continue?')) {
      return;
    }
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedInitialCatalogToSupabase();
      setSeedResult(result);
      if (result.success) {
        await loadData();
      }
    } catch (err: any) {
      setSeedResult({
        success: false,
        categoriesCount: 0,
        productsCount: 0,
        message: err?.message || 'Failed to seed database.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time storefront metrics, Supabase sync status, and inventory controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products KPI */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {isLoading ? '...' : products.length}
          </div>
          <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>{inStockCount} In Stock ({products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 100}%)</span>
          </div>
        </div>

        {/* Live Orders KPI */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {isLoading ? '...' : orders.length}
          </div>
          <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
            <span>Stored in Supabase & Local History</span>
          </div>
        </div>

        {/* Revenue KPI */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {isLoading ? '...' : formatCurrency(totalRevenue)}
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Total gross volume booked
          </div>
        </div>

        {/* Supabase Engine Status KPI */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Database Link</span>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              configured
                ? 'bg-emerald-950/80 border-emerald-800/40 text-emerald-400'
                : 'bg-amber-950/80 border-amber-800/40 text-amber-400'
            }`}>
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {configured ? (
              <>
                <span className="text-emerald-400">Supabase Live</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <span className="text-amber-400">Fallback Mode</span>
            )}
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            {configured ? 'Postgres & Storage Bucket Connected' : 'Ready to link Supabase project'}
          </div>
        </div>
      </div>

      {/* 1-Click Database Seeder Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-950 to-zinc-950 border border-blue-900/40 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Catalog Setup</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Seed Starter Products to Supabase
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Populate your brand new Supabase Postgres database with all 18 authentic tech products, flagship categories, and specs with 1 click. Safe to run anytime (prevents duplicates).
            </p>
          </div>

          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition flex-shrink-0"
          >
            {isSeeding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Seed Initial Catalog</span>
              </>
            )}
          </button>
        </div>

        {/* Seed Feedback Banner */}
        {seedResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
              seedResult.success
                ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/50 border-rose-800 text-rose-200'
            }`}
          >
            {seedResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{seedResult.message}</p>
              {seedResult.success && (
                <p className="text-xs opacity-80">
                  Categories ({seedResult.categoriesCount}) & Products ({seedResult.productsCount}) are now live in your Supabase table!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Section: Recent Orders & Quick Product Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Overview */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-base">Recent Orders</h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No orders placed yet. Test the checkout from your storefront!
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 overflow-x-auto">
              {orders.slice(0, 5).map((order) => (
                <div key={order.orderId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-mono font-bold text-white">#{order.orderId}</div>
                    <div className="text-zinc-400 text-[11px]">{order.customer.name} • {order.customer.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCurrency(order.totalAmount)}</div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 border border-blue-800 text-blue-300">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Inventory Stock Overview */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Catalog Status</h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-zinc-400">{p.brand} • {formatCurrency(p.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.inStock
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beginner-Friendly Setup Instructions Accordion/Card */}
      <div id="setup-guide" className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              Beginner Guide: Connecting Supabase to Technologia
            </h3>
            <p className="text-xs text-zinc-400">
              Follow these simple 3 steps to connect your free Supabase Postgres Database and Cloud Image Storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-white">Create Free Supabase Project</h4>
            <p className="text-zinc-400 text-xs">
              Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">supabase.com</a>, sign in with GitHub, and click <strong>"New Project"</strong>. Choose a name (e.g. <code>technologia-db</code>) and any secure password.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-white">Run SQL Schema (1-Click)</h4>
            <p className="text-zinc-400 text-xs">
              In your Supabase dashboard, click <strong>SQL Editor</strong> on the left menu. Copy everything from our prepared <code className="text-blue-300">supabase/schema.sql</code> file, paste it in the editor, and click <strong>Run</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-white">Copy API Keys to .env.local</h4>
            <p className="text-zinc-400 text-xs">
              Go to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public key</strong> into your <code className="text-emerald-400">.env.local</code> file and Vercel Environment Variables!
            </p>
          </div>
        </div>

        {/* Copyable snippet for .env.local */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono font-semibold">Your .env.local format:</span>
            <button
              onClick={() => copyToClipboard(`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`, 'env')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'env' ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>
          <pre className="text-[11px] sm:text-xs font-mono text-emerald-400 bg-black/50 p-3 rounded-lg overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
          </pre>
        </div>
      </div>
    </div>
  );
}
