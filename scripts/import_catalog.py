#!/usr/bin/env python3
"""Genera src/data/catalog.generated.json a partir de los Excel de proveedores.

Uso:
    python3 scripts/import_catalog.py \
        --tecnolite-full "2 ARCHIVO INFORMACION TECNICA (COMPLETA).xlsx" \
        --tecnolite-top "Informacion_Tecnica_Top_Productos_2026-09.xlsx" \
        --simon "catalogo_simon_semaforo_automatico.xlsx" \
        [--probe-images]

Los Excel no traen precio ni stock: todos los productos salen con
quoteOnly=true (botón "Cotizar"). Cuando llegue la lista de precios se
agrega aquí y se quita la bandera.

--probe-images busca en el bucket de imágenes de Tecnolite los SKUs que no
traen URL en el Excel y guarda el resultado en scripts/tecnolite-images.json
para que las siguientes corridas no necesiten red.
"""
import argparse
import json
import re
import sys
import unicodedata
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "catalog.generated.json"
IMAGE_CACHE = Path(__file__).resolve().parent / "tecnolite-images.json"
# Fotos elegidas a mano con scrape_images.py para productos sin imagen de proveedor.
IMAGE_OVERRIDES = Path(__file__).resolve().parent / "image-overrides.json"
# PNG con fondo transparente generados por remove_backgrounds.py; tienen prioridad.
PNG_DIR = ROOT / "public" / "productos" / "catalogo"

TECNOLITE_BUCKET = "https://tecnolite-product-images-167346965656.s3.us-east-1.amazonaws.com"
TECNOLITE_IMAGE_SUFFIXES = [
    "-MAIN.jpg", "-PT02.jpg-Tecno1200Wx1200H", "-PT01.jpg", "-MAIN.jpg-Tecno1200Wx1200H",
    "-PT01.jpg-Tecno1200Wx1200H", "-NVO-MAIN.jpg-Tecno1200Wx1200H", "-NVO-PT02.jpg-Tecno1200Wx1200H",
    "-PT02.jpg", "-PT02.JPG-Tecno1200Wx1200H", "-PT03.jpg-Tecno1200Wx1200H", "-PT03.jpg",
]
SIMON_IMAGE_HOSTS = ("https://cdn.pimber.ly/",)

EMPTY = {"", "na", "n/a", "none", "por definir", "no definido", "sn", "no aplica", "-"}


# ---------------------------------------------------------------- helpers

def clean(value):
    """Celda -> texto limpio, o '' si es un valor de relleno."""
    if value is None:
        return ""
    if isinstance(value, float):
        value = int(value) if value.is_integer() else round(value, 4)
    text = str(value).strip()
    if "Ã" in text:
        try:
            text = text.encode("latin-1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    text = re.sub(r"\s+", " ", text)
    return "" if text.lower() in EMPTY else text


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def read_sheet(path, sheet=None):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[sheet] if sheet else wb.worksheets[0]
    rows = ws.iter_rows(values_only=True)
    header = [clean(h) for h in next(rows)]
    out = []
    for row in rows:
        record = {h: clean(v) for h, v in zip(header, row) if h}
        if any(record.values()):
            out.append(record)
    return out


def with_unit(value, unit):
    if not value:
        return ""
    return value if re.search(r"[a-zA-Z°%]", value) else f"{value} {unit}"


def thousands(value):
    """'3 000 K' -> '3000 K', '30 000' -> '30000'."""
    return re.sub(r"(?<=\d) (?=\d{3}\b)", "", value)


def title_case(text):
    """BUCARAMANGA VII -> Bucaramanga VII (respeta números romanos)."""
    words = []
    for word in text.split():
        if re.fullmatch(r"[IVX]+", word):
            words.append(word)
        else:
            words.append(word.capitalize())
    return " ".join(words)


def add_spec(specs, key, value):
    if value and key not in specs:
        specs[key] = value


# -------------------------------------------------------------- tecnolite

FULL_TYPE = {
    "LAMPARAS DE LED": "Foco LED",
    "LAMPARAS TUBO DE LED": "Tubo LED",
    "LAMPARA FLUORESCENTE": "Lámpara fluorescente",
    "TRANSFORMADOR": "Transformador",
    "ACCESORIOS LINEALES INTERCONECTABLES SLIM": "Accesorio para luminario lineal",
    "DISPOSITIVO PARA USO INTERIOR": "Dispositivo para interior",
}

SUBSUB_TYPE = {
    "EMPOTRADOS LED": "Luminario empotrado LED",
    "EMPOTRADOS SIN LAMPARA": "Luminario empotrado",
    "EMPOTRADOS PISO LED": "Luminario empotrado en piso LED",
    "PLAFONES LED": "Plafón LED",
    "PLAFON LED": "Plafón LED",
    "MUROS LED": "Luminario de muro LED",
    "MUROS SIN LAMPARA": "Luminario de muro",
    "PARED": "Luminario de pared",
    "PARED LED": "Luminario de pared LED",
    "SPOT SOBREPONER LED": "Spot de sobreponer LED",
    "SPOT SOBREPONER": "Spot de sobreponer",
    "SPOT RIEL LED": "Spot para riel LED",
    "SPOT RIEL": "Spot para riel",
    "SPOT RIEL ACCESORIOS": "Accesorio para riel",
    "SUSPENDIDOS LED": "Luminario suspendido LED",
    "SUSPENDIDOS": "Luminario suspendido",
    "SOBREPONER - SUSPENDER": "Luminario de sobreponer / suspender",
    "SOBREPONER": "Luminario de sobreponer",
    "SOBREPONER LED": "Luminario de sobreponer LED",
    "REFLECTORES LED": "Reflector LED",
    "REFLECTORES": "Reflector",
    "LUZ DE CORTESIA LED": "Luz de cortesía LED",
    "LINEALES LED": "Luminario lineal LED",
    "MINI POSTES LED": "Mini poste LED",
}

TOP_FAMILY_GROUP = {
    "Reflector LED": "iluminacion-exterior",
    "Reflector": "iluminacion-exterior",
    "Lámpara con Estaca": "iluminacion-exterior",
    "Lámpara Empotrada en Piso": "iluminacion-exterior",
    "Punta de Poste": "iluminacion-exterior",
    "Poste de Luz": "iluminacion-exterior",
}


def tecnolite_brand(raw):
    return "Construlita" if "construlita" in raw.lower() else "Tecnolite"


def single_cct(value):
    """Temperatura de color para el nombre, solo si es un valor único."""
    value = thousands(value)
    match = re.fullmatch(r"(\d{4})(?: ?K)?", value)
    return f"{match.group(1)} K" if match else ""


def tecnolite_type(top, full):
    family = top.get("Familia", "")
    use = full.get("INTERIOR / EXTERIOR / LAMPARAS", "").upper()
    if use in FULL_TYPE:
        base = full.get("TIPO DE BASE", "") or top.get("Tipo de rosca", "")
        kind = FULL_TYPE[use]
        if kind in ("Foco LED", "Tubo LED") and base and "LED" not in base.upper():
            return f"{kind} base {base}"
        return kind
    if family.startswith("Base "):
        return f"Foco LED {family[0].lower()}{family[1:]}"
    if family:
        return family
    subsub = full.get("Subsubfamilia", "").upper()
    if subsub in SUBSUB_TYPE:
        return SUBSUB_TYPE[subsub]
    if "EXTERIOR" in use and "INTERIOR" not in use:
        return "Luminario de exterior"
    return "Luminario de interior"


def tecnolite_group(top, full):
    use = full.get("INTERIOR / EXTERIOR / LAMPARAS", "").upper()
    family = top.get("Familia", "")
    if use.startswith("LAMPARA") or family.startswith("Base "):
        return "focos-y-lamparas"
    if family in TOP_FAMILY_GROUP:
        return TOP_FAMILY_GROUP[family]
    if "EXTERIOR" in use and "INTERIOR" not in use:
        return "iluminacion-exterior"
    return "iluminacion-interior"


def tecnolite_specs(top, full):
    specs = {}
    power = top.get("Potencia") or with_unit(full.get("POTENCIA", ""), "W")
    add_spec(specs, "Potencia", power)
    add_spec(specs, "Equivalencia incandescente",
             top.get("Comparación con incandescente") or with_unit(full.get("Tabla comparativa vs Incandescente", ""), "W"))
    cct = top.get("Temperatura de Color") or full.get("TEMPERATURA DE COLOR", "")
    add_spec(specs, "Temperatura de color", with_unit(thousands(cct), "K") if re.fullmatch(r"[\d ]+", cct) else thousands(cct))
    add_spec(specs, "Color de luz", top.get("Color de luz") or full.get("Color de Luz", ""))
    add_spec(specs, "Flujo luminoso", top.get("Flujo luminoso") or with_unit(thousands(full.get("FLUJO LUMINOSO", "")), "lm"))
    add_spec(specs, "IRC", top.get("IRC") or full.get("IRC", ""))

    voltage = top.get("Voltaje", "")
    if not voltage and full.get("Voltaje menor"):
        low, high = full["Voltaje menor"], full.get("voltaje mayor", "")
        unit = full.get("Voltaje UM", "") or "V"
        voltage = f"{low} - {high} {unit}" if high and high != low else f"{low} {unit}"
    add_spec(specs, "Voltaje", voltage)
    add_spec(specs, "Corriente", top.get("Corriente") or with_unit(full.get("Amperes Máximo", ""), "A"))
    add_spec(specs, "Factor de potencia", top.get("Factor de potencia") or full.get("FACTOR DE POTENCIA", ""))
    add_spec(specs, "Vida útil", top.get("Tiempo de vida") or with_unit(thousands(full.get("TIEMPO DE VIDA (hr)", "")), "h"))
    angle = top.get("Ángulo de dispersión") or full.get("ANGULO DE DISPERSION", "")
    add_spec(specs, "Ángulo de apertura", f"{angle}°" if re.fullmatch(r"[\d.]+", angle) else angle)
    dimmable = (top.get("Atenuable / Dimerizable") or full.get("DIMEABLE", "")).upper()
    add_spec(specs, "Atenuable", {"SI": "Sí", "SÍ": "Sí", "NO": "No"}.get(dimmable, ""))
    add_spec(specs, "Tecnología", top.get("Tecnología") or full.get("TECNOLOGIA", ""))
    add_spec(specs, "Base / rosca", top.get("Tipo de rosca") or full.get("TIPO DE BASE", ""))
    add_spec(specs, "Lámpara", top.get("Emplea Num y modelo de lámparas") or full.get("TIPO DE LAMPARA", ""))

    dims = top.get("Dimensiones del producto", "")
    if not dims:
        parts = [full.get(k, "") for k in ("Largo del producto () mm", "Ancho del producto () mm", "Alto del producto () mm")]
        if all(re.fullmatch(r"[\d.]+", p) for p in parts):
            dims = " x ".join(parts) + " mm"
    add_spec(specs, "Dimensiones", dims if re.match(r"\d", dims) else "")
    add_spec(specs, "Corte de empotramiento",
             top.get("Corte de empotramiento") or (with_unit(full.get("CORTE DE EMPOTRAMIENTO", ""), "mm")
                                                    if re.fullmatch(r"[\d.]+", full.get("CORTE DE EMPOTRAMIENTO", "")) else ""))
    weight = top.get("Peso del producto") or full.get("Peso KG", "")
    add_spec(specs, "Peso", with_unit(weight, "kg") if weight not in ("", "0") else "")
    add_spec(specs, "Material", top.get("Material") or full.get("MATERIAL DE LA CARCAZA/CANOPE", ""))
    add_spec(specs, "Difusor", full.get("DIFUSOR/PANTALLA", ""))
    add_spec(specs, "Acabado", top.get("Terminado") or full.get("TERMINADO DEL PRODUCTO", ""))
    add_spec(specs, "Montaje", top.get("Montaje") or full.get("MONTAJE", ""))
    add_spec(specs, "Aplicación", top.get("Aplicación") or full.get("APLICACIÓN", ""))
    ip = top.get("IP") or full.get("IP", "")
    add_spec(specs, "Grado IP", f"IP{ip}" if re.fullmatch(r"\d{2}", ip) else "")
    ik = top.get("IK") or full.get("IK", "")
    add_spec(specs, "Grado IK", f"IK{int(ik):02d}" if re.fullmatch(r"\d{1,2}", ik) else "")
    warranty = top.get("Garantía", "")
    if not warranty and re.fullmatch(r"\d+", full.get("GARANTIA TECNOLITE (AÑOS)", "")):
        years = int(full["GARANTIA TECNOLITE (AÑOS)"])
        warranty = f"{years} año" if years == 1 else f"{years} años"
    add_spec(specs, "Garantía", warranty)
    add_spec(specs, "Temperatura de operación", top.get("Temperatura de operación", ""))
    add_spec(specs, "Código de barras", full.get("CODIGO DE BARRAS COLOR", ""))
    raw_brand = full.get("MARCA", "")
    if "connect" in raw_brand.lower():
        add_spec(specs, "Línea", "Tecnolite Connect")
    add_spec(specs, "Notas", top.get("Leyenda para ficha") or full.get("LEYENDA PARA FICHA TECNICA", "").strip('"'))
    return specs


def tecnolite_description(kind, commercial, brand, specs):
    head = f"{kind} {commercial}".strip() + f" de {brand}."
    light = []
    if specs.get("Potencia"):
        light.append(f"potencia de {specs['Potencia']}")
    if specs.get("Color de luz"):
        tone = specs["Color de luz"][0].lower() + specs["Color de luz"][1:]
        light.append(f"{tone} ({specs['Temperatura de color']})" if specs.get("Temperatura de color") else tone)
    if specs.get("Flujo luminoso"):
        light.append(f"flujo luminoso de {specs['Flujo luminoso']}")
    body = []
    if light:
        sentence = ", ".join(light) + "."
        body.append(sentence[0].upper() + sentence[1:])
    build = []
    if specs.get("Montaje"):
        build.append(f"montaje {specs['Montaje'].lower()}")
    if specs.get("Acabado"):
        build.append(f"acabado {specs['Acabado'].lower()}")
    if specs.get("Grado IP"):
        build.append(f"protección {specs['Grado IP']}")
    if build:
        sentence = ", ".join(build) + "."
        body.append(sentence[0].upper() + sentence[1:])
    if specs.get("Garantía"):
        body.append(f"Garantía de {specs['Garantía']}.")
    return " ".join([head] + body)


def tecnolite_image_candidates(sku):
    folder, name = sku.replace("/", "_"), sku.replace("/", "-")
    return [f"{TECNOLITE_BUCKET}/products/{folder}/{name}{suffix}" for suffix in TECNOLITE_IMAGE_SUFFIXES]


def url_exists(url):
    request = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return response.status == 200
    except (urllib.error.URLError, TimeoutError):
        return False


def probe_tecnolite_images(skus, cache):
    def probe(sku):
        for url in tecnolite_image_candidates(sku):
            if url_exists(url):
                return sku, url
        return sku, ""

    pending = [s for s in skus if s not in cache]
    with ThreadPoolExecutor(max_workers=16) as pool:
        for sku, url in pool.map(probe, pending):
            cache[sku] = url
    IMAGE_CACHE.write_text(json.dumps(cache, indent=1, sort_keys=True, ensure_ascii=False) + "\n")


def build_tecnolite(full_path, top_path, probe):
    full_rows, top_rows = read_sheet(full_path), read_sheet(top_path)
    full_by_sku, top_by_sku, order = {}, {}, []
    for row in top_rows:
        sku = row.get("SKU / Modelo", "")
        if sku and sku not in top_by_sku:
            top_by_sku[sku] = row
            order.append(sku)
    for row in full_rows:
        sku = row.get("TL Producto", "")
        if sku and sku not in full_by_sku:
            full_by_sku[sku] = row
            if sku not in top_by_sku:
                order.append(sku)

    cache = json.loads(IMAGE_CACHE.read_text()) if IMAGE_CACHE.exists() else {}
    if probe:
        probe_tecnolite_images([s for s in order if not top_by_sku.get(s, {}).get("Imagen (URL S3)")], cache)

    products, skipped = [], []
    for sku in order:
        top, full = top_by_sku.get(sku, {}), full_by_sku.get(sku, {})
        specs = tecnolite_specs(top, full)
        if len(specs) < 3:
            skipped.append(sku)
            continue
        brand = tecnolite_brand(full.get("MARCA", "") or top.get("Marca", ""))
        kind = tecnolite_type(top, full)
        commercial = top.get("Nombre comercial") or full.get("NOMBRE COMERCIAL", "")
        commercial = "" if commercial == sku else title_case(commercial)
        finish = specs.get("Acabado", "")
        name_parts = [kind, commercial, specs.get("Potencia", ""), single_cct(specs.get("Temperatura de color", "")),
                      finish if len(finish) <= 18 else ""]
        name = " ".join(p for p in name_parts if p)
        image = top.get("Imagen (URL S3)") or cache.get(sku, "")
        products.append({
            "id": f"tl-{slugify(sku)}",
            "name": name,
            "slug": f"{slugify(name)[:70].strip('-')}-{slugify(sku)}",
            "description": tecnolite_description(kind, commercial, brand, specs),
            "price": 0,
            "category": "iluminacion",
            "subcategory": tecnolite_group(top, full),
            "brand": brand,
            "sku": sku,
            "stock": 0,
            "images": [image] if image else [],
            "specs": specs,
            "quoteOnly": True,
        })
    return products, skipped


# ------------------------------------------------------------------ simon

# Frases de trabajo interno que no deben salir en la tienda.
SIMON_INTERNAL = re.compile(r"ESM|descripci[oó]n del sistema|pendiente de validar", re.IGNORECASE)


# "Interruptor 3 Vias" llega mal interpretado en el Excel como "Voltaje: 3V".
SIMON_BOGUS_VOLTAGE = re.compile(r";? ?Voltaje: \dV(?=[;.])")


def simon_description(text):
    sentences = re.split(r"(?<=\.)\s+", SIMON_BOGUS_VOLTAGE.sub("", text))
    return " ".join(s for s in sentences if not SIMON_INTERNAL.search(s)).strip()


def build_simon(path):
    rows = read_sheet(path, "SIMON")
    seen, unique = set(), []
    for row in rows:
        model = row.get("modelo", "")
        if model and model not in seen:
            seen.add(model)
            unique.append(row)

    # Variantes: mismo producto en distinto color. Solo se agrupan si cada
    # miembro tiene una etiqueta distinta.
    groups = {}
    for row in unique:
        if row.get("familia_variantes") and row.get("familia_nombre"):
            groups.setdefault((row["familia_variantes"], row["familia_nombre"]), []).append(row)
    variant_of = {}
    for (family, family_name), members in groups.items():
        labels = [m.get("valor_variante_1") or m.get("color_acabado", "") for m in members]
        if len(members) > 1 and all(labels) and len(set(labels)) == len(labels):
            for member, label in zip(members, labels):
                variant_of[member["modelo"]] = (f"simon-{slugify(family)}-{slugify(family_name)}", label)

    products = []
    for row in unique:
        model, name = row["modelo"], row.get("nombre_web") or row.get("descripcion_sistema", "")
        specs = {}
        add_spec(specs, "Línea", row.get("linea", ""))
        mechanism = row.get("mecanismo", "")
        add_spec(specs, "Tipo", "" if mechanism == "Revisar" else mechanism)
        add_spec(specs, "Color / acabado", row.get("color_acabado", ""))
        add_spec(specs, "Módulos", row.get("no_modulos", ""))
        add_spec(specs, "Incluye placa", row.get("incluye_placa", ""))
        add_spec(specs, "Material", row.get("material_general", ""))
        dims = [row.get(k, "") for k in ("largo_cm", "ancho_cm", "alto_cm")]
        if all(dims):
            add_spec(specs, "Dimensiones", " x ".join(dims) + " cm")
        add_spec(specs, "Peso", with_unit(row.get("peso_kg", ""), "kg"))
        add_spec(specs, "Empaque de fábrica", row.get("embalaje_fabricante", ""))
        add_spec(specs, "Unidad de venta", row.get("unidad_venta", "").capitalize())
        image = row.get("url_imagen_oficial", "")
        product = {
            "id": f"sm-{slugify(model)}",
            "name": name,
            "slug": f"{slugify(name)[:70].strip('-')}-{slugify(model)}",
            "description": simon_description(row.get("descripcion_web", "")) or f"{name}.",
            "price": 0,
            "category": "interruptores-contactos",
            "subcategory": slugify(row.get("linea", "") or "simon"),
            "brand": "Simon",
            "sku": model,
            "stock": 0,
            "images": [image] if image.startswith(SIMON_IMAGE_HOSTS) else [],
            "specs": specs,
            "quoteOnly": True,
        }
        if model in variant_of:
            product["variantGroup"], product["variantLabel"] = variant_of[model]
        products.append(product)
    return products, len(rows) - len(unique)


# ------------------------------------------------------------------- main

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--tecnolite-full", required=True)
    parser.add_argument("--tecnolite-top", required=True)
    parser.add_argument("--simon", required=True)
    parser.add_argument("--probe-images", action="store_true")
    args = parser.parse_args()

    tecnolite, skipped = build_tecnolite(args.tecnolite_full, args.tecnolite_top, args.probe_images)
    simon, simon_dupes = build_simon(args.simon)
    products = simon + tecnolite

    overrides = json.loads(IMAGE_OVERRIDES.read_text()) if IMAGE_OVERRIDES.exists() else {}
    for product in products:
        if not product["images"] and product["id"] in overrides:
            product["images"] = [overrides[product["id"]]["image"]]
        if (PNG_DIR / f"{product['id']}.png").exists():
            product["images"] = [f"/productos/catalogo/{product['id']}.png"]

    slugs = [p["slug"] for p in products]
    if len(set(slugs)) != len(slugs):
        sys.exit("slugs duplicados: " + ", ".join(sorted({s for s in slugs if slugs.count(s) > 1})))

    OUT.write_text(json.dumps(products, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"Simon:     {len(simon)} productos ({simon_dupes} filas duplicadas omitidas), "
          f"{sum(1 for p in simon if p['images'])} con imagen, "
          f"{sum(1 for p in simon if 'variantGroup' in p)} en grupos de variantes")
    print(f"Tecnolite: {len(tecnolite)} productos, {sum(1 for p in tecnolite if p['images'])} con imagen")
    if skipped:
        print(f"Omitidos por no traer datos ({len(skipped)}): {', '.join(skipped)}")
    print(f"-> {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
