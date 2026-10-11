import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import Calculators from "@/components/Calculators";

export const metadata: Metadata = {
  title: "Calculadoras eléctricas | Eléctrica San Miguel",
  description: "Calcula calibre de cable, caída de tensión, luminarias por espacio, ahorro con LED y diámetro de tubo conduit.",
};

export default function CalculadorasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Calculadoras</span>
      </nav>

      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-dark">Calculadoras eléctricas</h1>
        <p className="text-gray-500 mt-2">
          Dimensiona tu instalación antes de comprar: el resultado se puede mandar a cotizar con un clic.
        </p>
      </div>

      <Calculators />

      <div className="mt-6 flex gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
        <p>
          Resultados orientativos con valores de referencia de la NOM-001-SEDE-2012 para conductores de cobre a 75 °C,
          hasta tres conductores activos por canalización y temperatura ambiente de 30 °C. No consideran factores de
          agrupamiento ni de temperatura. Toda instalación debe ser diseñada y verificada por personal calificado.
        </p>
      </div>
    </div>
  );
}
