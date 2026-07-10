import { Package, ShoppingBag, DollarSign, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/data/products";
import Link from "next/link";

export default function AdminDashboard() {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 10).length;

  const stats = [
    { label: "Productos", value: totalProducts.toString(), icon: Package, change: "+40", color: "bg-blue-500" },
    { label: "Pedidos (demo)", value: "0", icon: ShoppingBag, change: "Nuevo", color: "bg-brand" },
    { label: "Valor inventario", value: formatPrice(totalValue), icon: DollarSign, change: "", color: "bg-green" },
    { label: "Bajo stock", value: lowStock.toString(), icon: TrendingUp, change: "Atención", color: "bg-orange" },
  ];

  const recentProducts = products.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              {s.change && (
                <span className="text-[10px] font-medium text-green bg-green/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {s.change}
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-dark">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/productos" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand/20 hover:shadow-md transition-all group">
          <Package className="w-6 h-6 text-brand mb-2" />
          <h3 className="font-bold text-dark group-hover:text-brand transition-colors">Gestionar Productos</h3>
          <p className="text-sm text-gray-500 mt-1">Agregar, editar y eliminar productos del catálogo</p>
        </Link>
        <Link href="/admin/pedidos" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand/20 hover:shadow-md transition-all group">
          <ShoppingBag className="w-6 h-6 text-brand mb-2" />
          <h3 className="font-bold text-dark group-hover:text-brand transition-colors">Ver Pedidos</h3>
          <p className="text-sm text-gray-500 mt-1">Gestionar pedidos, estatus y seguimiento</p>
        </Link>
      </div>

      {/* Recent products table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-dark">Productos recientes</h2>
          <Link href="/admin/productos" className="text-xs text-brand font-medium hover:underline">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Producto</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">SKU</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Precio</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-dark">{p.name}</span>
                      <span className="block text-[10px] text-gray-400">{p.brand}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${
                      p.stock > 20 ? "bg-green/10 text-green" : p.stock > 0 ? "bg-orange/10 text-orange" : "bg-red-50 text-brand"
                    }`}>
                      {p.stock} uds
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
