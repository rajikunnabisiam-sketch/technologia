'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { getProducts, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleToggleStock = async (product: Product) => {
    setActionLoading(product.id);
    const newStock = !product.inStock;
    try {
      await updateProduct(product.id, { inStock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: newStock } : p))
      );
      setNotification({
        type: 'success',
        message: `Updated "${product.title}" stock to: ${newStock ? 'In Stock' : 'Out of Stock'}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to update stock status.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.title}" from the catalog?`)) {
      return;
    }

    setActionLoading(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setNotification({
        type: 'success',
        message: `Successfully deleted "${product.title}".`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to delete product. (Note: in fallback mode, refresh resets defaults)',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'headphones', name: 'Headphones' },
    { id: 'power-banks', name: 'Power Banks' },
    { id: 'chargers', name: 'Chargers' },
    { id: 'smart-watches', name: 'Smart Watches' },
    { id: 'home-appliances', name: 'Home Appliances' },
    { id: 'lifestyle', name: 'Lifestyle & Audio' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage pricing, stock status, product descriptions, and image assets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCatalog}
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

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, brand, or model..."
            className="w-full px-3.5 py-2.5 pl-10 text-xs sm:text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table / Cards */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs">Loading product catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 space-y-2">
            <Package className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-400">No products match your criteria</p>
            <p className="text-xs text-zinc-500">Try adjusting your search query or category filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category & Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProducts.map((product) => {
                  const isActing = actionLoading === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-zinc-900/40 transition group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-white block truncate hover:text-blue-400 transition">
                              {product.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {product.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-950 text-blue-300 border border-blue-800/60">
                                  {product.badge}
                                </span>
                              )}
                              <span className="text-[11px] font-mono text-zinc-500 truncate">
                                /{product.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-200 font-semibold">{product.brand}</div>
                        <div className="text-[11px] text-zinc-400">{product.categoryLabel || product.category}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white">
                          {formatCurrency(product.price)}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-[11px] text-zinc-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStock(product)}
                          disabled={isActing}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
                            product.inStock
                              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                              : 'bg-rose-950/70 border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.inStock ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            title="Preview on Store"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}`}
                            title="Edit Product"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-blue-600 hover:text-white text-zinc-400 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(product)}
                            disabled={isActing}
                            title="Delete Product"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-600 hover:text-white text-zinc-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
