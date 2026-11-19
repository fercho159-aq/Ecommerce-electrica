"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Plus, Check } from "lucide-react";
import { Product, getQuoteUrl } from "@/data/products";
import { useCart } from "@/store/cart";
import ProductImage from "@/components/ProductImage";
import { flyToCart } from "@/lib/flyToCart";

export default function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      slug: product.slug,
      brand: product.brand,
      sku: product.sku,
    });
    flyToCart((e.currentTarget as HTMLElement).closest("a"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getQuoteUrl(product), "_blank", "noopener");
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          fallbackClassName="w-16 h-16 text-gray-200 group-hover:text-brand/20 transition-colors"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md">NUEVO</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-sm font-semibold text-dark mt-1 line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-3">
          <span className="text-[10px] text-gray-400 truncate block">SKU: {product.sku}</span>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleQuote}
              className="flex-1 min-w-0 px-2 py-2.5 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="hidden min-[400px]:block w-3.5 h-3.5 shrink-0" />
              Cotizar
            </button>
            <button
              onClick={handleAddToCart}
              aria-label="Agregar a cotización"
              className="shrink-0 w-10 h-10 rounded-xl border border-brand text-brand hover:bg-brand hover:text-white transition-colors flex items-center justify-center"
            >
              {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
