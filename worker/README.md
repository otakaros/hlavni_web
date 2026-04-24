# GeoDrona — Inquiry Worker

Cloudflare Worker, který přijímá poptávky z webu a posílá je e-mailem přes Resend.
`RESEND_API_KEY` zůstává bezpečně jen tady — nikdy se nedostane do frontendu.

## 1. První nasazení

```bash
cd worker
npm install         # nebo: bun install
npx wrangler login  # přihlášení k vašemu Cloudflare účtu
```

## 2. Nastavení tajného klíče (Resend)

```bash
npx wrangler secret put RESEND_API_KEY
# vložte API klíč z https://resend.com/api-keys (např. re_xxxxxxxx...)
```

Toto je **jediný citlivý údaj** — uloží se šifrovaně v Cloudflare,
nikdy se necommituje do gitu.

## 3. Nastavení veřejných proměnných

Otevřete `wrangler.toml` a doplňte v sekci `[vars]`:

| Proměnná          | Co tam patří                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `ALLOWED_ORIGINS` | Čárkou oddělené domény, ze kterých se smí volat (frontend). Např. `https://geodrona.cz,https://www.geodrona.cz,https://username.github.io` |
| `TARGET_EMAIL`    | Adresa, kam mají chodit poptávky. Default: `zakazky.geodetak@gmail.com`                       |
| `FROM_EMAIL`      | Odesílatel. Default: `GeoDrona <onboarding@resend.dev>`. **Pro produkci** nastavte vlastní ověřenou doménu v Resendu, např. `GeoDrona <noreply@geodrona.cz>` |

> ⚠️ Resend povoluje odesílat z `onboarding@resend.dev` jen pro testy.
> Pro produkci **musíte v Resend dashboardu ověřit doménu** (geodrona.cz)
> a nastavit DNS záznamy (SPF, DKIM). Bez toho budou e-maily padat do spamu
> nebo Resend odesílání odmítne.

## 4. Nasazení

```bash
npx wrangler deploy
```

Po nasazení vám Wrangler vypíše URL, např.:

```
https://geodrona-inquiry.<vas-account>.workers.dev
```

Tuto URL pak vložíte do frontendu jako `VITE_INQUIRY_ENDPOINT`
(viz README v rootu projektu).

## 5. Sledování logů

```bash
npx wrangler tail
```

## Endpoint

- `POST /inquiry` — JSON body s poptávkou. Worker odešle 2 e-maily (admin + zákazník) a vrátí `{ ok: true, id: "1234" }`.
- CORS je omezen na `ALLOWED_ORIGINS`.

## Změna konfigurace později

- **Změna domény ve frontu** → upravte `ALLOWED_ORIGINS` v `wrangler.toml` + znovu `wrangler deploy`.
- **Změna cílového e-mailu** → upravte `TARGET_EMAIL` + znovu `wrangler deploy`.
- **Rotace Resend klíče** → `wrangler secret put RESEND_API_KEY` znovu.