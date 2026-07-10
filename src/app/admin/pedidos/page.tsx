import { ShoppingBag, Clock, Package, CheckCircle2, Truck } from "lucide-react";

const demoOrders = [
  { id: "ESM-000001", customer: "Juan Pérez García", email: "juan@ejemplo.com", date: "10 Jul 2026", total: "$1,048.00", items: 1, status: "pendiente" },
  { id: "ESM-000002", customer: "María López Ruiz", email: "maria@empresa.com", date: "10 Jul 2026", total: "$4,890.00", items: 3, status: "procesando" },
  { id: "ESM-000003", customer: "Carlos Sánchez M.", email: "carlos@constructora.mx", date: "9 Jul 2026", total: "$12,350.00", items: 8, status: "enviado" },
  { id: "ESM-000004", customer: "Ana Martínez", email: "ana@gmail.com", date: "9 Jul 2026", total: "$2,680.00", items: 2, status: "entregado" },
  { id: "ESM-000005", customer: "Roberto Hernández", email: "roberto@instalaciones.mx", date: "8 Jul 2026", total: "$8,750.00", items: 5, status: "entregado" },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  procesando: { label: "Procesando", color: "bg-blue-100 text-blue-700", icon: Package },
  enviado: { label: "Enviado", color: "bg-purple-100 text-purple-700", icon: Truck },
  entregado: { label: "Entregado", color: "bg-green/10 text-green", icon: CheckCircle2 },
};

export default function AdminPedidosPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total pedidos", value: "5", color: "bg-brand" },
          { label: "Pendientes", value: "1", color: "bg-yellow-500" },
          { label: "En proceso", value: "1", color: "bg-blue-500" },
          { label: "Entregados", value: "2", color: "bg-green" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-8 h-8 ${s.color} rounded-xl flex items-center justify-center mb-2`}>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-dark">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Demo:</strong> Los pedidos mostrados son de ejemplo. En producción, se conectarán con MercadoPago y el sistema de envíos para actualizar estatus automáticamente.
        </p>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-dark">Pedidos recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Pedido</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Cliente</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Fecha</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Total</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Artículos</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-brand">{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-dark">{order.customer}</span>
                        <span className="block text-[10px] text-gray-400">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    <td className="px-4 py-3 font-semibold">{order.total}</td>
                    <td className="px-4 py-3 text-gray-500">{order.items} pza(s)</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${config.color}`}>
                        <StatusIcon className="w-3 h-3" /> {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
