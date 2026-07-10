import Link from "next/link";
import { ChevronRight, Zap, Users, MapPin, Award, Target, Eye, Heart, Building, TrendingUp } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Quiénes Somos</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-dark via-dark-800 to-dark rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand/10 rounded-full blur-[80px]" />
        <div className="relative max-w-2xl">
          <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full mb-4 border border-brand/20">
            Desde 1976
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            50 años siendo tu aliado en <span className="text-brand">soluciones eléctricas</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Eléctrica San Miguel nació con la visión de ser el distribuidor de material eléctrico más confiable de la Ciudad de México. Hoy, cinco décadas después, seguimos comprometidos con esa promesa.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Zap, value: "25,000+", label: "Productos en catálogo" },
          { icon: Users, value: "500+", label: "Clientes activos" },
          { icon: MapPin, value: "2", label: "Sucursales en CDMX" },
          { icon: Award, value: "50+", label: "Años de experiencia" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <Icon className="w-6 h-6 text-brand mx-auto mb-2" />
            <div className="text-2xl font-bold text-dark">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Target, title: "Misión", text: "Proveer material eléctrico de la más alta calidad con asesoría técnica especializada, contribuyendo al desarrollo de proyectos eléctricos seguros y eficientes en todo México." },
          { icon: Eye, title: "Visión", text: "Ser el distribuidor líder de material eléctrico en la zona metropolitana, reconocido por nuestra innovación en comercio electrónico, servicio al cliente excepcional y compromiso con la seguridad eléctrica." },
          { icon: Heart, title: "Valores", text: "Confianza, calidad, servicio, innovación y compromiso. Cada producto que vendemos cumple con las normas mexicanas vigentes y está respaldado por la garantía de fábrica." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-brand" />
            </div>
            <h2 className="text-lg font-bold text-dark">{title}</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-dark text-center mb-8">Nuestra Historia</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            { year: "1976", title: "Fundación", desc: "Se funda Eléctrica San Miguel en Iztapalapa, CDMX, como una pequeña distribuidora de material eléctrico." },
            { year: "1990", title: "Expansión de catálogo", desc: "Se incorporan marcas internacionales líderes como Schneider Electric, Philips y 3M." },
            { year: "2005", title: "Segunda sucursal", desc: "Se abre la sucursal de Tacuba para atender la zona poniente de la ciudad." },
            { year: "2020", title: "Transformación digital", desc: "Inicio del proceso de digitalización con catálogos en línea y atención por WhatsApp." },
            { year: "2026", title: "E-Commerce", desc: "Lanzamiento de la tienda en línea con envíos a toda la República Mexicana." },
          ].map((item, i) => (
            <div key={item.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {item.year.slice(2)}
                </div>
                {i < 4 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="pb-6">
                <div className="text-xs text-brand font-semibold">{item.year}</div>
                <h3 className="font-bold text-dark">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          { name: "Sucursal Matriz — Iztapalapa", address: "Calz. Ermita Iztapalapa 111, El Prado, 09410, CDMX", phone: "55 5539 6882", wa: "55 3724 9622" },
          { name: "Sucursal Tacuba", address: "Felipe Carrillo Puerto 370, Tacuba, CDMX", phone: "55 5386 0755", wa: "55 7070 5324" },
        ].map((branch) => (
          <div key={branch.name} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-5 h-5 text-brand" />
              <h3 className="font-bold text-dark">{branch.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{branch.address}</p>
            <p className="text-sm text-gray-500 mt-1">Tel: {branch.phone} | WhatsApp: {branch.wa}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-brand rounded-2xl p-8 text-center">
        <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">¿Listo para tu próximo proyecto?</h2>
        <p className="text-white/70 mt-1 text-sm">Contáctanos y recibe asesoría personalizada de nuestro equipo técnico</p>
        <div className="flex justify-center gap-3 mt-4">
          <Link href="/contacto" className="px-5 py-2.5 bg-white text-brand font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors">
            Contactar
          </Link>
          <Link href="/productos" className="px-5 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors border border-white/20">
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
