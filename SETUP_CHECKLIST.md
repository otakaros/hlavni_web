# ✅ GeoDrona — Opravy & Setup Checklist

## 🔧 Co bylo vyřešeno

### 1. **Formulář — Poptávka (405 Method Not Allowed FIX)** ✅

**Problém:** POST na `https://geodrona.cz/api/public/inquiry` vrátil **405 (Method Not Allowed)**
- Důvod: Formulář volal špatnou cestu, worker běhel na jiné URL

**Řešení:**
- ✅ Aktualizován `InquiryForm.tsx` — teď používá správný worker endpoint
- ✅ Aktualizován `.env` — `VITE_INQUIRY_ENDPOINT` na správnou URL
- ✅ Worker endpoint: `https://geodrona-inquiry.geodrona-inquiry.workers.dev/inquiry`

**Soubory co se změnily:**
- `src/components/geo/InquiryForm.tsx` — endpoint opraveno
- `.env` — `VITE_INQUIRY_ENDPOINT` aktualizován
- `worker/src/index.ts` — Path zpět na `/inquiry`
- `worker/wrangler.toml` — Route odstraněno (je v Cloudflare dashboardu)

---

### 2. **Favicon — SEO & Browser Compatibility** ✅

**Problem:** Favicon nebyla vidět v search engine výsledcích (Google, Bing, Seznam)

**Řešení:**
- ✅ Multiformat setup pro všechny prohlížeče a vyhledávače
- ✅ Updated `__root.tsx` — Kompletní favicon <link> tagy
- ✅ Vytvořen `site.webmanifest` — PWA support + offline
- ✅ Vytvořen `browserconfig.xml` — Windows tile support
- ✅ Vytvořen `FAVICON_SETUP.md` — Detailní instrukce generování PNG

**Soubory co se změnily/vytvořily:**
- `src/routes/__root.tsx` — Favicon <link> tagy
- `public/assets/site.webmanifest` — PWA manifest
- `public/assets/browserconfig.xml` — Windows config
- `FAVICON_SETUP.md` — Pokyny pro generování PNG
- `.gitignore` — PNG verze ignorovány (jsou vygenerované)
- `.env.example` — Template pro env vars

---

## 📋 ČO ZBÝVÁ UDĚLAT (1-2 minuty)

### Favicon PNG Generování

Vygeneruj tyto PNG soubory z `public/assets/favicon.svg`:

**Kritické pro vyhledávače:**
```bash
cd public/assets

# Bez ImageMagick? Stáhni PNG z:
# 1. CloudConvert (https://cloudconvert.com/svg-to-png)
#    - Nahraji favicon.svg
#    - Vybrat všechny velikosti najednou: 512, 192, 96, 32, 16, 180, 152, 144, 120
#    - Stáhnout ZIP

# S ImageMagick (depois instalace - https://imagemagick.org/):
magick convert favicon.svg -resize 512x512 favicon-512.png
magick convert favicon.svg -resize 192x192 favicon-192.png
magick convert favicon.svg -resize 96x96 favicon-96.png
magick convert favicon.svg -resize 32x32 favicon-32.png
magick convert favicon.svg -resize 16x16 favicon-16.png
magick convert favicon.svg -resize 144x144 favicon-144.png
magick convert favicon.svg -resize 180x180 apple-touch-icon-180.png
magick convert favicon.svg -resize 152x152 apple-touch-icon-152.png
magick convert favicon.svg -resize 144x144 apple-touch-icon-144.png
magick convert favicon.svg -resize 120x120 apple-touch-icon-120.png
magick convert favicon-32.png ../favicon.ico  # .ico z 32px PNG
```

---

## 🧪 TESTOVÁNÍ

### 1. Formulář
```bash
# Dev:
npm run dev
# Jdi na https://localhost:5173 (nebo tvůj port)
# Vyplň formulář na "Poptávka" — mělo by fungovat bez chyby
```

### 2. Favicon kontrola
```bash
# Zkontroluj že jsou soubory k dispozici:
# - public/favicon.ico — YES/NO ?
# - public/assets/favicon-*.png — všechny velikosti ?
# - public/assets/apple-touch-icon-*.png — všechny ?

# Měl bys vidět:
ls public/assets/ | grep favicon
# favicon.svg
# favicon-512.png
# favicon-192.png
# ... etc
```

### 3. Search engine check
```
# Jdi na:
https://www.google.com/s2/favicons?domain=geodrona.cz

# Měl bys vidět GeoDrona ikonu
```

### 4. PWA manifest validator
```
https://tomitm.github.io/appmanifest/
# Vlož: https://geodrona.cz/assets/site.webmanifest
```

---

## 📚 KDE JSOU SOUBORY

```
c:\Users\Ondřej\Desktop\Geodrona\source\
├── .env                          ✅ Worker endpoint (VITE_INQUIRY_ENDPOINT)
├── .env.example                  ✅ Template
├── FAVICON_SETUP.md              ✅ Pokyny pro PNG generování
├── src/
│   ├── components/geo/
│   │   └── InquiryForm.tsx       ✅ Opraveno — správný endpoint
│   └── routes/
│       └── __root.tsx            ✅ Favicon tagy + PWA meta
├── public/
│   ├── favicon.ico               ⏳ Potřebuješ vygenerovat (ze 32px PNG)
│   └── assets/
│       ├── favicon.svg           ✅ Originál SVG
│       ├── favicon-512.png       ⏳ Vygenerovat
│       ├── favicon-192.png       ⏳ Vygenerovat
│       ├── favicon-96.png        ⏳ Vygenerovat
│       ├── favicon-32.png        ⏳ Vygenerovat
│       ├── favicon-16.png        ⏳ Vygenerovat
│       ├── favicon-144.png       ⏳ Vygenerovat
│       ├── apple-touch-icon-180.png  ⏳ Vygenerovat
│       ├── apple-touch-icon-152.png  ⏳ Vygenerovat
│       ├── apple-touch-icon-144.png  ⏳ Vygenerovat
│       ├── apple-touch-icon-120.png  ⏳ Vygenerovat
│       ├── site.webmanifest      ✅ PWA manifest
│       └── browserconfig.xml     ✅ Microsoft Windows config
└── worker/
    ├── src/
    │   └── index.ts              ✅ Opraveno (path `/inquiry`)
    └── wrangler.toml             ✅ Opraveno (bez route)
```

---

## 🚀 NEXT STEPS

1. **Vygeneruj PNG** — z faviconu (CloudConvert nebo ImageMagick)
2. **Ulož je** do `public/` a `public/assets/`
3. **Test dev server** — `npm run dev`
4. **Build & deploy** — `npm run build` → GitHub Pages
5. **Ověř v Google Search Central** — https://search.google.com/search-console

---

## 📞 WORKER INFO

```
Worker Name: geodrona-inquiry
Worker URL: https://geodrona-inquiry.geodrona-inquiry.workers.dev
Endpoint: https://geodrona-inquiry.geodrona-inquiry.workers.dev/inquiry
Method: POST
CORS: Povoleno pro geodrona.cz ✅
```

Aby se formulář volal přes Cloudflare custom doménu (`/api/public/inquiry`), 
musíš nastavit route v **Cloudflare Dashboard** → Workers & Pages → Routes.

---

## 💡 POZNÁMKA

Worker už je nasazený a fungující! 
Frontend teď používá správný endpoint z `.env`, 
takže by formulář měl fungovat bez problémů. ✅
