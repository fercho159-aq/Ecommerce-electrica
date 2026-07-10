import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">Eléctrica</div>
                <div className="text-brand font-extrabold text-sm -mt-0.5">San Miguel</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Más de 50 años siendo tu proveedor de confianza en material eléctrico. Distribuidores autorizados de las mejores marcas.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Catálogo</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/productos?cat=cables-conductores" className="hover:text-white transition-colors">Cables y Conductores</Link></li>
              <li><Link href="/productos?cat=iluminacion" className="hover:text-white transition-colors">Iluminación</Link></li>
              <li><Link href="/productos?cat=canalizacion" className="hover:text-white transition-colors">Canalización</Link></li>
              <li><Link href="/productos?cat=interruptores-contactos" className="hover:text-white transition-colors">Interruptores y Contactos</Link></li>
              <li><Link href="/productos?cat=tableros-proteccion" className="hover:text-white transition-colors">Tableros y Protección</Link></li>
              <li><Link href="/productos?cat=herramientas" className="hover:text-white transition-colors">Herramientas</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Quiénes Somos</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog Técnico</Link></li>
              <li><Link href="/catalogos" className="hover:text-white transition-colors">Catálogos PDF</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/politicas/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="/politicas/envio" className="hover:text-white transition-colors">Políticas de Envío</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                <span>Calz. Ermita Iztapalapa 111, El Prado, Iztapalapa, 09410, CDMX</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-brand" />
                <span>55 5539 6882</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-brand" />
                <span>ventas@electricasanmiguel.com.mx</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                <span>Lun-Vie 8:00-18:00<br/>Sáb 9:00-14:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment methods + copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Métodos de pago:</span>
            <div className="flex items-center gap-2">
              {["Visa", "MC", "AMEX", "OXXO", "SPEI"].map((m) => (
                <span key={m} className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-medium">{m}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2026 Eléctrica San Miguel. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
