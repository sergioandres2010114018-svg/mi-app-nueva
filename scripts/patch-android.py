#!/usr/bin/env python3
"""
Personaliza el proyecto Android generado por `npx cap add android`:
  - Ícono de la app  -> logo del proyecto (assets/icon-only.png)
  - Pantalla de carga -> logo centrado sobre fondo blanco
Se ejecuta automáticamente en GitHub Actions (y a mano si compilas en tu PC).
Requiere: pip install pillow
"""
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / 'android' / 'app' / 'src' / 'main' / 'res'
ICON = ROOT / 'assets' / 'icon-only.png'

if not RES.exists():
    sys.exit(f'No existe {RES}. Ejecuta primero: npx cap add android')
if not ICON.exists():
    sys.exit(f'No existe {ICON}')

icon = Image.open(ICON).convert('RGB')

# ---- 1) Íconos de lanzador (cuadrado y redondo) ----
SIZES = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
for dens, px in SIZES.items():
    d = RES / f'mipmap-{dens}'
    d.mkdir(parents=True, exist_ok=True)
    sq = icon.resize((px, px), Image.LANCZOS)
    sq.save(d / 'ic_launcher.png')
    sq.save(d / 'ic_launcher_foreground.png')
    # redondo
    big = icon.resize((px * 4, px * 4), Image.LANCZOS)
    mask = Image.new('L', (px * 4, px * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, px * 4 - 1, px * 4 - 1), fill=255)
    out = Image.new('RGBA', (px * 4, px * 4), (0, 0, 0, 0))
    out.paste(big, (0, 0), mask)
    out.resize((px, px), Image.LANCZOS).save(d / 'ic_launcher_round.png')

# Se elimina el ícono adaptativo de la plantilla (trae el logo de Capacitor)
# para que Android use los PNG anteriores.
any_dpi = RES / 'mipmap-anydpi-v26'
if any_dpi.exists():
    shutil.rmtree(any_dpi)
for extra in (RES / 'drawable-v24' / 'ic_launcher_foreground.xml',):
    if extra.exists():
        extra.unlink()

# ---- 2) Pantalla de carga (splash) ----
n = 0
for f in RES.glob('drawable*/splash.png'):
    try:
        w, h = Image.open(f).size
    except Exception:
        continue
    canvas = Image.new('RGB', (w, h), (255, 255, 255))
    side = int(min(w, h) * 0.45)
    logo = icon.resize((side, side), Image.LANCZOS)
    canvas.paste(logo, ((w - side) // 2, (h - side) // 2))
    canvas.save(f)
    n += 1

print(f'Íconos actualizados y {n} imágenes de splash reemplazadas.')
