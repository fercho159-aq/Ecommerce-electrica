import Link from "next/link";
import { ChevronRight, Download, FileText, Eye } from "lucide-react";

const catalogos = [
  { id: 1, title: "Control y Distribución", description: "Centros de carga, interruptores termomagnéticos, contactores, relevadores y protecciones.", file: "/catalogo/catalogoCONTROLYDISTRIBUCION-.pdf", pages: 48, brands: ["Schneider Electric", "ABB", "Siemens"] },
  { id: 2, title: "Conductores Eléctricos", description: "Cables THW, THHW-LS, uso rudo, multiconductores, desnudos y especiales.", file: "/catalogo/00.-catalogo-CONDUCTORES-ELEC.pdf", pages: 36, brands: ["Condumex", "Viakon", "Latincasa"] },
  { id: 3, title: "Iluminación", description: "Paneles LED, reflectores, tubos, focos, luminarias industriales y decorativas.", file: "/catalogo/Iluminacion1.pdf", pages: 52, brands: ["Philips", "Tecnolite", "Simon"] },
  { id: 4, title: "Tuberías y Canalización", description: "Tubo conduit PVC y metálico, canaletas, charolas portacables y accesorios.", file: "/catalogo/00.-catalogo-TUBERIAS.pdf", pages: 28, brands: ["Duraline", "Charofil", "Nacional"] },
  { id: 5, title: "Terminales y Conectores", description: "Terminales de compresión, conectores, zapatas, empalmes y accesorios de conexión.", file: "/catalogo/catalogo-terminales-y-conectores.pdf", pages: 24, brands: ["3M", "Panduit", "Burndy"] },
  { id: 6, title: "Complementos y Accesorios", description: "Cintas, amarres, herramientas, material de fijación y productos complementarios.", file: "/catalogo/00.-catalogo-MAS-PARA-COMPLEMENTAR.pdf", pages: 32, brands: ["3M", "Klein Tools", "Truper"] },
  { id: 7, title: "Seguridad DEXON", description: "Cámaras, DVRs, sistemas de alarma, control de acceso y videovigilancia.", file: "/catalogo/catalogo-DEXON.pdf", pages: 40, brands: ["Dexon"] },
];

export default function CatalogosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Catálogos</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-dark">Catálogos PDF</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Descarga nuestros catálogos con fichas técnicas, especificaciones y precios de lista
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {catalogos.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Cover */}
            <div className="bg-gradient-to-br from-brand to-brand-dark h-36 flex items-center justify-center relative">
              <FileText className="w-16 h-16 text-white/30" />
              <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/30 text-white text-[10px] rounded-md">
                {cat.pages} páginas
              </span>
            </div>
            {/* Info */}
            <div className="p-5">
              <h3 className="font-bold text-dark">{cat.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cat.brands.map((b) => (
                  <span key={b} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md">{b}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <a href={cat.file} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </a>
                <a href={cat.file} target="_blank" rel="noopener noreferrer"
                  className="py-2.5 px-3 border border-gray-200 text-gray-600 text-xs rounded-xl hover:border-brand hover:text-brand transition-colors flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
