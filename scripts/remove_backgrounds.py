#!/usr/bin/env python3
"""Convierte las fotos de producto a PNG con fondo transparente.

El recorte lo hace rembg (https://github.com/danielgatis/rembg) y la compresión
pngquant (https://github.com/kornelski/pngquant, `brew install pngquant`); este
script solo reparte el trabajo en hilos, centra el producto y guarda el resultado.

    uv venv --python 3.11 .image-candidates/venv
    uv pip install --python .image-candidates/venv/bin/python "rembg[cpu]" pillow
    .image-candidates/venv/bin/python scripts/remove_backgrounds.py \
        --work .image-candidates/png [--workers 8] [--model u2net]

Toma cada producto de catalog.generated.json y de products.ts que todavía no
tenga PNG, baja la foto (o la lee de public/), y escribe
public/productos/catalogo/{id}.png. Es reanudable: lo ya hecho se salta.

Los recortes dudosos quedan en {work}/review y no se publican. Los que se ven
mal al revisarlos se anotan en scripts/png-exclusions.json: esos productos
conservan su foto original.

Después hay que volver a correr import_catalog.py, que usa el PNG local de
cada producto cuando existe.
"""
import argparse
import io
import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "src" / "data" / "catalog.generated.json"
PRODUCTS_TS = ROOT / "src" / "data" / "products.ts"
OVERRIDES = Path(__file__).resolve().parent / "image-overrides.json"
# Productos cuyo recorte salió mal; se quedan con la foto original.
EXCLUSIONS = Path(__file__).resolve().parent / "png-exclusions.json"
PUBLIC = ROOT / "public"
OUT_DIR = PUBLIC / "productos" / "catalogo"

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
MAX_BYTES = 12 * 1024 * 1024
SIZE = 640      # lado del lienzo final
MARGIN = 0.05   # aire alrededor del producto
# Fuera de este rango el recorte casi seguro falló (borró el producto o no quitó nada).
MIN_COVERAGE, MAX_COVERAGE = 0.02, 0.97
PNGQUANT = shutil.which("pngquant")

DEMO_IMAGE = re.compile(r'id: "(p\d+)",.*?images: \["([^"]+)"\]', re.DOTALL)


def load_targets():
    """[(id, origen)] de los productos cuya foto todavía no es PNG local."""
    excluded = set(json.loads(EXCLUSIONS.read_text())) if EXCLUSIONS.exists() else set()
    targets = []
    for product in json.loads(CATALOG.read_text()):
        if product["images"]:
            targets.append((product["id"], product["images"][0]))
    for block in re.split(r"\n  \{\n", PRODUCTS_TS.read_text()):
        match = DEMO_IMAGE.search(block)
        if match:
            targets.append(match.groups())
    return [(pid, src) for pid, src in targets if src != public_path(pid) and pid not in excluded]


def public_path(pid):
    return f"/productos/catalogo/{pid}.png"


def read_source(pid, src, work):
    if src.startswith("/"):
        return (PUBLIC / src.lstrip("/")).read_bytes()
    cached = work / "originals" / pid
    if cached.exists():
        return cached.read_bytes()
    url = urllib.parse.quote(src, safe=":/?&=%#+,;@~!$'()*[]")
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/*,*/*"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                raw = response.read(MAX_BYTES + 1)
            break
        except OSError:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))
    if len(raw) > MAX_BYTES:
        raise ValueError("imagen demasiado grande")
    cached.write_bytes(raw)
    return raw


def cut_out(raw, session):
    from PIL import Image
    from rembg import remove

    image = Image.open(io.BytesIO(raw))
    image.load()
    if image.mode in ("RGBA", "LA", "P"):
        # Transparencias de origen sobre blanco, para que el modelo vea una foto normal
        image = image.convert("RGBA")
        flat = Image.new("RGB", image.size, "white")
        flat.paste(image, mask=image.split()[-1])
        image = flat
    image = image.convert("RGB")
    image.thumbnail((1600, 1600))
    result = remove(image, session=session, post_process_mask=True)
    alpha = result.split()[-1]
    coverage = sum(alpha.point(lambda v: 255 if v > 32 else 0).histogram()[255:]) / (image.width * image.height)
    box = alpha.point(lambda v: 255 if v > 16 else 0).getbbox()
    if box is None:
        return None, 0.0
    result = result.crop(box)
    inner = round(SIZE * (1 - 2 * MARGIN))
    scale = min(1.0, inner / max(result.size))
    if scale < 1.0:
        result = result.resize((max(1, round(result.width * scale)), max(1, round(result.height * scale))), Image.LANCZOS)
    side = round(max(result.size) / (1 - 2 * MARGIN))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(result, ((side - result.width) // 2, (side - result.height) // 2))
    return canvas, coverage


def compress(path):
    """Reduce el PNG a paleta con pngquant (~60 % menos peso); si no está instalado, se deja igual."""
    if PNGQUANT:
        # Código 99: no alcanzó la calidad mínima y dejó el archivo sin tocar.
        subprocess.run([PNGQUANT, "--quality", "70-95", "--speed", "3", "--strip", "--force",
                        "--ext", ".png", str(path)], check=False)


def process(pid, src, work, session):
    canvas, coverage = cut_out(read_source(pid, src, work), session)
    status = "ok" if canvas is not None and MIN_COVERAGE <= coverage <= MAX_COVERAGE else "revisar"
    if canvas is not None:
        # Los dudosos se guardan aparte para revisarlos; no se publican solos.
        target = OUT_DIR / f"{pid}.png" if status == "ok" else work / "review" / f"{pid}.png"
        canvas.save(target, "PNG", optimize=True)
        compress(target)
    return {"source": src, "coverage": round(coverage, 4), "status": status}


def update_references(done):
    """Apunta products.ts e image-overrides.json a los PNG y borra los JPG que ya no se usan."""
    source = PRODUCTS_TS.read_text()
    overrides = json.loads(OVERRIDES.read_text()) if OVERRIDES.exists() else {}
    replaced = []
    for pid, entry in done.items():
        if entry["status"] != "ok" or not (OUT_DIR / f"{pid}.png").exists():
            continue
        old = entry["source"]
        if re.fullmatch(r"p\d+", pid):
            pattern = re.compile(r'(id: "%s",.*?images: \[")%s("\])' % (re.escape(pid), re.escape(old)), re.DOTALL)
            source, count = pattern.subn(lambda m: m.group(1) + public_path(pid) + m.group(2), source, count=1)
            if count:
                replaced.append(old)
        elif pid in overrides and overrides[pid]["image"] == old:
            overrides[pid]["image"] = public_path(pid)
            replaced.append(old)
    PRODUCTS_TS.write_text(source)
    if overrides:
        OVERRIDES.write_text(json.dumps(overrides, indent=1, sort_keys=True, ensure_ascii=False) + "\n")
    for old in replaced:
        path = PUBLIC / old.lstrip("/")
        if old.startswith("/productos/catalogo/") and path.exists():
            path.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--work", required=True, type=Path, help="carpeta de trabajo (originales, estado, dudosos)")
    parser.add_argument("--workers", type=int, default=os.cpu_count() or 4)
    parser.add_argument("--model", default="u2net", help="modelo de rembg")
    parser.add_argument("--only", nargs="*", help="ids de producto a procesar")
    parser.add_argument("--limit", type=int, help="máximo de imágenes en esta corrida")
    args = parser.parse_args()

    # Un hilo de onnxruntime por inferencia: el paralelismo lo pone el pool de abajo.
    os.environ.setdefault("OMP_NUM_THREADS", "1")
    from rembg import new_session

    for folder in (args.work / "originals", args.work / "review", OUT_DIR):
        folder.mkdir(parents=True, exist_ok=True)
    state_path = args.work / "state.json"
    done = json.loads(state_path.read_text()) if state_path.exists() else {}

    targets = [(pid, src) for pid, src in load_targets()
               if pid not in done and (not args.only or pid in args.only)]
    if args.limit:
        targets = targets[:args.limit]
    print(f"{len(targets)} imágenes por procesar con {args.workers} hilos, modelo {args.model}", flush=True)

    session = new_session(args.model, providers=["CPUExecutionProvider"])
    lock = threading.Lock()
    started = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(process, pid, src, args.work, session): (pid, src) for pid, src in targets}
        for number, future in enumerate(as_completed(futures), 1):
            pid, src = futures[future]
            try:
                entry = future.result()
            except Exception as error:  # una imagen rota o caída no detiene el lote
                print(f"  {pid}: error {error}", flush=True)
                continue
            with lock:
                done[pid] = entry
                if number % 20 == 0 or number == len(targets):
                    state_path.write_text(json.dumps(done, indent=1, ensure_ascii=False))
            if entry["status"] != "ok":
                print(f"  {pid}: revisar (cobertura {entry['coverage']:.0%})", flush=True)
            if number % 50 == 0:
                print(f"[{number}/{len(targets)}] {time.time() - started:.0f} s", flush=True)
    state_path.write_text(json.dumps(done, indent=1, ensure_ascii=False))

    update_references(done)
    review = [pid for pid, entry in done.items() if entry["status"] != "ok"]
    print(f"listo en {time.time() - started:.0f} s: {len(done) - len(review)} PNG, {len(review)} por revisar")
    if review:
        print("revisar:", " ".join(review))
    return 0


if __name__ == "__main__":
    sys.exit(main())
