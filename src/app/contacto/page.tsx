"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Contacto</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-dark">Contáctanos</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Estamos listos para atenderte. Cotiza tu material, resuelve dudas o visítanos en nuestras sucursales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green mx-auto mb-3" />
              <h2 className="text-xl font-bold text-dark">Mensaje enviado</h2>
              <p className="text-gray-500 mt-2">Te contactaremos a la brevedad. Tiempo de respuesta: 2-4 horas hábiles.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-brand text-sm font-medium hover:underline">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Envíanos un mensaje</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="55 1234 5678" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input type="email" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Nombre de empresa" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                    <option>Cotización de material</option>
                    <option>Disponibilidad de producto</option>
                    <option>Precios de mayoreo</option>
                    <option>Asesoría técnica</option>
                    <option>Facturación</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                  <textarea rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Describe tu necesidad..." />
                </div>
              </div>
              <button onClick={() => setSent(true)}
                className="mt-4 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar mensaje
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Matriz */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-dark text-sm mb-3">Sucursal Matriz</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand shrink-0" />
                <span>Calz. Ermita Iztapalapa 111, El Prado, Iztapalapa, 09410, CDMX</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span>55 5539 6882</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>ventas@electricasanmiguel.com.mx</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-brand shrink-0" />
                <span>Lun-Vie 8:00-18:00, Sáb 9:00-14:00</span>
              </li>
            </ul>
          </div>

          {/* Sucursal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-dark text-sm mb-3">Sucursal Tacuba</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand shrink-0" />
                <span>Felipe Carrillo Puerto 370, Tacuba, CDMX</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span>55 5386 0755</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>sucursal@electricasanmiguel.com.mx</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/5255372496222?text=Hola,%20necesito%20información"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25D366] text-white rounded-2xl p-5 text-center hover:opacity-90 transition-opacity"
          >
            <p className="font-bold">Atención inmediata</p>
            <p className="text-sm opacity-90 mt-1">Escríbenos por WhatsApp</p>
          </a>
        </div>
      </div>
    </div>
  );
}
