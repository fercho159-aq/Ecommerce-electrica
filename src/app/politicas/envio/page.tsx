import Link from "next/link";
import { ChevronRight, Truck, Package, Clock, MapPin } from "lucide-react";

export default function EnvioPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Políticas de Envío</span>
      </nav>
      <h1 className="text-3xl font-bold text-dark mb-6">Políticas de Envío</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: Truck, title: "Envío gratis", desc: "En compras mayores a $2,500 MXN dentro de la CDMX y zona metropolitana." },
          { icon: Clock, title: "Tiempo de entrega", desc: "3 a 5 días hábiles para CDMX. 5 a 8 días hábiles para el interior de la República." },
          { icon: Package, title: "Recolección en sucursal", desc: "Disponible en 24 horas después de confirmar tu pedido. Sin costo adicional." },
          { icon: MapPin, title: "Cobertura", desc: "Envíos a toda la República Mexicana mediante paquetería y flotilla propia en CDMX." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5">
            <Icon className="w-6 h-6 text-brand mb-2" />
            <h3 className="font-bold text-dark text-sm">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <h2 className="text-lg font-bold text-dark">Tarifas de envío</h2>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2.5 text-left font-semibold">Zona</th><th className="px-4 py-2.5 text-left font-semibold">Costo</th><th className="px-4 py-2.5 text-left font-semibold">Tiempo</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="px-4 py-2.5">CDMX y Zona Metropolitana</td><td className="px-4 py-2.5">$199 (gratis +$2,500)</td><td className="px-4 py-2.5">3-5 días hábiles</td></tr>
              <tr className="border-t border-gray-100 bg-gray-50"><td className="px-4 py-2.5">Interior de la República</td><td className="px-4 py-2.5">Desde $299</td><td className="px-4 py-2.5">5-8 días hábiles</td></tr>
              <tr className="border-t border-gray-100"><td className="px-4 py-2.5">Recolección en sucursal</td><td className="px-4 py-2.5 text-green font-medium">Gratis</td><td className="px-4 py-2.5">24 horas</td></tr>
            </tbody>
          </table>
        </div>
        <h2 className="text-lg font-bold text-dark mt-6">Devoluciones</h2>
        <p>Aceptamos devoluciones dentro de los primeros 30 días posteriores a la compra, siempre que el producto se encuentre en su empaque original, sin uso y con todos sus accesorios. Los costos de envío de devolución corren por cuenta del cliente, excepto en casos de producto defectuoso.</p>
        <p className="text-xs text-gray-400 mt-8">Última actualización: Julio 2026</p>
      </div>
    </div>
  );
}
