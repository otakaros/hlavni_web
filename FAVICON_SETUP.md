# 🎨 GeoDrona Favicon — SEO & Browser Compatibility Setup

## Problém
Favicony musí být dostupné ve všech formátech a velikostech pro **maximum dosahu v search engine** výsledcích a sociálních sítích.

---

## 📋 Potřebné soubory

### 1. **PNG Verze** (kritické pro vyhledávače)
```
public/assets/favicon-512.png    ← Android PWA + sociální sítě (hlavní)
public/assets/favicon-192.png    ← Android, PWA manifest
public/assets/favicon-96.png     ← PWA shortcuts, Windows tiles
public/assets/favicon-32.png     ← Browser tabs, Search results
public/assets/favicon-16.png     ← Browser tabs (fallback)
public/assets/favicon-144.png    ← Windows tiles
```

### 2. **Apple iOS** (pro domovskou obrazovku)
```
public/assets/apple-touch-icon-180.png   ← iPhone home screen
public/assets/apple-touch-icon-152.png   ← iPad home screen
public/assets/apple-touch-icon-144.png   ← iPad mini
public/assets/apple-touch-icon-120.png   ← iPhone SE
```

### 3. **Legacy**
```
public/favicon.ico              ← IE, seznam.cz, starší prohlížeče
```

### 4. **Metadata soubory** ✅ (už hotovy)
```
public/assets/site.webmanifest              ← PWA manifest
public/assets/browserconfig.xml             ← Microsoft config
```

---

## 🔧 Jak generovat PNG z SVG

### Možnost A: ImageMagick (doporučeno — jednolinerů)
```bash
cd public/assets

# PNG základní velikosti pro vyhledávače
magick convert favicon.svg -resize 512x512 favicon-512.png
magick convert favicon.svg -resize 192x192 favicon-192.png
magick convert favicon.svg -resize 96x96 favicon-96.png
magick convert favicon.svg -resize 32x32 favicon-32.png
magick convert favicon.svg -resize 16x16 favicon-16.png
magick convert favicon.svg -resize 144x144 favicon-144.png

# Apple touch icons
magick convert favicon.svg -resize 180x180 apple-touch-icon-180.png
magick convert favicon.svg -resize 152x152 apple-touch-icon-152.png
magick convert favicon.svg -resize 144x144 apple-touch-icon-144.png
magick convert favicon.svg -resize 120x120 apple-touch-icon-120.png

# Legacy .ico z 32px PNG
magick convert favicon-32.png favicon.ico
```

**Instalace ImageMagick:**
- **Windows**: `choco install imagemagick` nebo stáhni z https://imagemagick.org/
- **Mac**: `brew install imagemagick`
- **Linux**: `apt-get install imagemagick` / `yum install ImageMagick`

### Možnost B: Online nástroje (bez instalace)
- **CloudConvert**: https://cloudconvert.com/svg-to-png
  - Nahraji favicon.svg
  - Vytvořím všechny velikosti najednou
  - Stáhnu ZIP
- **Online-Convert**: https://www.online-convert.com/
- **XnConvert**: https://www.xnconvert.com/ (batch processing GUI)

### Možnost C: Python PIL/Pillow (pokud máš Python)
```python
from PIL import Image
from pathlib import Path

svg_path = Path("public/assets/favicon.svg")
output_dir = Path("public/assets")

# Musíš mít instalován cairosvg pro SVG → PNG
# pip install Pillow cairosvg

import cairosvg
import io

sizes = [512, 192, 96, 32, 16, 144, 180, 152, 120]

for size in sizes:
    svg_string = open(svg_path, "r").read()
    png_bytes = io.BytesIO()
    cairosvg.svg2png(bytestring=svg_string, write_to=png_bytes, output_width=size, output_height=size)
    png_bytes.seek(0)
    img = Image.open(png_bytes)
    img.save(output_dir / f"favicon-{size}.png")
    print(f"✓ {size}x{size}")

# Pro .ico — vezmi 32px a konvertuj
Image.open(output_dir / "favicon-32.png").save(output_dir.parent / "favicon.ico")
print("✓ favicon.ico created from 32px")
```

---

## 📱 Kde se favicony zobrazují

| Místo | Soubor | Velikost | Vyhledávač |
|-------|--------|----------|-----------|
| Browser tab | favicon-16/32 | 16×16 / 32×32 | Google, Bing, Firefox, Chrome |
| Vyhledávací výsledky | favicon-32 | 32×32 | **Google**, **Bing**, DuckDuckGo |
| Android home screen | favicon-192, 512 | 192×192, 512×512 | Android, PWA |
| iPhone/iPad home screen | apple-touch-icon-* | 120–180 | **Safari iOS** |
| Windows Start tile | favicon-144 | 144×144 | **Windows 10/11** |
| Sociální sítě | favicon-512 | 512×512 | Facebook, LinkedIn, Twitter |
| seznam.cz | favicon.ico | 32×32 | **Seznam.cz** |
| IE, starší prohlížeče | favicon.ico | 32×32 | Internet Explorer |

---

## ✅ Kontrola — jak ověřit správný setup

1. **Vyhledávače:**
   - Jdi na https://www.google.com/s2/favicons?domain=geodrona.cz
   - Měl bys vidět ikonu

2. **Pinterest/Social sharing validator:**
   - https://www.opengraph.xyz/ — vlož `https://geodrona.cz`
   - Zkontroluj, že se zobrazuje favicon

3. **Browser DevTools:**
   - F12 → Network tab
   - Zkontroluj, že se všechny favicon soubory stahují (200 OK)
   - Zkontroluj Sources > assets

4. **PWA validator (Android):**
   - Android phone: otevři geodrona.cz
   - Chrome menu → "Přidat na domovskou obrazovku"
   - Měla by se zobrazit správná ikona

5. **manifest validator:**
   - https://tomitm.github.io/appmanifest/

---

## 🚀 Po vygenerování PNG

1. Ulož všechny PNG a .ico soubory do `public/assets/` a `public/`
2. V `.gitignore` jsou PNG ignorovány (jsou vygenerované)
3. Přidej je do gitu: `git add public/favicon.ico public/assets/favicon-*.png`
4. Pushni: `git push`
5. Vygenerované soubory automaticky jdou na GitHub Pages

---

## 🔗 Reference

- [MDN: Favicon](https://developer.mozilla.org/en-US/docs/Glossary/Favicon)
- [Google Search Central: Favicon](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Web.dev: Favicon](https://web.dev/favicon/)
- [Apple: Web Clip Icons](https://developer.apple.com/library/archive/documentation/AppleWebKit/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [PWA Manifest spec](https://www.w3.org/TR/appmanifest/)
