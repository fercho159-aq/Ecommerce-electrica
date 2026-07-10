import Link from "next/link";
import { ChevronRight, Clock, ArrowRight, Tag, BookOpen } from "lucide-react";

const articles = [
  { id: 1, title: "Guía completa: ¿Cómo elegir el calibre de cable correcto?", excerpt: "Aprende a seleccionar el calibre adecuado según la carga eléctrica, distancia y normativa NOM-001-SEDE vigente.", category: "Guía Técnica", date: "5 Mar 2026", readTime: "8 min", slug: "#" },
  { id: 2, title: "NOM-001-SEDE 2024: Cambios clave que debes conocer", excerpt: "Resumen de las actualizaciones más importantes de la norma oficial mexicana para instalaciones eléctricas.", category: "Normatividad", date: "12 Mar 2026", readTime: "6 min", slug: "#" },
  { id: 3, title: "LED vs Fluorescente: Análisis de ahorro real en instalaciones comerciales", excerpt: "Comparativa detallada de consumo, vida útil y retorno de inversión al migrar a tecnología LED.", category: "Iluminación", date: "19 Mar 2026", readTime: "10 min", slug: "#" },
  { id: 4, title: "Cómo instalar un centro de carga residencial paso a paso", excerpt: "Tutorial completo para la instalación segura de un centro de carga QO de 8 a 16 polos en vivienda.", category: "Tutorial", date: "26 Mar 2026", readTime: "12 min", slug: "#" },
  { id: 5, title: "Caso de éxito: Instalación eléctrica completa en nave industrial de 2,000m²", excerpt: "Conoce cómo diseñamos la solución eléctrica para una planta manufacturera en el Estado de México.", category: "Caso de Éxito", date: "2 Abr 2026", readTime: "7 min", slug: "#" },
  { id: 6, title: "Tendencias 2026: Domótica y automatización residencial en México", excerpt: "El mercado de hogares inteligentes crece 35% anual. Descubre las oportunidades para instaladores.", category: "Tendencias", date: "9 Abr 2026", readTime: "5 min", slug: "#" },
  { id: 7, title: "Protección contra sobretensiones: ¿Por qué necesitas un SPD?", excerpt: "Los supresores de picos protegen equipos electrónicos costosos. Aprende cuándo y cómo instalarlos.", category: "Guía Técnica", date: "12 Abr 2026", readTime: "6 min", slug: "#" },
  { id: 8, title: "Energía solar fotovoltaica: Guía de componentes para instaladores", excerpt: "Paneles, inversores, controladores y baterías. Todo lo que necesitas saber para proyectos solares.", category: "Energía Solar", date: "19 Abr 2026", readTime: "9 min", slug: "#" },
];

const categoryColors: Record<string, string> = {
  "Guía Técnica": "bg-blue-100 text-blue-700",
  "Normatividad": "bg-purple-100 text-purple-700",
  "Iluminación": "bg-yellow-100 text-yellow-700",
  "Tutorial": "bg-green/10 text-green",
  "Caso de Éxito": "bg-brand-50 text-brand",
  "Tendencias": "bg-orange/10 text-orange",
  "Energía Solar": "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Blog Técnico</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-dark">Blog Técnico</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Guías, tutoriales y noticias del sector eléctrico para profesionales e instaladores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <article key={article.id} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>
            <div className={`bg-gradient-to-br from-dark-800 to-dark flex items-center justify-center ${i === 0 ? "h-48" : "h-36"}`}>
              <BookOpen className="w-12 h-12 text-white/20" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                  {article.category}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>
              <h2 className={`font-bold text-dark leading-snug ${i === 0 ? "text-xl" : "text-sm"}`}>
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.excerpt}</p>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">{article.date}</span>
                <Link href={article.slug} className="text-xs text-brand font-semibold flex items-center gap-1 hover:underline">
                  Leer más <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-12 bg-gradient-to-r from-dark to-dark-800 rounded-2xl p-8 text-center">
        <Tag className="w-8 h-8 text-brand mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Suscríbete al newsletter técnico</h2>
        <p className="text-gray-400 mt-1 text-sm">Recibe guías, ofertas exclusivas y novedades del sector</p>
        <div className="flex max-w-md mx-auto mt-4 gap-2">
          <input type="email" placeholder="tu@correo.com"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand" />
          <button className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors">
            Suscribirse
          </button>
        </div>
      </div>
    </div>
  );
}
