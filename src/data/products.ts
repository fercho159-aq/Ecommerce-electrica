export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  featured?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "1", name: "Cables y Conductores", slug: "cables-conductores", description: "Cables THW, THHW, uso rudo, multiconductores y más", icon: "cable", productCount: 8 },
  { id: "2", name: "Iluminación", slug: "iluminacion", description: "LED, paneles, reflectores, luminarias industriales", icon: "lightbulb", productCount: 7 },
  { id: "3", name: "Canalización", slug: "canalizacion", description: "Tubería conduit, charolas, canaletas y ductos", icon: "pipe", productCount: 5 },
  { id: "4", name: "Interruptores y Contactos", slug: "interruptores-contactos", description: "Apagadores, contactos, placas decorativas", icon: "switch", productCount: 6 },
  { id: "5", name: "Tableros y Protección", slug: "tableros-proteccion", description: "Centros de carga, interruptores termomagnéticos, fusibles", icon: "shield", productCount: 7 },
  { id: "6", name: "Herramientas", slug: "herramientas", description: "Pinzas, desarmadores, multímetros, cintas", icon: "wrench", productCount: 7 },
];

export const products: Product[] = [
  // --- CABLES Y CONDUCTORES ---
  {
    id: "p1", name: "Cable de Cobre Desnudo Kobrex", slug: "cable-cobre-desnudo-kobrex",
    description: "Alambre y cable concéntrico de cobre electrolítico 99.9% de pureza. Disponible en temple duro, semiduro y suave. Alta conductividad eléctrica, resistencia a la tracción y fácil de soldar. Ideal para puesta a tierra y líneas aéreas de distribución.",
    price: 1850, comparePrice: 2200, category: "cables-conductores", subcategory: "cobre-desnudo", brand: "Kobrex", sku: "KBX-CU12-100",
    stock: 75, images: ["/productos/cable-3.jpg"], specs: { "Calibre": "12 AWG", "Material": "Cobre electrolítico 99.9%", "Temple": "Suave", "Longitud": "100 m", "Norma": "NOM-063-SCFI", "Aplicación": "Puesta a tierra" }, featured: true
  },
  {
    id: "p2", name: "Cable THW 10 AWG", slug: "cable-thw-10-awg",
    description: "Cable de cobre calibre 10 con aislamiento THW para circuitos de mayor demanda. Perfecto para alimentadores y circuitos de aires acondicionados.",
    price: 1350, category: "cables-conductores", subcategory: "thw", brand: "Condumex", sku: "CDX-THW10-100",
    stock: 85, images: ["/productos/cable-thw-10.jpg"], specs: { "Calibre": "10 AWG", "Material": "Cobre suave", "Aislamiento": "PVC/THW", "Longitud": "100 m", "Color": "Negro", "Norma": "NOM-063-SCFI" }
  },
  {
    id: "p3", name: "Cable Uso Rudo 3x12", slug: "cable-uso-rudo-3x12",
    description: "Cable multiconductor de uso rudo con 3 conductores calibre 12. Resistente a la abrasión, aceites e intemperie. Ideal para alimentar equipos portátiles e industriales.",
    price: 2150, comparePrice: 2450, category: "cables-conductores", subcategory: "uso-rudo", brand: "Latincasa", sku: "LAT-UR3X12-100",
    stock: 42, images: ["/productos/cable-uso-rudo.jpg"], specs: { "Conductores": "3x12 AWG", "Material": "Cobre", "Cubierta": "Neopreno", "Longitud": "100 m", "Voltaje": "600V", "Norma": "NMX-J-010" }, featured: true
  },
  {
    id: "p4", name: "Cable THHW-LS 8 AWG", slug: "cable-thhw-ls-8-awg",
    description: "Cable de cobre con aislamiento THHW-LS, baja emisión de humo y retardante a la flama. Para instalaciones en interiores con altas exigencias de seguridad.",
    price: 2890, category: "cables-conductores", subcategory: "thhw", brand: "Viakon", sku: "VKN-THHW8-100",
    stock: 30, images: ["/productos/cable-thhw-8.jpg"], specs: { "Calibre": "8 AWG", "Material": "Cobre suave", "Aislamiento": "XLPE/THHW-LS", "Longitud": "100 m", "Temp. Max": "90°C" }
  },
  {
    id: "p5", name: "Alambre TF 14 AWG (rollo 100m)", slug: "alambre-tf-14-awg",
    description: "Alambre de cobre con aislamiento TF para instalaciones eléctricas residenciales ligeras. Económico y de fácil manejo para circuitos de iluminación.",
    price: 485, category: "cables-conductores", subcategory: "tf", brand: "Condumex", sku: "CDX-TF14-100",
    stock: 200, images: ["/productos/alambre-tf-14.jpg"], specs: { "Calibre": "14 AWG", "Material": "Cobre", "Aislamiento": "PVC/TF", "Longitud": "100 m" }
  },
  {
    id: "p6", name: "Cable Multiconductor 4x10 AWG", slug: "cable-multiconductor-4x10",
    description: "Cable multiconductor con 4 hilos calibre 10, ideal para acometidas trifásicas y alimentación de motores. Con conductor de tierra incluido.",
    price: 4250, category: "cables-conductores", subcategory: "multiconductor", brand: "Condumex", sku: "CDX-MC4X10-100",
    stock: 18, images: ["/productos/cable-multi-4x10.jpg"], specs: { "Conductores": "4x10 AWG", "Material": "Cobre", "Aislamiento": "THW", "Longitud": "100 m", "Voltaje": "600V" }
  },
  {
    id: "p7", name: "Cable Coaxial RG6", slug: "cable-coaxial-rg6",
    description: "Cable coaxial RG6 con malla de aluminio y conductor de cobre para instalaciones de TV, CCTV y antenas. Impedancia de 75 ohms.",
    price: 680, category: "cables-conductores", subcategory: "coaxial", brand: "Condumex", sku: "CDX-RG6-100",
    stock: 95, images: ["/productos/cable-coaxial.jpg"], specs: { "Tipo": "RG6", "Impedancia": "75 ohms", "Blindaje": "Malla aluminio", "Longitud": "100 m" }
  },
  {
    id: "p8", name: "Cable UTP Cat 6", slug: "cable-utp-cat6",
    description: "Cable UTP categoría 6 para redes de datos de alto rendimiento. Soporta velocidades de hasta 10 Gbps a distancias cortas. Caja de 305 metros.",
    price: 2750, category: "cables-conductores", subcategory: "datos", brand: "Panduit", sku: "PND-UTP6-305",
    stock: 25, images: ["/productos/cable-utp-cat6.jpg"], specs: { "Categoría": "Cat 6", "Velocidad": "10 Gbps", "Longitud": "305 m", "Conductor": "Cobre sólido" }, isNew: true
  },

  // --- ILUMINACIÓN ---
  {
    id: "p9", name: "Panel LED Slim 60x60 40W", slug: "panel-led-slim-60x60",
    description: "Panel LED slim de empotrar y suspender para plafón, luz blanca fría/cálida seleccionable. Diseño ultra delgado para oficinas, comercios y hospitales. Driver integrado, vida útil de 50,000 horas. Disponible en formato cuadrado y rectangular.",
    price: 459, comparePrice: 620, category: "iluminacion", subcategory: "paneles", brand: "Tecnolite", sku: "TEC-PNLSLIM-6060",
    stock: 90, images: ["/productos/iluminacion-3.jpg"], specs: { "Potencia": "40W", "Lumens": "3600 lm", "Temp. Color": "6500K / 3000K", "Medidas": "60x60 cm", "Vida útil": "50,000 hrs", "Montaje": "Empotrar / Suspender" }, featured: true
  },
  {
    id: "p10", name: "Reflector LED 100W", slug: "reflector-led-100w",
    description: "Reflector LED de alta potencia para exteriores, IP65 resistente al agua y polvo. Ideal para estacionamientos, fachadas y áreas industriales.",
    price: 1250, category: "iluminacion", subcategory: "reflectores", brand: "Philips", sku: "PHL-REF100-65",
    stock: 45, images: ["/productos/reflector-led-100w.jpg"], specs: { "Potencia": "100W", "Lumens": "10000 lm", "IP": "IP65", "Temp. Color": "5000K", "Vida útil": "30,000 hrs" }, featured: true
  },
  {
    id: "p11", name: "Foco LED A19 9W (paquete 4)", slug: "foco-led-a19-9w-4pack",
    description: "Paquete de 4 focos LED tipo A19, equivalente a 60W incandescente. Ahorro de hasta 85% en energía. Luz cálida para ambientes residenciales.",
    price: 189, comparePrice: 250, category: "iluminacion", subcategory: "focos", brand: "Philips", sku: "PHL-A19-9W-4P",
    stock: 300, images: ["/productos/foco-led-a19.jpg"], specs: { "Potencia": "9W (equiv. 60W)", "Lumens": "800 lm", "Temp. Color": "3000K", "Base": "E27", "Piezas": "4" }
  },
  {
    id: "p12", name: "Tubo LED T8 18W 120cm", slug: "tubo-led-t8-18w",
    description: "Tubo LED T8 de reemplazo directo para fluorescentes. No requiere balastro, conexión directa. Luz fría para oficinas y naves industriales.",
    price: 95, category: "iluminacion", subcategory: "tubos", brand: "Tecnolite", sku: "TEC-T8-18W-120",
    stock: 250, images: ["/productos/tubo-led-t8.jpg"], specs: { "Potencia": "18W", "Longitud": "120 cm", "Lumens": "1800 lm", "Temp. Color": "6500K", "Base": "G13" }
  },
  {
    id: "p13", name: "Luminaria Suburbana LED 50W", slug: "luminaria-suburbana-50w",
    description: "Luminaria tipo suburbana para alumbrado público y estacionamientos. Cuerpo de aluminio, IP66, ángulo de apertura de 120°.",
    price: 2890, category: "iluminacion", subcategory: "exterior", brand: "Tecnolite", sku: "TEC-SUB50-LED",
    stock: 15, images: ["/productos/luminaria-suburbana.jpg"], specs: { "Potencia": "50W", "Lumens": "6500 lm", "IP": "IP66", "Voltaje": "100-277V" }, isNew: true
  },
  {
    id: "p14", name: "Tira LED 5m RGB con Control", slug: "tira-led-rgb-5m",
    description: "Tira LED RGB de 5 metros con control remoto y fuente de poder incluida. 16 colores, múltiples modos. Ideal para decoración y ambientación.",
    price: 350, category: "iluminacion", subcategory: "decorativa", brand: "Simon", sku: "SMN-TIRA-RGB5",
    stock: 80, images: ["/productos/tira-led-rgb.jpg"], specs: { "Longitud": "5 m", "LEDs/m": "60", "Colores": "16 (RGB)", "Voltaje": "12V DC", "Incluye": "Control + Fuente" }
  },
  {
    id: "p15", name: "Lámpara de Emergencia LED 2x1W", slug: "lampara-emergencia-led",
    description: "Lámpara de emergencia recargable con 2 cabezas LED orientables. Autonomía de 3 horas. Carga automática, indicador LED de estado.",
    price: 285, category: "iluminacion", subcategory: "emergencia", brand: "Tecnolite", sku: "TEC-EMER-2X1",
    stock: 60, images: ["/productos/lampara-emergencia.jpg"], specs: { "Potencia": "2x1W LED", "Autonomía": "3 hrs", "Batería": "Ni-Cd 3.6V", "Montaje": "Pared/Techo" }
  },

  // --- CANALIZACIÓN ---
  {
    id: "p16", name: "Tubo Corrugado Poliflex 3/4\"", slug: "tubo-corrugado-poliflex-34",
    description: "Tubo corrugado flexible Poliflex de polietileno de alta densidad. Ideal para canalización eléctrica en muros y losas. Flexible, ligero y resistente al aplastamiento. Rollo de 50 metros.",
    price: 185, comparePrice: 230, category: "canalizacion", subcategory: "corrugado", brand: "Poliflex", sku: "PLF-CORR34-50M",
    stock: 200, images: ["/productos/tuberia-2.jpg"], specs: { "Diámetro": "3/4\"", "Longitud": "50 m", "Material": "PEAD", "Color": "Negro", "Norma": "NMX-E-013" }, featured: true
  },
  {
    id: "p17", name: "Tubo Conduit Galvanizado 1\" (3m)", slug: "tubo-conduit-galvanizado-1",
    description: "Tubo conduit de acero galvanizado pared gruesa de 1\". Para instalaciones visibles industriales y comerciales. Rosca NPT en ambos extremos.",
    price: 185, category: "canalizacion", subcategory: "conduit-metalico", brand: "Nacional", sku: "NAC-CGAL1-3M",
    stock: 120, images: ["/productos/tubo-conduit-galv.jpg"], specs: { "Diámetro": "1\"", "Longitud": "3 m", "Material": "Acero galvanizado", "Pared": "Gruesa" }
  },
  {
    id: "p18", name: "Canaleta Plástica 20x12mm (2m)", slug: "canaleta-plastica-20x12",
    description: "Canaleta plástica con tapa desmontable para cableado de datos y eléctrico en superficies. Corte fácil, adhesivo incluido.",
    price: 32, category: "canalizacion", subcategory: "canaletas", brand: "Dexson", sku: "DXN-CAN2012-2M",
    stock: 400, images: ["/productos/canaleta-plastica.jpg"], specs: { "Medidas": "20x12 mm", "Longitud": "2 m", "Material": "PVC", "Color": "Blanco" }
  },
  {
    id: "p19", name: "Charola Porta Cable Tipo Escalera 30cm", slug: "charola-porta-cable-escalera",
    description: "Charola portacable tipo escalera de 30cm en acero galvanizado por inmersión en caliente. Para naves industriales, plantas y centros de datos con gran volumen de cables. Alta capacidad de carga y ventilación natural.",
    price: 950, category: "canalizacion", subcategory: "charolas", brand: "Charofil", sku: "CHR-ESC30-3M",
    stock: 25, images: ["/productos/tuberia-3.jpg"], specs: { "Ancho": "30 cm", "Longitud": "3 m", "Material": "Acero galvanizado", "Carga": "50 kg/m", "Acabado": "Galvanizado en caliente" }, featured: true
  },
  {
    id: "p20", name: "Curva Conduit PVC 3/4\"", slug: "curva-conduit-pvc-34",
    description: "Curva preformada de PVC para tubo conduit de 3/4\". Radio estándar, conexión campana. Complemento esencial para canalizaciones.",
    price: 12, category: "canalizacion", subcategory: "accesorios", brand: "Duraline", sku: "DRL-CURV34",
    stock: 800, images: ["/productos/curva-conduit.jpg"], specs: { "Diámetro": "3/4\"", "Material": "PVC", "Radio": "Estándar", "Tipo": "Campana" }
  },

  // --- INTERRUPTORES Y CONTACTOS ---
  {
    id: "p21", name: "Apagador Sencillo Decora Blanco", slug: "apagador-sencillo-decora",
    description: "Apagador de palanca tipo Decora en color blanco. 15A/127V para uso residencial y comercial. Diseño moderno y elegante.",
    price: 65, category: "interruptores-contactos", subcategory: "apagadores", brand: "Leviton", sku: "LEV-APG1-BL",
    stock: 350, images: ["/productos/apagador-decora.jpg"], specs: { "Tipo": "Sencillo", "Corriente": "15A", "Voltaje": "127V", "Color": "Blanco", "Serie": "Decora" }, featured: true
  },
  {
    id: "p22", name: "Contacto Doble Polarizado", slug: "contacto-doble-polarizado",
    description: "Contacto dúplex polarizado con tierra física. 15A/127V. Cumple con NOM-057. Instalación estándar en caja rectangular.",
    price: 42, category: "interruptores-contactos", subcategory: "contactos", brand: "Leviton", sku: "LEV-CNT2-BL",
    stock: 500, images: ["/productos/contacto-doble.jpg"], specs: { "Tipo": "Dúplex", "Corriente": "15A", "Voltaje": "127V", "Tierra": "Sí", "Norma": "NOM-057" }
  },
  {
    id: "p23", name: "Placa Decorativa 2 Ventanas", slug: "placa-decorativa-2-ventanas",
    description: "Placa de nylon para 2 dispositivos tipo Decora. Acabado liso, resistente a rayones y decoloración. Color blanco.",
    price: 28, category: "interruptores-contactos", subcategory: "placas", brand: "Leviton", sku: "LEV-PLC2-BL",
    stock: 600, images: ["/productos/placa-decorativa.jpg"], specs: { "Ventanas": "2", "Material": "Nylon", "Color": "Blanco", "Serie": "Decora" }
  },
  {
    id: "p24", name: "Dimmer Rotativo 600W", slug: "dimmer-rotativo-600w",
    description: "Regulador de intensidad luminosa rotativo para focos incandescentes y dimmables LED. Control suave de iluminación de 0 a 100%.",
    price: 185, category: "interruptores-contactos", subcategory: "dimmers", brand: "Leviton", sku: "LEV-DIM600-BL",
    stock: 45, images: ["/productos/dimmer-rotativo.jpg"], specs: { "Potencia Max": "600W", "Tipo": "Rotativo", "Compatibilidad": "Incandescente/LED dimm", "Voltaje": "127V" }
  },
  {
    id: "p25", name: "Sensor de Movimiento Pared", slug: "sensor-movimiento-pared",
    description: "Sensor de presencia/movimiento para empotrar en pared. Enciende iluminación automáticamente al detectar movimiento. 180° de cobertura.",
    price: 320, category: "interruptores-contactos", subcategory: "sensores", brand: "Leviton", sku: "LEV-SENS180-BL",
    stock: 30, images: ["/productos/sensor-movimiento.jpg"], specs: { "Ángulo": "180°", "Alcance": "6 m", "Carga Max": "500W", "Temporizador": "15s - 30min" }, isNew: true
  },
  {
    id: "p26", name: "Apagador Triple Decora", slug: "apagador-triple-decora",
    description: "Apagador de 3 palancas tipo Decora para controlar 3 circuitos de iluminación desde un solo punto. Color blanco.",
    price: 145, category: "interruptores-contactos", subcategory: "apagadores", brand: "Leviton", sku: "LEV-APG3-BL",
    stock: 80, images: ["/productos/apagador-triple.jpg"], specs: { "Tipo": "Triple", "Corriente": "15A c/u", "Voltaje": "127V", "Color": "Blanco" }
  },

  // --- TABLEROS Y PROTECCIÓN ---
  {
    id: "p27", name: "Centro de Carga QO 8 Polos", slug: "centro-carga-qo-8-polos",
    description: "Centro de carga empotrable QO de 8 polos, monofásico 120/240V. Con puerta y barras de neutro/tierra. Ideal para instalaciones residenciales.",
    price: 1250, comparePrice: 1480, category: "tableros-proteccion", subcategory: "centros-carga", brand: "Schneider Electric", sku: "SE-QO8-EMB",
    stock: 35, images: ["/productos/centro-carga-qo8.jpg"], specs: { "Polos": "8", "Fases": "Monofásico", "Voltaje": "120/240V", "Tipo": "Empotrable", "Bus": "100A" }, featured: true
  },
  {
    id: "p28", name: "Interruptor Termomagnético QO 1P 20A", slug: "interruptor-termomagnetico-1p-20a",
    description: "Pastilla termomagnética QO de 1 polo, 20 amperes. Protección contra sobrecarga y cortocircuito. Compatible con centros de carga QO.",
    price: 185, category: "tableros-proteccion", subcategory: "termomagneticos", brand: "Schneider Electric", sku: "SE-QO1P20",
    stock: 200, images: ["/productos/termomagnetico-1p20.jpg"], specs: { "Polos": "1", "Corriente": "20A", "Voltaje": "120V", "Capacidad Int.": "10 kA", "Serie": "QO" }
  },
  {
    id: "p29", name: "Interruptor Termomagnético 2P 40A", slug: "interruptor-termomagnetico-2p-40a",
    description: "Pastilla termomagnética de 2 polos, 40A para protección de circuitos de 240V como estufas y secadoras. Serie QO.",
    price: 450, category: "tableros-proteccion", subcategory: "termomagneticos", brand: "Schneider Electric", sku: "SE-QO2P40",
    stock: 60, images: ["/productos/termomagnetico-2p40.jpg"], specs: { "Polos": "2", "Corriente": "40A", "Voltaje": "240V", "Capacidad Int.": "10 kA" }
  },
  {
    id: "p30", name: "Interruptor Diferencial (GFCI) 20A", slug: "interruptor-diferencial-gfci-20a",
    description: "Protección contra fallas a tierra (GFCI) de 20A. Obligatorio en baños, cocinas y exteriores según NOM-001. Con botones de prueba y reset.",
    price: 520, category: "tableros-proteccion", subcategory: "diferenciales", brand: "Leviton", sku: "LEV-GFCI20-BL",
    stock: 75, images: ["/productos/gfci-20a.jpg"], specs: { "Corriente": "20A", "Voltaje": "127V", "Sensibilidad": "5mA", "Norma": "NOM-001-SEDE" }, featured: true
  },
  {
    id: "p31", name: "Supresor de Picos Tipo 2", slug: "supresor-picos-tipo-2",
    description: "Dispositivo de protección contra sobretensiones transitorias (SPD) Tipo 2 para tableros de distribución. Protege equipos electrónicos sensibles.",
    price: 1850, category: "tableros-proteccion", subcategory: "supresores", brand: "Schneider Electric", sku: "SE-SPD-T2",
    stock: 20, images: ["/productos/supresor-picos.jpg"], specs: { "Tipo": "2", "Voltaje": "120/240V", "Capacidad": "40 kA", "Modos": "L-N, L-G, N-G" }, isNew: true
  },
  {
    id: "p32", name: "Fusible tipo NH 100A", slug: "fusible-nh-100a",
    description: "Fusible de cuchillas tipo NH tamaño 00 de 100A para protección de transformadores y alimentadores industriales.",
    price: 280, category: "tableros-proteccion", subcategory: "fusibles", brand: "ABB", sku: "ABB-NH00-100",
    stock: 40, images: ["/productos/fusible-nh.jpg"], specs: { "Corriente": "100A", "Tamaño": "NH-00", "Voltaje": "500V AC", "Capacidad Int.": "120 kA" }
  },
  {
    id: "p33", name: "Contactor 3P 25A 220V", slug: "contactor-3p-25a",
    description: "Contactor tripolar de 25A con bobina de 220V AC. Para control de motores, iluminación y cargas resistivas en instalaciones industriales.",
    price: 750, category: "tableros-proteccion", subcategory: "contactores", brand: "Schneider Electric", sku: "SE-LC1D25-M7",
    stock: 22, images: ["/productos/contactor-3p.jpg"], specs: { "Polos": "3", "Corriente": "25A", "Bobina": "220V AC", "Aux": "1NA + 1NC" }
  },

  // --- HERRAMIENTAS ---
  {
    id: "p34", name: "Pinza Electricista 9\"", slug: "pinza-electricista-9",
    description: "Pinza de electricista profesional de 9\" con mango aislado a 1000V. Corte lateral integrado, agarre antideslizante. Acero al cromo vanadio.",
    price: 285, category: "herramientas", subcategory: "pinzas", brand: "Klein Tools", sku: "KLN-D2000-9",
    stock: 55, images: ["/productos/pinza-electricista.jpg"], specs: { "Longitud": "9\"", "Aislamiento": "1000V", "Material": "Cr-V", "Mango": "Bimaterial" }, featured: true
  },
  {
    id: "p35", name: "Multímetro Digital Profesional", slug: "multimetro-digital-profesional",
    description: "Multímetro digital con rango automático, mide voltaje AC/DC, corriente, resistencia, continuidad y temperatura. Display retroiluminado.",
    price: 650, comparePrice: 799, category: "herramientas", subcategory: "medicion", brand: "Klein Tools", sku: "KLN-MM700",
    stock: 30, images: ["/productos/multimetro-digital.jpg"], specs: { "Display": "6000 cuentas", "CAT": "CAT IV 600V", "Funciones": "V/A/Ω/°C/Hz", "Rango": "Automático" }, featured: true
  },
  {
    id: "p36", name: "Juego Desarmadores Aislados 7pz", slug: "juego-desarmadores-aislados-7pz",
    description: "Set de 7 desarmadores con aislamiento VDE a 1000V. Incluye planos y cruz en varias medidas. Estuche de transporte incluido.",
    price: 890, category: "herramientas", subcategory: "desarmadores", brand: "Klein Tools", sku: "KLN-85076",
    stock: 25, images: ["/productos/desarmadores-aislados.jpg"], specs: { "Piezas": "7", "Aislamiento": "1000V VDE", "Tipos": "Plano + Phillips", "Incluye": "Estuche" }
  },
  {
    id: "p37", name: "Cinta de Aislar 3M Super 33+", slug: "cinta-aislar-3m-super33",
    description: "Cinta de aislar premium de vinilo, resistente a UV, humedad y abrasión. Estirable hasta 2x su longitud. Rollo de 19mm x 20m.",
    price: 85, category: "herramientas", subcategory: "cintas", brand: "3M", sku: "3M-S33-20M",
    stock: 400, images: ["/productos/cinta-3m-33.jpg"], specs: { "Ancho": "19 mm", "Largo": "20 m", "Voltaje": "600V", "Temp.": "-18°C a 105°C" }
  },
  {
    id: "p38", name: "Pelacables Automático 10-24 AWG", slug: "pelacables-automatico",
    description: "Pelacables automático de acción por presión. Ajuste automático al calibre del cable de 10 a 24 AWG. Corte y pelado en un solo movimiento.",
    price: 420, category: "herramientas", subcategory: "pelacables", brand: "Klein Tools", sku: "KLN-11063W",
    stock: 40, images: ["/productos/pelacables-auto.jpg"], specs: { "Rango": "10-24 AWG", "Tipo": "Automático", "Material": "Acero", "Mango": "Ergonómico" }
  },
  {
    id: "p39", name: "Guía Pasa Cable 15m", slug: "guia-pasa-cable-15m",
    description: "Guía (cinta pasa cables) de nylon de 15 metros para introducir cables en tubería conduit. Punta flexible, carrete portátil.",
    price: 350, category: "herramientas", subcategory: "accesorios", brand: "Truper", sku: "TRP-GUIA15",
    stock: 35, images: ["/productos/guia-pasa-cable.jpg"], specs: { "Longitud": "15 m", "Material": "Nylon", "Diámetro": "4 mm", "Incluye": "Carrete" }
  },
  {
    id: "p40", name: "Detector de Voltaje sin Contacto", slug: "detector-voltaje-sin-contacto",
    description: "Probador de voltaje sin contacto con indicador LED y sonoro. Detecta de 12V a 1000V AC. Esencial para verificar ausencia de tensión antes de trabajar.",
    price: 195, category: "herramientas", subcategory: "medicion", brand: "Klein Tools", sku: "KLN-NCVT1P",
    stock: 70, images: ["/productos/detector-voltaje.jpg"], specs: { "Rango": "12-1000V AC", "Indicador": "LED + Sonoro", "Batería": "2x AAA", "CAT": "CAT IV" }, isNew: true
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q)
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
}
