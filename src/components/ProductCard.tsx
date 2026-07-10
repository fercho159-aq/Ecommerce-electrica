"use client";

import Link from "next/link";
import { ShoppingCart, Zap, Tag } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      slug: product.slug,
      brand: product.brand,
      sku: product.sku,
    });
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        {product.images[0] && product.images[0].startsWith("/productos/") ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
        ) : (
          <Zap className="w-16 h-16 text-gray-200 group-hover:text-brand/20 transition-colors" />
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md">NUEVO</span>
          )}
        </div>
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-orange text-white text-[10px] font-bold rounded-md">
            Últimas {product.stock} pzas
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-sm font-semibold text-dark mt-1 line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-dark">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              product.stock > 0 ? "bg-green/10 text-green" : "bg-red-50 text-brand"
            }`}>
              {product.stock > 0 ? "En stock" : "Agotado"}
            </span>
            <span className="text-[10px] text-gray-400">SKU: {product.sku}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3 w-full py-2.5 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </Link>
  );
}
