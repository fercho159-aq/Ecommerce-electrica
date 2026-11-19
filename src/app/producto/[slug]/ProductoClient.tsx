"use client";

import Link from "next/link";
import { ChevronRight, Shield, MessageCircle, Minus, Plus, Heart, ClipboardList } from "lucide-react";
import { getQuoteUrl, type Product, type Category } from "@/data/products";
import { useCart } from "@/store/cart";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { useState } from "react";

type Props = { product: Product; category?: Category; variants: Product[]; related: Product[] };

export default function ProductoClient({ product, category, variants, related }: Props) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();


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
        <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
          <ProductImage
            key={product.id}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain p-8"
            fallbackClassName="w-32 h-32 text-gray-200"
          />
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
          </div>

          {/* Price */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <span className="text-xl font-bold text-dark">Precio a cotizar</span>
            <p className="text-xs text-gray-400 mt-1">Te confirmamos precio y disponibilidad por WhatsApp</p>
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color / acabado</h2>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Link
                    key={v.id}
                    href={`/producto/${v.slug}`}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      v.id === product.id
                        ? "border-brand bg-brand text-white font-medium"
                        : "border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {v.variantLabel}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="mt-6 text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <a
              href={getQuoteUrl(product, quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Cotizar por WhatsApp
            </a>
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] py-3 border border-brand text-brand font-semibold rounded-xl hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-5 h-5" />
              Agregar a cotización
            </button>
            <button aria-label="Favorito" className="p-3 border border-gray-200 rounded-xl hover:border-brand hover:text-brand transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { icon: MessageCircle, title: "Cotización", desc: "Respuesta por WhatsApp" },
              { icon: Shield, title: "Garantía", desc: "De fábrica" },
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
                  <span className="w-32 sm:w-40 shrink-0 px-4 py-2.5 font-medium text-gray-600">{key}</span>
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
