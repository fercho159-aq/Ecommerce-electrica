// Tablas y fórmulas para las calculadoras de /calculadoras.
// Valores de referencia de NOM-001-SEDE-2012 para conductores de cobre a 75 °C.
// Son estimaciones orientativas: no sustituyen el cálculo de un profesional.

export type SystemType = "1F" | "2F" | "3F";

export interface Conductor {
  awg: string;
  /** Ampacidad a 75 °C, hasta 3 conductores en canalización (tabla 310-15(b)(16)). */
  ampacity: number;
  /** Resistencia en corriente alterna a 75 °C, Ω/km (tabla 9). */
  ohmPerKm: number;
  /** Área con aislamiento THW / THHW-LS, mm² (capítulo 10, tabla 5). */
  areaWithInsulation: number;
}

// 14, 12 y 10 AWG usan el límite de protección de 15, 20 y 30 A (240-4(d)).
export const CONDUCTORS: Conductor[] = [
  { awg: "14", ampacity: 15, ohmPerKm: 10.2, areaWithInsulation: 8.97 },
  { awg: "12", ampacity: 20, ohmPerKm: 6.6, areaWithInsulation: 11.68 },
  { awg: "10", ampacity: 30, ohmPerKm: 3.9, areaWithInsulation: 15.68 },
  { awg: "8", ampacity: 50, ohmPerKm: 2.56, areaWithInsulation: 28.19 },
  { awg: "6", ampacity: 65, ohmPerKm: 1.61, areaWithInsulation: 46.84 },
  { awg: "4", ampacity: 85, ohmPerKm: 1.02, areaWithInsulation: 62.77 },
  { awg: "2", ampacity: 115, ohmPerKm: 0.62, areaWithInsulation: 86.0 },
  { awg: "1/0", ampacity: 150, ohmPerKm: 0.39, areaWithInsulation: 143.4 },
  { awg: "2/0", ampacity: 175, ohmPerKm: 0.33, areaWithInsulation: 169.3 },
  { awg: "3/0", ampacity: 200, ohmPerKm: 0.253, areaWithInsulation: 201.1 },
  { awg: "4/0", ampacity: 230, ohmPerKm: 0.203, areaWithInsulation: 239.9 },
];

export const BREAKER_SIZES = [15, 20, 30, 40, 50, 60, 70, 100, 125, 150, 175, 200, 225];

/** Tubo conduit metálico pared delgada: área útil al 40 % de ocupación, mm² (tabla 4). */
export const CONDUITS = [
  { size: '1/2"', mm: 16, area40: 78 },
  { size: '3/4"', mm: 21, area40: 137 },
  { size: '1"', mm: 27, area40: 222 },
  { size: '1 1/4"', mm: 35, area40: 387 },
  { size: '1 1/2"', mm: 41, area40: 526 },
  { size: '2"', mm: 53, area40: 866 },
  { size: '2 1/2"', mm: 63, area40: 1513 },
  { size: '3"', mm: 78, area40: 2280 },
  { size: '4"', mm: 103, area40: 3981 },
];

/** Niveles de iluminación recomendados, lux (referencia NOM-025-STPS). */
export const LIGHT_LEVELS = [
  { id: "pasillo", label: "Pasillos y escaleras", lux: 100 },
  { id: "recamara", label: "Recámara", lux: 150 },
  { id: "sala", label: "Sala / comedor", lux: 200 },
  { id: "bodega", label: "Bodega / almacén", lux: 200 },
  { id: "cocina", label: "Cocina / baño", lux: 300 },
  { id: "oficina", label: "Oficina / aula", lux: 300 },
  { id: "local", label: "Local comercial", lux: 500 },
  { id: "taller", label: "Taller / trabajo de detalle", lux: 500 },
];

export function getConductor(awg: string): Conductor {
  return CONDUCTORS.find((c) => c.awg === awg) ?? CONDUCTORS[0];
}

/** Corriente de la carga en amperes. */
export function loadCurrent(watts: number, volts: number, system: SystemType, powerFactor: number): number {
  if (volts <= 0 || powerFactor <= 0) return 0;
  const divisor = system === "3F" ? Math.sqrt(3) * volts * powerFactor : volts * powerFactor;
  return watts / divisor;
}

/** Caída de tensión en porcentaje para una longitud de ida (m). */
export function voltageDropPercent(
  amps: number, meters: number, volts: number, system: SystemType, conductor: Conductor,
): number {
  if (volts <= 0) return 0;
  const factor = system === "3F" ? Math.sqrt(3) : 2;
  const drop = (factor * amps * (conductor.ohmPerKm / 1000) * meters);
  return (drop / volts) * 100;
}

export interface CableSizing {
  amps: number;
  designAmps: number;
  byAmpacity: Conductor | null;
  recommended: Conductor | null;
  dropPercent: number;
  breaker: number | null;
}

/** Calibre mínimo por ampacidad (carga continua al 125 %) y por caída de tensión. */
export function sizeCable(
  watts: number, volts: number, system: SystemType, powerFactor: number, meters: number, maxDropPercent: number,
): CableSizing {
  const amps = loadCurrent(watts, volts, system, powerFactor);
  const designAmps = amps * 1.25;
  const byAmpacity = CONDUCTORS.find((c) => c.ampacity >= designAmps) ?? null;
  const recommended = CONDUCTORS.find(
    (c) => c.ampacity >= designAmps && voltageDropPercent(amps, meters, volts, system, c) <= maxDropPercent,
  ) ?? null;
  // Interruptor estándar inmediato superior a la corriente de diseño.
  const breaker = recommended ? BREAKER_SIZES.find((b) => b >= designAmps) ?? null : null;
  return {
    amps,
    designAmps,
    byAmpacity,
    recommended,
    dropPercent: recommended ? voltageDropPercent(amps, meters, volts, system, recommended) : 0,
    breaker,
  };
}

/** Tubo conduit más chico que aloja los conductores al 40 % de ocupación. */
export function sizeConduit(groups: { awg: string; count: number }[]) {
  const totalArea = groups.reduce((sum, g) => sum + getConductor(g.awg).areaWithInsulation * g.count, 0);
  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);
  const conduit = CONDUITS.find((c) => c.area40 >= totalArea) ?? null;
  return { totalArea, totalCount, conduit, fillPercent: conduit ? (totalArea / (conduit.area40 / 0.4)) * 100 : 0 };
}

/** Luminarias necesarias por el método de lúmenes. */
export function lightingPlan(areaM2: number, lux: number, lumensPerFixture: number) {
  const utilization = 0.6; // coeficiente de utilización típico, techo y muros claros
  const maintenance = 0.8; // factor de mantenimiento
  const requiredLumens = (areaM2 * lux) / (utilization * maintenance);
  const fixtures = lumensPerFixture > 0 ? Math.ceil(requiredLumens / lumensPerFixture) : 0;
  return { requiredLumens, fixtures };
}

/** Ahorro al sustituir lámparas por LED. */
export function ledSavings(
  currentWatts: number, ledWatts: number, quantity: number, hoursPerDay: number, pricePerKwh: number,
) {
  const kwhMonth = (watts: number) => (watts * quantity * hoursPerDay * 30) / 1000;
  const currentKwh = kwhMonth(currentWatts);
  const ledKwh = kwhMonth(ledWatts);
  const savedKwh = Math.max(0, currentKwh - ledKwh);
  return {
    currentKwh,
    ledKwh,
    savedKwh,
    monthly: savedKwh * pricePerKwh,
    yearly: savedKwh * pricePerKwh * 12,
    percent: currentKwh > 0 ? (savedKwh / currentKwh) * 100 : 0,
  };
}
