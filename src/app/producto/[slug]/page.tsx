"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShoppingCart, Zap, Truck, Shield, RotateCcw, Minus, Plus, Heart } from "lucide-react";
import { getProductBySlug, formatPrice, products, categories } from "@/data/products";
import { useCart } from "@/store/cart";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";

export default function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      slug: product.slug,
      brand: product.brand,
      sku: product.sku,
    }, quantity);
    cart.setOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/productos" className="hover:text-brand">Productos</Link>
        <ChevronRight className="w-3 h-3" />
        {category && (
          <>
            <Link href={`/productos?cat=${category.slug}`} className="hover:text-brand">{category.name}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-dark font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center relative">
          <Zap className="w-32 h-32 text-gray-200" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-brand text-white text-sm font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-lg">
              NUEVO
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{product.brand}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-dark mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">SKU: {product.sku}</span>
            <span className="text-gray-300">|</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
              product.stock > 0 ? "bg-green/10 text-green" : "bg-red-50 text-brand"
            }`}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Agotado"}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-dark">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-brand">Ahorras {formatPrice(product.comparePrice! - product.price)}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">IVA incluido</p>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:border-brand hover:text-brand transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "Envío gratis", desc: "Compras +$2,500" },
              { icon: Shield, title: "Garantía", desc: "De fábrica" },
              { icon: RotateCcw, title: "Devoluciones", desc: "30 días" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 text-brand mx-auto mb-1" />
                <div className="text-xs font-semibold">{title}</div>
                <div className="text-[10px] text-gray-400">{desc}</div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-dark mb-3">Especificaciones</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div key={key} className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <span className="w-40 shrink-0 px-4 py-2.5 font-medium text-gray-600">{key}</span>
                  <span className="px-4 py-2.5 text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-dark mb-4">Productos relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
