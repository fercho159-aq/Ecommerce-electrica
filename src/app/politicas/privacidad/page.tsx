import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Aviso de Privacidad</span>
      </nav>
      <h1 className="text-3xl font-bold text-dark mb-6">Aviso de Privacidad</h1>
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p><strong>Eléctrica San Miguel S.A. de C.V.</strong>, con domicilio en Calz. Ermita Iztapalapa 111, Col. El Prado, Iztapalapa, C.P. 09410, Ciudad de México, es responsable del tratamiento de sus datos personales.</p>
        <h2 className="text-lg font-bold text-dark mt-6">Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos personales: nombre completo, correo electrónico, número telefónico, dirección de envío, RFC (cuando se solicite facturación) y datos de pago procesados por MercadoPago.</p>
        <h2 className="text-lg font-bold text-dark mt-6">Finalidad del tratamiento</h2>
        <p>Sus datos serán utilizados para: procesamiento de pedidos y envíos, facturación, comunicación sobre el estado de su compra, servicio al cliente, y envío de información promocional (con su consentimiento).</p>
        <h2 className="text-lg font-bold text-dark mt-6">Seguridad de datos</h2>
        <p>Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o acceso no autorizado.</p>
        <h2 className="text-lg font-bold text-dark mt-6">Derechos ARCO</h2>
        <p>Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, envíe su solicitud a: <strong>ventas@electricasanmiguel.com.mx</strong></p>
        <p className="text-xs text-gray-400 mt-8">Última actualización: Julio 2026</p>
      </div>
    </div>
  );
}
