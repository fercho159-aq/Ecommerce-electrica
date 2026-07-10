"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/data/products";
import {
  ChevronRight, CreditCard, Building, QrCode, Smartphone,
  ShieldCheck, Lock, CheckCircle2, Truck, Zap, ArrowLeft
} from "lucide-react";

type Step = "info" | "shipping" | "payment" | "confirm";
type PaymentMethod = "card" | "oxxo" | "spei" | "mercadopago";

export default function CheckoutPage() {
  const cart = useCart();
  const [step, setStep] = useState<Step>("info");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mercadopago");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    street: "", colony: "", city: "", state: "", zip: "",
    notes: "",
  });

  const subtotal = cart.totalPrice();
  const shipping = subtotal >= 2500 ? 0 : 199;
  const total = subtotal + shipping;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Zap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark">Tu carrito está vacío</h1>
        <p className="text-gray-500 mt-2">Agrega productos para continuar con tu compra</p>
        <Link href="/productos" className="inline-block mt-6 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
          Ver productos
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green" />
        </div>
        <h1 className="text-3xl font-bold text-dark">¡Pedido realizado!</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Tu pedido ha sido registrado exitosamente. Recibirás un correo de confirmación con los detalles de tu compra.
        </p>
        <div className="mt-6 p-4 bg-gray-50 rounded-xl inline-block">
          <p className="text-sm text-gray-500">Número de pedido</p>
          <p className="text-2xl font-bold text-brand mt-1">ESM-{Date.now().toString().slice(-6)}</p>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> En producción, aquí se procesaría el pago con MercadoPago y recibirías tu confirmación por email.
          </p>
        </div>
        <Link href="/" className="inline-block mt-8 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "info", label: "Datos" },
    { key: "shipping", label: "Envío" },
    { key: "payment", label: "Pago" },
    { key: "confirm", label: "Confirmar" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dark font-medium">Checkout</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i <= stepIndex ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i <= stepIndex ? "text-dark font-medium" : "text-gray-400"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < stepIndex ? "bg-brand" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2 space-y-6">
          {step === "info" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Datos de contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Juan Pérez García" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                  <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="55 1234 5678" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
                  <input type="text" value={form.company} onChange={(e) => updateForm("company", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Nombre de empresa" />
                </div>
              </div>
              <button onClick={() => setStep("shipping")}
                className="mt-6 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                Continuar al envío
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Dirección de envío</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calle y número *</label>
                  <input type="text" value={form.street} onChange={(e) => updateForm("street", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Av. Insurgentes Sur 1234, Int. 5B" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                  <input type="text" value={form.colony} onChange={(e) => updateForm("colony", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Del Valle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input type="text" value={form.city} onChange={(e) => updateForm("city", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Ciudad de México" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input type="text" value={form.state} onChange={(e) => updateForm("state", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="CDMX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">C.P. *</label>
                  <input type="text" value={form.zip} onChange={(e) => updateForm("zip", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="03100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas de entrega</label>
                  <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    placeholder="Indicaciones para el repartidor..." />
                </div>
              </div>

              {/* Shipping options */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-dark">Método de envío</h3>
                <label className="flex items-center gap-3 p-3 border border-brand rounded-xl bg-brand-50 cursor-pointer">
                  <input type="radio" name="shipping" defaultChecked className="text-brand focus:ring-brand" />
                  <Truck className="w-5 h-5 text-brand" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Envío a domicilio</p>
                    <p className="text-xs text-gray-500">3-5 días hábiles</p>
                  </div>
                  <span className="text-sm font-semibold">{shipping === 0 ? "GRATIS" : formatPrice(shipping)}</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-brand/30">
                  <input type="radio" name="shipping" className="text-brand focus:ring-brand" />
                  <Building className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Recoger en sucursal</p>
                    <p className="text-xs text-gray-500">Disponible en 24 hrs</p>
                  </div>
                  <span className="text-sm font-semibold text-green">GRATIS</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("info")} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button onClick={() => setStep("payment")} className="flex-1 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                  Continuar al pago
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Método de pago</h2>
              <div className="space-y-3">
                {([
                  { id: "mercadopago" as PaymentMethod, icon: CreditCard, title: "MercadoPago", desc: "Tarjeta, MSI, Wallets", badge: "Recomendado" },
                  { id: "card" as PaymentMethod, icon: CreditCard, title: "Tarjeta de crédito/débito", desc: "Visa, Mastercard, AMEX" },
                  { id: "oxxo" as PaymentMethod, icon: QrCode, title: "Pago en OXXO", desc: "Genera una referencia de pago" },
                  { id: "spei" as PaymentMethod, icon: Smartphone, title: "Transferencia SPEI", desc: "Pago inmediato desde tu banco" },
                ]).map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === method.id ? "border-brand bg-brand-50" : "border-gray-200 hover:border-brand/30"
                    }`}
                  >
                    <input
                      type="radio" name="payment" checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)} className="text-brand focus:ring-brand"
                    />
                    <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-brand" : "text-gray-400"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {method.title}
                        {method.badge && (
                          <span className="px-1.5 py-0.5 bg-brand text-white text-[10px] font-bold rounded">{method.badge}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "mercadopago" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#009EE3] rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MP</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-800">MercadoPago Checkout</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Serás redirigido a MercadoPago para completar tu pago de forma segura. Acepta tarjetas, dinero en cuenta y hasta 12 MSI.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Número de tarjeta</label>
                    <input type="text" placeholder="4152 3131 0000 0000" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Vencimiento</label>
                      <input type="text" placeholder="MM/AA" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "oxxo" && (
                <div className="mt-4 p-4 bg-orange/5 rounded-xl border border-orange/20">
                  <p className="text-xs text-gray-600">
                    Se generará un código de barras que podrás presentar en cualquier OXXO. El pago se refleja en 1-2 horas hábiles.
                  </p>
                </div>
              )}

              {paymentMethod === "spei" && (
                <div className="mt-4 p-4 bg-green/5 rounded-xl border border-green/20">
                  <p className="text-xs text-gray-600">
                    Recibirás los datos de la cuenta CLABE para realizar tu transferencia. El pago se confirma en minutos.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Pago procesado de forma segura con encriptación SSL</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button onClick={() => setStep("confirm")} className="flex-1 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                  Revisar pedido
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Confirmar pedido</h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Datos de contacto</h3>
                  <p className="text-sm">{form.name || "—"}</p>
                  <p className="text-sm text-gray-500">{form.email} | {form.phone}</p>
                  {form.company && <p className="text-sm text-gray-500">{form.company}</p>}
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Dirección de envío</h3>
                  <p className="text-sm">{form.street || "—"}</p>
                  <p className="text-sm text-gray-500">{form.colony}, {form.city}, {form.state} {form.zip}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Método de pago</h3>
                  <p className="text-sm font-medium">
                    {paymentMethod === "mercadopago" && "MercadoPago Checkout"}
                    {paymentMethod === "card" && "Tarjeta de crédito/débito"}
                    {paymentMethod === "oxxo" && "Pago en OXXO"}
                    {paymentMethod === "spei" && "Transferencia SPEI"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("payment")} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  onClick={() => { setOrderPlaced(true); cart.clearCart(); }}
                  className="flex-1 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Confirmar y pagar {formatPrice(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-dark mb-4">Resumen del pedido</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400">Cant: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className={shipping === 0 ? "text-green font-medium" : ""}>
                  {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand">{formatPrice(total)}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="mt-3 text-[10px] text-gray-400 text-center">
                Agrega {formatPrice(2500 - subtotal)} más para envío gratis
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
