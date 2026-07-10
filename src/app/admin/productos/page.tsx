"use client";

import { useState } from "react";
import { products as initialProducts, categories, formatPrice, Product } from "@/data/products";
import { Plus, Search, Edit3, Trash2, X, Save, Upload } from "lucide-react";

export default function AdminProductosPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  const filtered = productList.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const emptyProduct: Product = {
    id: `p${Date.now()}`, name: "", slug: "", description: "", price: 0,
    category: categories[0].slug, subcategory: "", brand: "", sku: "",
    stock: 0, images: [], specs: {}, featured: false, isNew: false,
  };

  const [form, setForm] = useState<Product>(emptyProduct);

  const openCreate = () => {
    setForm({ ...emptyProduct, id: `p${Date.now()}` });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Product) => {
    setForm({ ...p });
    setEditing(p);
    setCreating(false);
  };

  const closeForm = () => { setEditing(null); setCreating(false); };

  const saveProduct = () => {
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const updated = { ...form, slug };
    if (creating) {
      setProductList([updated, ...productList]);
    } else {
      setProductList(productList.map((p) => (p.id === updated.id ? updated : p)));
    }
    closeForm();
  };

  const deleteProduct = (id: string) => {
    setProductList(productList.filter((p) => p.id !== id));
  };

  const updateForm = (field: keyof Product, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormOpen = editing || creating;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por nombre o SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="">Todas las categorías</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCSV(!showCSV)} className="px-3 py-2 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 flex items-center gap-1.5">
            <Upload className="w-4 h-4" /> CSV
          </button>
          <button onClick={openCreate} className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </div>
      </div>

      {/* CSV info */}
      {showCSV && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 text-sm mb-2">Carga masiva por CSV</h3>
          <p className="text-xs text-blue-700 mb-2">Formato requerido: nombre, descripcion, precio, categoria, subcategoria, marca, sku, stock</p>
          <div className="flex gap-2">
            <label className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg cursor-pointer hover:bg-blue-700">
              <input type="file" accept=".csv" className="hidden" onChange={() => alert("Demo: La carga CSV se conectará a la base de datos en producción")} />
              Seleccionar archivo CSV
            </label>
            <button onClick={() => setShowCSV(false)} className="text-xs text-blue-600 hover:underline">Cerrar</button>
          </div>
        </div>
      )}

      {/* Product form modal */}
      {isFormOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={closeForm} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">{creating ? "Nuevo producto" : "Editar producto"}</h2>
              <button onClick={closeForm}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Cable THW 12 AWG" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Precio *</label>
                  <input type="number" value={form.price} onChange={(e) => updateForm("price", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Precio anterior</label>
                  <input type="number" value={form.comparePrice || ""} onChange={(e) => updateForm("comparePrice", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción *</label>
                <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Categoría *</label>
                  <select value={form.category} onChange={(e) => updateForm("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                    {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subcategoría</label>
                  <input type="text" value={form.subcategory} onChange={(e) => updateForm("subcategory", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Marca *</label>
                  <input type="text" value={form.brand} onChange={(e) => updateForm("brand", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Condumex" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => updateForm("sku", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="CDX-THW12-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => updateForm("stock", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured || false} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded text-brand focus:ring-brand" />
                  Producto destacado
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isNew || false} onChange={(e) => updateForm("isNew", e.target.checked)} className="rounded text-brand focus:ring-brand" />
                  Nuevo
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Imagen del producto</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand/30 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Arrastra una imagen o haz clic para subir</p>
                  <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP (max 2MB)</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex gap-2">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={saveProduct} className="flex-1 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> {creating ? "Crear producto" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">{filtered.length} productos</span>
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
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.featured && <span className="w-1.5 h-1.5 bg-brand rounded-full" title="Destacado" />}
                      <div>
                        <span className="font-medium text-dark">{p.name}</span>
                        <span className="block text-[10px] text-gray-400">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{formatPrice(p.price)}</span>
                    {p.comparePrice && <span className="block text-[10px] text-gray-400 line-through">{formatPrice(p.comparePrice)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${
                      p.stock > 20 ? "bg-green/10 text-green" : p.stock > 0 ? "bg-orange/10 text-orange" : "bg-red-50 text-brand"
                    }`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{categories.find((c) => c.slug === p.category)?.name || p.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-50 rounded-lg" title="Editar">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-50 rounded-lg" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
