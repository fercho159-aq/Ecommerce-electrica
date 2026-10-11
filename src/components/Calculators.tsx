"use client";

import { useState } from "react";
import Link from "next/link";
import { Cable, TrendingDown, Lightbulb, PiggyBank, Cylinder, MessageCircle, ArrowRight, Plus, Trash2 } from "lucide-react";
import {
  CONDUCTORS, LIGHT_LEVELS, SystemType,
  getConductor, sizeCable, sizeConduit, voltageDropPercent, lightingPlan, ledSavings,
} from "@/lib/electrical";
import { whatsappUrl } from "@/lib/contact";

const tools = [
  { id: "cable", label: "Calibre de cable", icon: Cable, desc: "Calibre y protección para tu circuito" },
  { id: "caida", label: "Caída de tensión", icon: TrendingDown, desc: "Verifica un calibre que ya tienes" },
  { id: "iluminacion", label: "Iluminación", icon: Lightbulb, desc: "Cuántas luminarias necesita un espacio" },
  { id: "ahorro", label: "Ahorro con LED", icon: PiggyBank, desc: "Cuánto bajas tu recibo al cambiar a LED" },
  { id: "conduit", label: "Tubo conduit", icon: Cylinder, desc: "Diámetro de tubería para tus cables" },
] as const;

type ToolId = (typeof tools)[number]["id"];

const SYSTEMS: { value: SystemType; label: string }[] = [
  { value: "1F", label: "Monofásico" },
  { value: "2F", label: "Bifásico" },
  { value: "3F", label: "Trifásico" },
];

const num = (value: string) => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};
const fmt = (value: number, digits = 1) =>
  value.toLocaleString("es-MX", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const money = (value: number) =>
  value.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

// ------------------------------------------------------------ piezas de UI

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

function NumberField({ label, hint, unit, value, onChange }: {
  label: string; hint?: string; unit?: string; value: string; onChange: (value: string) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${unit ? "pr-12" : ""}`}
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>}
      </div>
    </Field>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void;
}) {
  return (
    <div>
      <span className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</span>
      <div className="grid gap-1 p-1 bg-gray-100 rounded-xl" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
              value === option.value ? "bg-white text-brand shadow-sm" : "text-gray-600 hover:text-dark"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AwgSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {CONDUCTORS.map((c) => (
          <option key={c.awg} value={c.awg}>{c.awg} AWG</option>
        ))}
      </select>
    </Field>
  );
}

function Result({ label, value, unit, note, tone = "default" }: {
  label: string; value: string; unit?: string; note?: string; tone?: "default" | "ok" | "warn";
}) {
  const color = tone === "ok" ? "text-green" : tone === "warn" ? "text-orange" : "text-white";
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</div>
      <div className={`mt-1 text-3xl font-bold tabular-nums ${color}`}>
        {value}
        {unit && <span className="ml-1.5 text-base font-medium text-gray-400">{unit}</span>}
      </div>
      {note && <div className="mt-1 text-xs text-gray-400">{note}</div>}
    </div>
  );
}

function Layout({ inputs, results, quoteText, shopHref, shopLabel }: {
  inputs: React.ReactNode; results: React.ReactNode; quoteText: string; shopHref: string; shopLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">{inputs}</div>
      <div className="lg:col-span-2 bg-dark rounded-2xl p-5 sm:p-6 flex flex-col">
        <div className="space-y-5 flex-1">{results}</div>
        <div className="mt-6 space-y-2">
          <a
            href={whatsappUrl(quoteText)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Cotizar este material
          </a>
          <Link
            href={shopHref}
            className="w-full py-3 border border-white/15 text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            {shopLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ calculadoras

function CableCalculator() {
  const [watts, setWatts] = useState("3500");
  const [volts, setVolts] = useState("127");
  const [system, setSystem] = useState<SystemType>("1F");
  const [powerFactor, setPowerFactor] = useState("0.9");
  const [meters, setMeters] = useState("20");
  const [maxDrop, setMaxDrop] = useState("3");

  const result = sizeCable(num(watts), num(volts), system, num(powerFactor), num(meters), num(maxDrop));
  const upsized = result.recommended && result.byAmpacity && result.recommended.awg !== result.byAmpacity.awg;

  return (
    <Layout
      quoteText={
        result.recommended
          ? `Hola, quiero cotizar cable calibre ${result.recommended.awg} AWG para un circuito de ${watts} W a ${volts} V, ${meters} m de longitud, con protección de ${result.breaker} A.`
          : "Hola, necesito ayuda para calcular el cable de un circuito."
      }
      shopHref="/productos?cat=cables-conductores"
      shopLabel="Ver cables y conductores"
      inputs={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField label="Carga total" unit="W" value={watts} onChange={setWatts} hint="Suma de los equipos del circuito" />
            <NumberField label="Voltaje" unit="V" value={volts} onChange={setVolts} hint="127, 220 o 440 V" />
          </div>
          <Segmented label="Sistema" options={SYSTEMS} value={system} onChange={setSystem} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberField label="Longitud" unit="m" value={meters} onChange={setMeters} hint="Solo de ida" />
            <NumberField label="Factor de potencia" value={powerFactor} onChange={setPowerFactor} hint="0.9 típico" />
            <NumberField label="Caída máxima" unit="%" value={maxDrop} onChange={setMaxDrop} hint="3 % recomendado" />
          </div>
        </>
      }
      results={
        result.recommended ? (
          <>
            <Result
              label="Calibre recomendado"
              value={result.recommended.awg}
              unit="AWG"
              note={upsized
                ? `Por ampacidad bastaría ${result.byAmpacity!.awg} AWG; se sube por la caída de tensión.`
                : "Cobre, aislamiento THW / THHW-LS a 75 °C"}
            />
            <Result label="Corriente de la carga" value={fmt(result.amps)} unit="A" note={`Diseño al 125 %: ${fmt(result.designAmps)} A`} />
            <Result label="Caída de tensión" value={fmt(result.dropPercent, 2)} unit="%" tone="ok" />
            <Result label="Interruptor termomagnético" value={String(result.breaker ?? "—")} unit="A" />
          </>
        ) : (
          <p className="text-sm text-gray-300">
            {result.amps > 0
              ? "Esta carga supera el rango de la calculadora (hasta 4/0 AWG). Escríbenos y la calculamos contigo."
              : "Captura la carga y el voltaje para ver el resultado."}
          </p>
        )
      }
    />
  );
}

function VoltageDropCalculator() {
  const [awg, setAwg] = useState("12");
  const [amps, setAmps] = useState("16");
  const [volts, setVolts] = useState("127");
  const [meters, setMeters] = useState("30");
  const [system, setSystem] = useState<SystemType>("1F");

  const conductor = getConductor(awg);
  const percent = voltageDropPercent(num(amps), num(meters), num(volts), system, conductor);
  const dropVolts = (percent / 100) * num(volts);
  const ok = percent <= 3;
  const overAmpacity = num(amps) > conductor.ampacity;

  return (
    <Layout
      quoteText={`Hola, quiero cotizar ${meters} m de cable calibre ${awg} AWG.`}
      shopHref="/productos?cat=cables-conductores"
      shopLabel="Ver cables y conductores"
      inputs={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AwgSelect label="Calibre del conductor" value={awg} onChange={setAwg} />
            <NumberField label="Corriente" unit="A" value={amps} onChange={setAmps} />
          </div>
          <Segmented label="Sistema" options={SYSTEMS} value={system} onChange={setSystem} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField label="Voltaje" unit="V" value={volts} onChange={setVolts} />
            <NumberField label="Longitud" unit="m" value={meters} onChange={setMeters} hint="Solo de ida" />
          </div>
        </>
      }
      results={
        <>
          <Result
            label="Caída de tensión"
            value={fmt(percent, 2)}
            unit="%"
            tone={ok ? "ok" : "warn"}
            note={ok ? "Dentro del 3 % recomendado para circuitos derivados" : "Supera el 3 % recomendado: usa un calibre mayor"}
          />
          <Result label="Voltaje perdido" value={fmt(dropVolts, 2)} unit="V" note={`Llegan ${fmt(Math.max(0, num(volts) - dropVolts))} V a la carga`} />
          <Result
            label={`Ampacidad del ${awg} AWG`}
            value={String(conductor.ampacity)}
            unit="A"
            tone={overAmpacity ? "warn" : "default"}
            note={overAmpacity ? "La corriente supera la capacidad de este calibre" : "Cobre a 75 °C"}
          />
        </>
      }
    />
  );
}

function LightingCalculator() {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [space, setSpace] = useState("oficina");
  const [lumens, setLumens] = useState("1600");

  const level = LIGHT_LEVELS.find((l) => l.id === space) ?? LIGHT_LEVELS[0];
  const area = num(length) * num(width);
  const plan = lightingPlan(area, level.lux, num(lumens));

  return (
    <Layout
      quoteText={`Hola, quiero cotizar ${plan.fixtures} luminarias de ${lumens} lm para un espacio de ${fmt(area)} m² (${level.label}).`}
      shopHref="/productos?cat=iluminacion"
      shopLabel="Ver iluminación"
      inputs={
        <>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Largo" unit="m" value={length} onChange={setLength} />
            <NumberField label="Ancho" unit="m" value={width} onChange={setWidth} />
          </div>
          <Field label="Tipo de espacio">
            <select value={space} onChange={(e) => setSpace(e.target.value)} className={inputClass}>
              {LIGHT_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>{l.label} — {l.lux} lux</option>
              ))}
            </select>
          </Field>
          <NumberField
            label="Flujo de cada luminaria"
            unit="lm"
            value={lumens}
            onChange={setLumens}
            hint="Lo encuentras en la ficha del producto como «Flujo luminoso»"
          />
        </>
      }
      results={
        <>
          <Result label="Luminarias necesarias" value={String(plan.fixtures)} unit={plan.fixtures === 1 ? "pieza" : "piezas"} />
          <Result label="Área" value={fmt(area)} unit="m²" note={`Nivel recomendado: ${level.lux} lux`} />
          <Result label="Flujo total requerido" value={fmt(plan.requiredLumens, 0)} unit="lm" note="Incluye pérdidas por reflexión y mantenimiento" />
        </>
      }
    />
  );
}

function SavingsCalculator() {
  const [currentWatts, setCurrentWatts] = useState("60");
  const [ledWatts, setLedWatts] = useState("9");
  const [quantity, setQuantity] = useState("12");
  const [hours, setHours] = useState("5");
  const [price, setPrice] = useState("3.5");

  const savings = ledSavings(num(currentWatts), num(ledWatts), num(quantity), num(hours), num(price));

  return (
    <Layout
      quoteText={`Hola, quiero cotizar ${quantity} focos LED de ${ledWatts} W para sustituir lámparas de ${currentWatts} W.`}
      shopHref="/productos?cat=iluminacion"
      shopLabel="Ver focos y luminarias LED"
      inputs={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField label="Lámpara actual" unit="W" value={currentWatts} onChange={setCurrentWatts} hint="Incandescente, halógena o fluorescente" />
            <NumberField label="Reemplazo LED" unit="W" value={ledWatts} onChange={setLedWatts} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberField label="Cantidad" unit="pzas" value={quantity} onChange={setQuantity} />
            <NumberField label="Uso diario" unit="h" value={hours} onChange={setHours} />
            <NumberField label="Tarifa" unit="$/kWh" value={price} onChange={setPrice} hint="Revísala en tu recibo de CFE" />
          </div>
        </>
      }
      results={
        <>
          <Result label="Ahorro al año" value={money(savings.yearly)} tone="ok" note={`${money(savings.monthly)} al mes`} />
          <Result label="Reducción de consumo" value={fmt(savings.percent, 0)} unit="%" />
          <Result
            label="Consumo mensual"
            value={fmt(savings.ledKwh)}
            unit="kWh"
            note={`Hoy consumes ${fmt(savings.currentKwh)} kWh con las lámparas actuales`}
          />
        </>
      }
    />
  );
}

function ConduitCalculator() {
  const [groups, setGroups] = useState([{ awg: "12", count: "3" }]);

  const update = (index: number, patch: Partial<{ awg: string; count: string }>) =>
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));

  const result = sizeConduit(groups.map((g) => ({ awg: g.awg, count: Math.floor(num(g.count)) })));
  const summary = groups.map((g) => `${g.count} × ${g.awg} AWG`).join(", ");

  return (
    <Layout
      quoteText={
        result.conduit
          ? `Hola, quiero cotizar tubo conduit de ${result.conduit.size} para ${summary}.`
          : "Hola, necesito ayuda para calcular la tubería de una instalación."
      }
      shopHref="/productos?cat=canalizacion"
      shopLabel="Ver canalización"
      inputs={
        <>
          {groups.map((group, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex-1">
                <AwgSelect label={index === 0 ? "Calibre" : "Otro calibre"} value={group.awg} onChange={(awg) => update(index, { awg })} />
              </div>
              <div className="w-28">
                <NumberField label="Conductores" value={group.count} onChange={(count) => update(index, { count })} />
              </div>
              {groups.length > 1 && (
                <button
                  type="button"
                  onClick={() => setGroups((prev) => prev.filter((_, i) => i !== index))}
                  aria-label="Quitar calibre"
                  className="p-2.5 mb-px text-gray-400 hover:text-brand border border-gray-200 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {groups.length < 4 && (
            <button
              type="button"
              onClick={() => setGroups((prev) => [...prev, { awg: "10", count: "1" }])}
              className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <Plus className="w-4 h-4" />
              Agregar otro calibre
            </button>
          )}
          <p className="text-[11px] text-gray-400">
            Cuenta fases, neutro y tierra. Conductores con aislamiento THW / THHW-LS en tubo conduit pared delgada.
          </p>
        </>
      }
      results={
        result.conduit ? (
          <>
            <Result label="Tubo conduit mínimo" value={result.conduit.size} note={`Designación métrica ${result.conduit.mm}`} />
            <Result label="Ocupación" value={fmt(result.fillPercent, 0)} unit="%" tone="ok" note="Máximo permitido: 40 % con 3 o más conductores" />
            <Result label="Conductores" value={String(result.totalCount)} note={`Área total: ${fmt(result.totalArea)} mm²`} />
          </>
        ) : (
          <p className="text-sm text-gray-300">
            {result.totalCount > 0
              ? "Estos conductores no caben en un tubo de 4\". Divide el circuito en dos canalizaciones o escríbenos."
              : "Agrega al menos un conductor."}
          </p>
        )
      }
    />
  );
}

const panels: Record<ToolId, () => React.ReactNode> = {
  cable: CableCalculator,
  caida: VoltageDropCalculator,
  iluminacion: LightingCalculator,
  ahorro: SavingsCalculator,
  conduit: ConduitCalculator,
};

export default function Calculators() {
  const [active, setActive] = useState<ToolId>("cable");
  const Panel = panels[active];

  return (
    <div>
      <div role="tablist" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-5">
        {tools.map((tool) => {
          const selected = tool.id === active;
          return (
            <button
              key={tool.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tool.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all ${
                selected ? "border-brand bg-brand-50 shadow-sm" : "border-gray-100 bg-white hover:border-brand/30"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${selected ? "bg-brand text-white" : "bg-brand/10 text-brand"}`}>
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-dark">{tool.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{tool.desc}</div>
            </button>
          );
        })}
      </div>
      <Panel />
    </div>
  );
}
