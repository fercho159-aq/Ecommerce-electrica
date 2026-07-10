import Link from "next/link";
import { Zap, Lightbulb, Shield, Wrench, ArrowRight, Truck, HeadphonesIcon, CreditCard, Award, ChevronRight, PipetteIcon, ToggleLeft } from "lucide-react";
import { getFeaturedProducts, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryIcons: Record<string, React.ElementType> = {
  cable: Zap, lightbulb: Lightbulb, pipe: PipetteIcon,
  switch: ToggleLeft, shield: Shield, wrench: Wrench,
};

const brands = [
  "Schneider Electric", "Condumex", "Philips", "Leviton", "Tecnolite",
  "Klein Tools", "3M", "ABB", "Panduit", "Viakon", "Dexson", "Charofil",
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-brand text-white text-center py-2.5 px-4">
        <p className="text-sm font-semibold">
          Aprovecha nuestras ofertas de temporada — Hasta 20% de descuento en cables y conductores
          <Link href="/productos?cat=cables-conductores" className="ml-2 underline underline-offset-2 font-bold hover:text-white/80">
            Comprar ahora
          </Link>
        </p>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark via-dark-800 to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-light rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="mb-6">
              <img src="/logo.png" alt="Eléctrica San Miguel" className="h-16 w-auto" />
            </div>
            <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full mb-4 border border-brand/20">
              50 años de experiencia
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Tu proveedor de
              <span className="text-brand"> material eléctrico</span> de confianza
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-lg">
              Más de 25,000 productos de las mejores marcas. Envíos a toda la República, atención personalizada y precios de distribuidor.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/productos"
                className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                Ver catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/5255372496222?text=Hola,%20quiero%20cotizar%20material%20eléctrico"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
              >
                Solicitar cotización
              </a>
            </div>
            {/* Trust counters */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "25,000+", label: "Productos" },
                { value: "50+", label: "Años" },
                { value: "2", label: "Sucursales CDMX" },
                { value: "500+", label: "Clientes activos" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Envío gratis", desc: "En compras +$2,500" },
              { icon: HeadphonesIcon, title: "Asesoría técnica", desc: "Equipo especializado" },
              { icon: CreditCard, title: "Pago seguro", desc: "Múltiples métodos" },
              { icon: Award, title: "Marcas originales", desc: "Garantía de fábrica" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark">{title}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Categorías</h2>
            <p className="text-sm text-gray-500 mt-1">Encuentra lo que necesitas para tu proyecto</p>
          </div>
          <Link href="/productos" className="text-sm text-brand font-medium hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || Zap;
            return (
              <Link
                key={cat.id}
                href={`/productos?cat=${cat.slug}`}
                className="group p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand/20 hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-dark">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.productCount} productos</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">Productos Destacados</h2>
              <p className="text-sm text-gray-500 mt-1">Los más vendidos y con mejores precios</p>
            </div>
            <Link href="/productos" className="text-sm text-brand font-medium hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-center text-lg font-bold text-dark mb-6">Marcas que distribuimos</h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="px-5 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-500 hover:text-brand hover:bg-brand-50 transition-colors border border-gray-100"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-dark to-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            ¿Necesitas una cotización especial?
          </h2>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Precios de mayoreo para proyectos, instaladores y empresas constructoras
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href="https://wa.me/5255372496222"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Cotizar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
