#!/usr/bin/env python3
"""Busca fotos para los productos que no tienen imagen.

Flujo en dos pasos, con revisión manual en medio:

    # 1. Descarga candidatas y arma hojas de contacto para revisarlas
    python3 scripts/scrape_images.py collect --out /ruta/candidatas

    # 2. Se revisan /ruta/candidatas/sheets/*.jpg y se anota la elegida de
    #    cada producto en scripts/image-selection.json ({"id": número} o null)

    # 3. Copia las elegidas a public/productos/catalogo/ y las registra
    python3 scripts/scrape_images.py apply --out /ruta/candidatas

Fuentes, en orden de confianza:
  - tecnolite: API de la tienda oficial (coincidencia exacta de SKU)
  - simon:     buscador del sitio oficial (imagen con el modelo en el nombre)
  - web:       búsqueda de imágenes (distribuidores; requiere revisión)

Después de `apply`, volver a correr import_catalog.py para que el catálogo
tome scripts/image-overrides.json.
"""
import argparse
import html
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "src" / "data" / "catalog.generated.json"
PRODUCTS_TS = ROOT / "src" / "data" / "products.ts"
SELECTION = Path(__file__).resolve().parent / "image-selection.json"
OVERRIDES = Path(__file__).resolve().parent / "image-overrides.json"
PUBLIC_DIR = ROOT / "public" / "productos" / "catalogo"

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
MAX_BYTES = 8 * 1024 * 1024
WEB_CANDIDATES = 6
THUMB = 210


def fetch(url, accept="*/*", timeout=25):
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read(MAX_BYTES + 1)


def norm(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())


# ---------------------------------------------------------------- targets

DEMO_PRODUCT = re.compile(
    r'id: "(p\d+)", name: "((?:[^"\\]|\\.)+)", slug: "([^"]+)",.*?brand: "([^"]+)", sku: "([^"]+)",.*?images: \[\]',
    re.DOTALL,
)


def load_targets():
    targets = []
    for product in json.loads(CATALOG.read_text()):
        if not product["images"]:
            targets.append({k: product[k] for k in ("id", "name", "brand", "sku")} | {"demo": False})
    # Productos demo de products.ts: cada uno ocupa un bloque `{ ... },`
    for block in re.split(r"\n  \{\n", PRODUCTS_TS.read_text()):
        match = DEMO_PRODUCT.search(block)
        if match:
            pid, name, _slug, brand, sku = match.groups()
            targets.append({"id": pid, "name": name.replace('\\"', '"'), "brand": brand, "sku": sku, "demo": True})
    return targets


# ---------------------------------------------------------------- sources

def tecnolite_official(target):
    code = urllib.parse.quote(target["sku"], safe="")
    url = f"https://api-p1.tecnolite.mx/occ/v2/tecnoliteb2c/products/{code}?fields=code,images(FULL)"
    try:
        data = json.loads(fetch(url, "application/json"))
    except (urllib.error.URLError, TimeoutError, ValueError):
        return []
    images = [i for i in data.get("images", []) if i.get("format") == "superZoom" and i.get("url")]
    images.sort(key=lambda i: i.get("imageType") != "PRIMARY")
    seen, out = set(), []
    for image in images:
        full = urllib.parse.urljoin("https://api-p1.tecnolite.mx/", image["url"])
        if full not in seen:
            seen.add(full)
            out.append(full)
    return out[:3]


def simon_official(target):
    url = "https://www.simonelectric.com/es-mx/search?q=" + urllib.parse.quote(target["sku"])
    try:
        page = fetch(url, "text/html").decode("utf-8", "replace")
    except (urllib.error.URLError, TimeoutError):
        return []
    # La página del producto trae la foto en tamaño completo; el buscador solo miniaturas.
    link = re.search(r'href="(/es-mx/%s-[^"]+)"' % re.escape(target["sku"].lower()), page)
    if link:
        try:
            page = fetch("https://www.simonelectric.com" + link.group(1), "text/html").decode("utf-8", "replace") + page
        except (urllib.error.URLError, TimeoutError):
            pass
    found = re.findall(r'https://cdn\.pimber\.ly/[^"&; \\]+', page)
    wanted = norm(target["sku"])
    return list(dict.fromkeys(u for u in found if wanted in norm(u.rsplit("/", 1)[-1])))[:4]


def web_search(target):
    query = f'{target["brand"]} {target["name"]}' if target["demo"] else f'{target["brand"]} {target["sku"]}'
    url = "https://www.bing.com/images/search?form=HDRSC2&q=" + urllib.parse.quote(query)
    try:
        page = fetch(url, "text/html").decode("utf-8", "replace")
    except (urllib.error.URLError, TimeoutError):
        return []
    urls = [html.unescape(u) for u in re.findall(r"murl&quot;:&quot;(.*?)&quot;", page)]
    return list(dict.fromkeys(urls))[:WEB_CANDIDATES]


def gather(target):
    candidates = []
    if target["brand"] == "Tecnolite":
        candidates += [("tecnolite", u) for u in tecnolite_official(target)]
    if target["brand"] == "Simon" and not target["demo"]:
        candidates += [("simon", u) for u in simon_official(target)]
    candidates += [("web", u) for u in web_search(target)]
    return candidates


# ---------------------------------------------------------------- collect

def download_image(url):
    try:
        raw = fetch(urllib.parse.quote(url, safe=":/?&=%#+,;@~!$'()*[]"), "image/avif,image/webp,image/*,*/*")
    except Exception:  # URLs de terceros: cualquier falla descarta la candidata
        return None
    if len(raw) > MAX_BYTES:
        return None
    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except Exception:  # Pillow lanza errores variados con archivos corruptos
        return None
    if min(image.size) < 200:
        return None
    # Fondo blanco para PNG/WebP con transparencia
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGBA")
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.split()[-1])
        image = background
    return image.convert("RGB")


def collect(out_dir, only=None):
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    targets = [t for t in load_targets() if not only or t["id"] in only]
    for number, target in enumerate(targets, 1):
        if target["id"] in manifest:
            continue
        folder = out_dir / target["id"]
        folder.mkdir(exist_ok=True)
        entries = []
        for source, url in gather(target):
            image = download_image(url)
            if image is None:
                continue
            original = image.size
            image.thumbnail((1000, 1000))
            name = f"{len(entries) + 1}.jpg"
            image.save(folder / name, "JPEG", quality=88)
            entries.append({
                "file": name, "source": source, "url": url,
                "host": urllib.parse.urlparse(url).netloc,
                "size": list(original),
                "sku_in_url": norm(target["sku"]) in norm(urllib.parse.unquote(url)),
            })
        manifest[target["id"]] = target | {"candidates": entries}
        manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
        print(f"[{number}/{len(targets)}] {target['sku']}: {len(entries)} candidatas", flush=True)
        time.sleep(1)
    build_sheets(out_dir, manifest)


def build_sheets(out_dir, manifest, per_sheet=6):
    sheets = out_dir / "sheets"
    sheets.mkdir(exist_ok=True)
    for old in sheets.glob("*.jpg"):
        old.unlink()
    font, small = ImageFont.load_default(size=15), ImageFont.load_default(size=12)
    items = [m for m in manifest.values() if m["candidates"]]
    columns = max(len(m["candidates"]) for m in items) if items else 1
    row_height = THUMB + 62
    for start in range(0, len(items), per_sheet):
        chunk = items[start:start + per_sheet]
        sheet = Image.new("RGB", (columns * (THUMB + 8) + 8, row_height * len(chunk)), "white")
        draw = ImageDraw.Draw(sheet)
        for row, item in enumerate(chunk):
            top = row * row_height
            draw.rectangle([0, top, sheet.width, top + 22], fill="#222")
            draw.text((6, top + 3), f'{item["id"]}  |  {item["sku"]}  |  {item["name"]}'[:150], fill="white", font=font)
            for column, candidate in enumerate(item["candidates"]):
                left = 8 + column * (THUMB + 8)
                thumb = Image.open(out_dir / item["id"] / candidate["file"])
                thumb.thumbnail((THUMB, THUMB))
                sheet.paste(thumb, (left + (THUMB - thumb.width) // 2, top + 26 + (THUMB - thumb.height) // 2))
                draw.rectangle([left, top + 26, left + THUMB, top + 26 + THUMB], outline="#bbb")
                mark = " *" if candidate["sku_in_url"] else ""
                label = f'{column + 1} {candidate["source"]}{mark}'
                draw.text((left + 2, top + 28 + THUMB), label, fill="#c00" if candidate["source"] != "web" else "#000", font=small)
                draw.text((left + 2, top + 42 + THUMB), candidate["host"][:30], fill="#555", font=small)
        sheet.save(sheets / f"sheet_{start // per_sheet + 1:02d}.jpg", "JPEG", quality=82)
    print(f"{len(items)} productos con candidatas, hojas en {sheets}")


# ------------------------------------------------------------------ apply

def apply(out_dir):
    manifest = json.loads((out_dir / "manifest.json").read_text())
    selection = json.loads(SELECTION.read_text())
    overrides = json.loads(OVERRIDES.read_text()) if OVERRIDES.exists() else {}
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    source = PRODUCTS_TS.read_text()
    applied = 0
    for pid, choice in selection.items():
        if not choice:
            continue
        item = manifest[pid]
        candidate = item["candidates"][choice - 1]
        image = Image.open(out_dir / pid / candidate["file"])
        image.thumbnail((800, 800))
        image.save(PUBLIC_DIR / f"{pid}.jpg", "JPEG", quality=85, optimize=True)
        public_path = f"/productos/catalogo/{pid}.jpg"
        if item["demo"]:
            pattern = re.compile(r'(id: "%s",.*?images: )\[\]' % re.escape(pid), re.DOTALL)
            source, count = pattern.subn(lambda m: f'{m.group(1)}["{public_path}"]', source, count=1)
            if count != 1:
                sys.exit(f"no se pudo actualizar {pid} en products.ts")
        else:
            overrides[pid] = {"image": public_path, "source": candidate["url"]}
        applied += 1
    PRODUCTS_TS.write_text(source)
    OVERRIDES.write_text(json.dumps(overrides, indent=1, sort_keys=True, ensure_ascii=False) + "\n")
    print(f"{applied} imágenes aplicadas en {PUBLIC_DIR.relative_to(ROOT)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["collect", "sheets", "apply"])
    parser.add_argument("--out", required=True, type=Path, help="carpeta de trabajo para candidatas")
    parser.add_argument("--only", nargs="*", help="ids de producto a procesar")
    args = parser.parse_args()
    if args.command == "collect":
        collect(args.out, set(args.only or []))
    elif args.command == "sheets":
        build_sheets(args.out, json.loads((args.out / "manifest.json").read_text()))
    else:
        apply(args.out)


if __name__ == "__main__":
    main()
