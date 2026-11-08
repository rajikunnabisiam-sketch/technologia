'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  Image as ImageIcon,
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import { Product } from '@/types';
import { createProduct, updateProduct } from '@/services/productService';
import { uploadGadgetImage } from '@/services/storageService';
import { FLAGSHIP_CATEGORIES } from '@/data/categories';

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [category, setCategory] = useState(initialProduct?.category || 'headphones');
  const [categoryLabel, setCategoryLabel] = useState(initialProduct?.categoryLabel || 'Headphones & Audio');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : '');
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice ? String(initialProduct.originalPrice) : '');
  const [inStock, setInStock] = useState(initialProduct?.inStock ?? true);
  const [badge, setBadge] = useState(initialProduct?.badge || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [warranty, setWarranty] = useState(initialProduct?.warranty || '18 Months Official Brand Warranty');
  const [replacementPolicy, setReplacementPolicy] = useState(initialProduct?.replacementPolicy || '7-Day Instant Defect Replacement');
  const [authenticityGuarantee, setAuthenticityGuarantee] = useState(initialProduct?.authenticityGuarantee || '100% Original & Serial Verified');
  
  // Specs & Features as editable multi-lines
  const [specsText, setSpecsText] = useState((initialProduct?.specs || []).join('\n'));
  const [featuresText, setFeaturesText] = useState((initialProduct?.features || []).join('\n'));
  
  // Image handling
  const [mainImageUrl, setMainImageUrl] = useState(initialProduct?.image || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(initialProduct?.images || []);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-slugify when title changes if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    const found = FLAGSHIP_CATEGORIES.find((c) => c.id === catId);
    if (found) {
      setCategoryLabel(found.name);
    }
  };

  // Upload file directly to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const publicUrl = await uploadGadgetImage(file, 'products');
      if (isGallery) {
        setGalleryImages((prev) => [...prev, publicUrl]);
      } else {
        setMainImageUrl(publicUrl);
        if (!galleryImages.includes(publicUrl)) {
          setGalleryImages((prev) => [publicUrl, ...prev]);
        }
      }
      setSuccessMessage('Image successfully uploaded to Supabase Storage!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Upload failed: ${err.message}. Ensure your 'gadgets' storage bucket exists in Supabase.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryInput.trim() && !galleryImages.includes(newGalleryInput.trim())) {
      setGalleryImages((prev) => [...prev, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !price || !brand.trim()) {
      setErrorMessage('Please fill in Title, Slug, Brand, and Price.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const parsedSpecs = specsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedFeatures = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const productPayload: Partial<Product> = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      categoryLabel,
      brand: brand.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      inStock,
      badge: badge.trim() || undefined,
      description: description.trim() || `${title} from ${brand}. Official authentic gadget with full distributor warranty.`,
      warranty: warranty.trim(),
      replacementPolicy: replacementPolicy.trim(),
      authenticityGuarantee: authenticityGuarantee.trim(),
      specs: parsedSpecs,
      features: parsedFeatures,
      image: mainImageUrl || '/images/products/soundcore-r60i-main.jpg',
      images: galleryImages.length > 0 ? galleryImages : [mainImageUrl || '/images/products/soundcore-r60i-main.jpg'],
    };

    try {
      if (isEdit && initialProduct) {
        await updateProduct(initialProduct.id, productPayload);
        setSuccessMessage('Product updated successfully in Supabase!');
      } else {
        await createProduct(productPayload as Omit<Product, 'id'>);
        setSuccessMessage('New product added successfully to Supabase!');
      }

      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {isEdit ? `Edit: ${initialProduct?.title}` : 'Add New Product'}
            </h1>
            <p className="text-xs text-zinc-400">
              Save product attributes, pricing, specs, and upload imagery to Supabase Storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEdit ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Basic Info Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Product Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Anker Prime 200W Multi-Port GaN Power Bank"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              URL Slug <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="anker-prime-200w"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Brand Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Anker, Sony, Apple"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            >
              {FLAGSHIP_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Badge Tag (Optional)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. MEGA DEAL, OFFICIAL SEALED, NEW LAUNCH"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Selling Price (৳) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 8500"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Original / MRP Price (৳)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 9500"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Inventory Status</label>
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-zinc-900 border-zinc-700"
                />
                <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {inStock ? 'In Stock (Available to Order)' : 'Out of Stock (Disabled)'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Storage Image Uploader */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Product Imagery (Supabase Storage)
          </h3>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
            Bucket: gadgets/products
          </span>
        </div>

        {/* Upload Dropzone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Main Thumbnail Preview */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 aspect-square relative overflow-hidden group">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt="Product Preview"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-center text-zinc-500 space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
                <span className="text-xs block">No Main Image Set</span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 text-white text-xs">
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                <span>Uploading to Supabase...</span>
              </div>
            )}
          </div>

          {/* Upload Controls & URL Input */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">
                Direct File Upload to Supabase Storage
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed text-zinc-300 hover:text-white cursor-pointer transition text-xs font-semibold">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                <span>Choose Image to Upload to Supabase Cloud</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Or Main Image URL / Path
              </label>
              <input
                type="text"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://...supabase.co/... or /images/products/..."
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Gallery Images List */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold text-zinc-300 block">
                Additional Gallery Thumbnails ({galleryImages.length})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newGalleryInput}
                  onChange={(e) => setNewGalleryInput(e.target.value)}
                  placeholder="Add another image URL..."
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
                </button>
              </div>

              {galleryImages.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 flex-shrink-0 relative overflow-hidden group"
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-rose-950/80 text-rose-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
          Product Description & Specs
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of features, materials, and audio/power performance..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Key Technical Specs (1 per line)
              </label>
              <textarea
                rows={4}
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                placeholder="20,000mAh Battery Capacity&#10;200W Maximum Output&#10;Smart Active OLED Display&#10;Airline Approved (72Wh)"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Packaging / Box Features (1 per line)
              </label>
              <textarea
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Dual 100W simultaneous laptop charging&#10;Official distributor hologram verified&#10;Includes 240W braided Type-C cable"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
