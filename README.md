# GeoDrona — web

Statický web (TanStack Start) hostovaný např. na **GitHub Pages** /
**Cloudflare Pages**. Poptávkový formulář volá samostatný **Cloudflare Worker**
ve složce [`worker/`](./worker), který drží Resend API klíč v bezpečí.

## Frontend env proměnné

Vytvořte soubor `.env` (nebo nastavte v hostingu) s touto proměnnou:

```
VITE_INQUIRY_ENDPOINT=https://geodrona-inquiry.<vas-account>.workers.dev/inquiry
```

URL Workeru získáte po `wrangler deploy` (viz `worker/README.md`).

Pokud `VITE_INQUIRY_ENDPOINT` nenastavíte, formulář bude volat lokální
`/api/public/inquiry` (užitečné pouze při lokálním dev na Lovable).

## Build

```bash
bun install
bun run build
```

## Worker (odesílání e-mailů)

Viz [`worker/README.md`](./worker/README.md) — kompletní postup nasazení
a seznam proměnných, které máte vyplnit.