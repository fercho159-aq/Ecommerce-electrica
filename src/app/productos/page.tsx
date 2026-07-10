"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { products, categories, searchProducts, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">Cargando productos...</div>}>
      <ProductosContent />
    </Suspense>
  );
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = getProductsByCategory(selectedCategory);
    }
    if (query) {
      const searched = searchProducts(query);
      result = result.filter((p) => searched.some((s) => s.id === p.id));
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    switch (sortBy) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "name": result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [selectedCategory, query, sortBy, selectedBrands]);

  const availableBrands = useMemo(() => {
    const base = selectedCategory ? getProductsByCategory(selectedCategory) : products;
    return [...new Set(base.map((p) => p.brand))].sort();
  }, [selectedCategory]);

  const activeCat = categories.find((c) => c.slug === selectedCategory);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">{activeCat ? activeCat.name : "Todos los productos"}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="lg:w-60 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categorías</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    !selectedCategory ? "bg-brand text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Todas ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === cat.slug ? "bg-brand text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat.name} ({cat.productCount})
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Marcas</h3>
              <div className="space-y-1.5">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-brand">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-dark">{filteredProducts.length}</span> productos
              {activeCat && <span> en <span className="font-medium">{activeCat.name}</span></span>}
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedBrands.length > 0 || query) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {query && (
                <span className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand text-xs font-medium rounded-lg">
                  &ldquo;{query}&rdquo;
                  <button onClick={() => setQuery("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrands.map((brand) => (
                <span key={brand} className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand text-xs font-medium rounded-lg">
                  {brand}
                  <button onClick={() => toggleBrand(brand)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button
                onClick={() => { setSelectedBrands([]); setQuery(""); }}
                className="text-xs text-gray-500 hover:text-brand"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No se encontraron productos</p>
              <p className="text-sm text-gray-400 mt-1">Intenta con otros filtros o palabras clave</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
