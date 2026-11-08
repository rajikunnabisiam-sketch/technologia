'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProductById } from '@/services/productService';
import { Product } from '@/types';
import { AlertCircle, Package } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const p = await getProductById(id);
        setProduct(p);
      } catch (err) {
        console.error('Failed to load product for edit:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-zinc-400 text-xs">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested product ID &quot;{id}&quot; does not exist in the database or bundled catalog.
        </p>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
