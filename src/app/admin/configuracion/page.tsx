import { Store, CreditCard, Truck, Bell } from "lucide-react";

export default function AdminConfigPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Demo:</strong> En producción, estas configuraciones se guardarán en la base de datos y se aplicarán en tiempo real.
        </p>
      </div>

      {/* Store info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-brand" />
          <h2 className="font-bold text-dark">Información de la tienda</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de la tienda</label>
            <input type="text" defaultValue="Eléctrica San Miguel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email de contacto</label>
            <input type="email" defaultValue="ventas@electricasanmiguel.com.mx" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono principal</label>
            <input type="tel" defaultValue="55 5539 6882" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
            <input type="tel" defaultValue="55 3724 9622" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-brand" />
          <h2 className="font-bold text-dark">Pasarela de pago</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">MercadoPago Public Key</label>
            <input type="text" placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">MercadoPago Access Token</label>
            <input type="password" placeholder="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <p className="text-[10px] text-gray-400">Obtén tus credenciales en mercadopago.com.mx/developers</p>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-brand" />
          <h2 className="font-bold text-dark">Envíos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Envío gratis a partir de</label>
            <input type="number" defaultValue={2500} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tarifa envío estándar</label>
            <input type="number" defaultValue={199} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-brand" />
          <h2 className="font-bold text-dark">Notificaciones</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email de confirmación de pedido", checked: true },
            { label: "Notificación de envío al cliente", checked: true },
            { label: "Alerta de stock bajo (menos de 10 unidades)", checked: true },
            { label: "Resumen diario de ventas", checked: false },
          ].map((n) => (
            <label key={n.label} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked={n.checked} className="rounded text-brand focus:ring-brand" />
              {n.label}
            </label>
          ))}
        </div>
      </div>

      <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
        Guardar configuración
      </button>
    </div>
  );
}
