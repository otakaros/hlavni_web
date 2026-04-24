# GeoDrona — web

Statický web (TanStack Start) hostovaný na **GitHub Pages** s automatickým deploymentem.
Poptávkový formulář volá samostatný **Cloudflare Worker** ve složce [`worker/`](./worker),
který drží Resend API klíč v bezpečí.

## Frontend env proměnné

Vytvořte soubor `.env` (nebo nastavte v GitHub Actions secrets) s touto proměnnou:

```
VITE_INQUIRY_ENDPOINT=https://geodrona-inquiry.<vas-account>.workers.dev/inquiry
```

URL Workeru získáte po `wrangler deploy` (viz `worker/README.md`).

Pokud `VITE_INQUIRY_ENDPOINT` nenastavíte, formulář bude volat lokální
`/api/public/inquiry` (užitečné pouze při lokálním dev).

## Lokální development

```bash
npm install
npm run dev          # Spustit dev server na http://localhost:5173
npm run build        # Běžný build (SSR)
npm run build:static # Build + statický export (prerendering)
npm run preview      # Zobrazit výsledek buildu
```

## Statický export (Static Site Generation)

Projekt je nakonfigurován pro statický export - všechny routy se prerenderoují
jako HTML soubory, které se pak nasazují na GitHub Pages bez potřeby Node.js serveru.

### Jak to funguje:

1. **`npm run build`** – Vite builduje client a server-side runtime
2. **`npm run build:static`** – Spustí build + `scripts/prerender.mjs`
   - Prerender skript importuje server runtime
   - Pro každou routu (`/`, `/geodezie`) zavolá `server.fetch()`
   - Vygeneruje HTML soubory do `dist/public-static/`
   - Zkopíruje assets a speciální soubory (CNAME, .nojekyll)

### Výstup:

```
dist/public-static/
├── index.html              # Domovská stránka /
├── geodezie.html          # /geodezie.html
├── geodezie/
│   └── index.html          # /geodezie/ (nice URL)
├── assets/                 # CSS, JS, obrázky
├── .nojekyll              # Říká GitHub Pages: nepoužívej Jekyll
├── CNAME                  # Vlastní doména (geodrona.cz)
└── ...
```

### Přidání nových routů:

Pokud chcete přidat novou routu:

1. Vytvořte soubor `src/routes/nova-stranka.tsx`
2. Upravte `scripts/prerender.mjs` – přidejte routu do pole:
   ```javascript
   const routes = ['/', '/geodezie', '/nova-stranka'];
   ```
3. Spusťte `npm run build:static`

## Deploy na GitHub Pages

### GitHub Actions (automatické)

Při push do `main` nebo `master` branche se spustí workflow `.github/workflows/deploy.yml`:

1. Vytvoří Node.js 20 prostředí
2. Instaluje závislosti
3. Spustí `npm run build:static` (zahrnuje prerendering)
4. Připraví `dist/` pro upload
5. Nasadí na GitHub Pages

### GitHub Actions secrets:

Pokud používáte poptávkový formulář, přidejte do GitHub repository settings:

- **VITE_INQUIRY_ENDPOINT** – URL vašeho Cloudflare Workeru

## Worker (odesílání e-mailů)

Viz [`worker/README.md`](./worker/README.md) — kompletní postup nasazení
a seznam proměnných, které máte vyplnit.