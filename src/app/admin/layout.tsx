'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  Database,
  ArrowLeft,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { isSupabaseConfigured } from '@/utils/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasSupabase, setHasSupabase] = useState(false);

  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
  }, []);

  const navLinks = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Products Catalog',
      href: '/admin/products',
      icon: Package,
      exact: false,
    },
    {
      name: 'Add New Product',
      href: '/admin/products/new',
      icon: PlusCircle,
      exact: true,
    },
    {
      name: 'Live Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold tracking-tight text-white text-base">
              TECHNOLOGIA <span className="text-blue-400 text-xs font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/50">ADMIN</span>
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800 transition"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-zinc-800 hidden md:flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  T
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  TECHNOLOGIA
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-1 block">
                Store Operations & Control
              </span>
            </div>
          </div>

          {/* Database Connection Pill */}
          <div className="px-4 pt-4 pb-2">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                hasSupabase
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
              }`}
            >
              {hasSupabase ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold block">Supabase Connected</span>
                    <span className="text-[10px] text-emerald-400/80 truncate block">PostgreSQL • Storage Active</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block">Local Fallback Mode</span>
                    <span className="text-[10px] text-amber-300/80 block">Setup .env.local to link DB</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Management
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <div className="text-center text-[10px] text-zinc-500 font-mono">
            Technologia Engine v2.0
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto min-h-screen">
        {/* Top Notification Banner if not connected */}
        {!hasSupabase && (
          <div className="bg-amber-950/60 border-b border-amber-800/60 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Supabase credentials not yet detected:</strong> The storefront and admin panel are running seamlessly with bundled fallback data. Follow our beginner guide to link your free Supabase database in minutes.
              </span>
            </div>
            <a
              href="#setup-guide"
              className="text-[11px] font-bold underline hover:text-amber-100 flex-shrink-0"
            >
              See Instructions ↓
            </a>
          </div>
        )}

        {/* Child Pages */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
