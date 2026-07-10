"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/data/products";
import {
  ShoppingCart, Menu, X, Search, Phone, ChevronDown,
  Zap, Lightbulb, PipetteIcon, ToggleLeft, Shield, Wrench, FileText, Mail, Home
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio", icon: Home },
  {
    href: "/productos", label: "Productos", icon: Zap,
    children: [
      { href: "/productos?cat=cables-conductores", label: "Cables y Conductores", icon: Zap },
      { href: "/productos?cat=iluminacion", label: "Iluminación", icon: Lightbulb },
      { href: "/productos?cat=canalizacion", label: "Canalización", icon: PipetteIcon },
      { href: "/productos?cat=interruptores-contactos", label: "Interruptores y Contactos", icon: ToggleLeft },
      { href: "/productos?cat=tableros-proteccion", label: "Tableros y Protección", icon: Shield },
      { href: "/productos?cat=herramientas", label: "Herramientas", icon: Wrench },
    ],
  },
  { href: "/catalogos", label: "Catálogos", icon: FileText },
  { href: "/blog", label: "Blog", icon: Mail },
  { href: "/contacto", label: "Contacto", icon: Phone },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cart = useCart();
  const itemCount = cart.totalItems();

  return (
    <>
      {/* Top bar */}
      <div className="bg-dark text-white text-xs py-1.5 overflow-hidden">
        <div className="flex items-center justify-center gap-6 animate-pulse">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            55 5539 6882
          </span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="hidden sm:inline">Envío gratis a partir de $2,500</span>
          <span className="hidden md:inline text-gray-400">|</span>
          <span className="hidden md:inline">Atención Lun-Vie 8:00-18:00, Sáb 9:00-14:00</span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-dark text-sm tracking-tight">Eléctrica</div>
              <div className="text-brand font-extrabold text-sm tracking-tight -mt-0.5">San Miguel</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-1"
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                {link.children && (
                  <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[220px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <child.icon className="w-4 h-4 text-gray-400" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search + Cart */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/productos?q=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                    className="w-48 sm:w-64 h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5255372496222?text=Hola,%20me%20interesa%20cotizar%20material%20eléctrico"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            {/* Cart */}
            <button
              onClick={() => cart.toggleCart()}
              className="relative p-2 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand hover:bg-brand-50 rounded-lg"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-6 space-y-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-brand hover:bg-brand-50 rounded-lg"
                        >
                          <child.icon className="w-3.5 h-3.5" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {cart.isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => cart.setOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">Carrito ({itemCount})</h2>
              <button onClick={() => cart.setOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-gray-200 text-xs font-bold hover:bg-gray-300"
                            >-</button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-gray-200 text-xs font-bold hover:bg-gray-300"
                            >+</button>
                          </div>
                          <span className="text-sm font-bold text-brand">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => cart.removeItem(item.id)} className="text-gray-400 hover:text-brand">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(cart.totalPrice())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => cart.setOpen(false)}
                  className="block w-full py-3 bg-brand text-white text-center font-semibold rounded-xl hover:bg-brand-dark transition-colors"
                >
                  Proceder al pago
                </Link>
                <button
                  onClick={() => cart.clearCart()}
                  className="w-full py-2 text-sm text-gray-500 hover:text-brand transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
