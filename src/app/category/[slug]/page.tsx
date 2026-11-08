'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { 
  ArrowUpDown, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft,
  SlidersHorizontal,
  Search,
  Grid,
  List
} from 'lucide-react';
import { FLAGSHIP_CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { formatCurrency } from '@/utils/formatters';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'brand-asc';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find matching category
  const category = FLAGSHIP_CATEGORIES.find((c) => c.slug === slug);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [searchInCat, setSearchInCat] = useState<string>('');

  // 1. Category-Isolated Products (FR-CAT-01)
  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === slug);
  }, [slug]);

  // 2. Dynamic Brand Extraction: Brands_cat = { p.brand | p in Products_cat } (ISS-CAT-01, ADR-006)
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    categoryProducts.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet).sort();
  }, [categoryProducts]);

  // 3. Filter and Sort Execution (ISS-CAT-02, ISS-CAT-03)
  const processedProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Filter by Brand if selected
    if (selectedBrand !== 'ALL') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Filter by local search query
    if (searchInCat.trim()) {
      const q = searchInCat.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    // Sort execution on cloned array with numeric comparisons
    const sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc':
        // Numeric sort Low to High (ISS-CAT-03)
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        // Numeric sort High to Low (ISS-CAT-03)
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      case 'brand-asc':
        return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
      case 'featured':
      default:
        // Default / Featured ranking
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [categoryProducts, selectedBrand, sortOption, searchInCat]);

  const handleResetFilters = () => {
    setSelectedBrand('ALL');
    setSortOption('featured');
    setSearchInCat('');
  };

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Category Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The category you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/60 min-h-screen pb-16">
      
      {/* Category Header Banner */}
      <div className="bg-[#09090b] text-white py-8 sm:py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
            <Link href="/" className="hover:text-white transition flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-bold">{category.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-emerald-400 font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Genuine Authorized Tech</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1 leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center sm:text-right flex-shrink-0">
              <span className="text-xs text-neutral-400 block font-semibold">
                Available In Stock
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {categoryProducts.length} Verified Products
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Sticky Controls & Filter Bar (FR-CAT-02, FR-CAT-03, ADR-006) */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs mb-6 sticky top-20 z-30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Dynamic Brand Filter Pills (ISS-CAT-01) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-wide mr-1 flex items-center gap-1 flex-shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Brand:</span>
              </span>

              <button
                onClick={() => setSelectedBrand('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  selectedBrand === 'ALL'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/60'
                }`}
              >
                All ({categoryProducts.length})
              </button>

              {availableBrands.map((brand) => {
                const count = categoryProducts.filter((p) => p.brand === brand).length;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                      selectedBrand === brand
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/60'
                    }`}
                  >
                    {brand} ({count})
                  </button>
                );
              })}
            </div>

            {/* Price Sorting & Local In-Category Search */}
            <div className="flex items-center gap-3 justify-between md:justify-end flex-shrink-0">
              
              {/* Price Sort Dropdown (FR-CAT-02, ISS-CAT-03) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wide hidden sm:inline-flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-white hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured Matches</option>
                  <option value="price-asc">Price: Low to High (৳ ↑)</option>
                  <option value="price-desc">Price: High to Low (৳ ↓)</option>
                  <option value="brand-asc">Brand: Alphabetical (A - Z)</option>
                </select>
              </div>

              {/* Active Filters Reset Button */}
              {(selectedBrand !== 'ALL' || sortOption !== 'featured' || searchInCat) && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1 transition"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

            </div>

          </div>

          {/* Active Filter Status */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>
              Showing <strong className="text-neutral-950 font-bold">{processedProducts.length}</strong> of{' '}
              {categoryProducts.length} products
              {selectedBrand !== 'ALL' && ` • Brand: ${selectedBrand}`}
              {sortOption === 'price-asc' && ' • Price: Low to High'}
              {sortOption === 'price-desc' && ' • Price: High to Low'}
            </span>

            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL WARRANTY</span>
            </span>
          </div>

        </div>

        {/* Product Grid */}
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Dead-End Filter Recovery Empty State (ISS-CAT-04) */
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No products match these filters
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Try selecting a different brand or clearing your search criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

