/**
 * GeoDrona — Inquiry Worker
 * Přijímá poptávky z webu a posílá je přes Resend.
 * RESEND_API_KEY zůstává bezpečně jen na straně Workeru.
 */

export interface Env {
  RESEND_API_KEY: string;
  ALLOWED_ORIGINS: string;
  TARGET_EMAIL: string;
  FROM_EMAIL: string;
}

interface InquiryBody {
  variant: "drone" | "geo";
  name: string;
  company?: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  parcel?: string;
  objtype?: string;
  area?: string;
  date?: string;
  budget?: string;
  notes?: string;
}

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function validate(b: any): { ok: true; data: InquiryBody } | { ok: false; error: string } {
  if (!b || typeof b !== "object") return { ok: false, error: "Invalid body" };
  const variant = b.variant === "geo" ? "geo" : "drone";
  const required = ["name", "phone", "email", "service", "location"] as const;
  for (const k of required) {
    if (!b[k] || typeof b[k] !== "string" || !b[k].trim()) {
      return { ok: false, error: `Chybí povinné pole: ${k}` };
    }
    if (b[k].length > 500) return { ok: false, error: `Pole je příliš dlouhé: ${k}` };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    return { ok: false, error: "Neplatný e-mail" };
  }
  const optional = ["company", "parcel", "objtype", "area", "date", "budget", "notes"];
  for (const k of optional) {
    if (b[k] != null && (typeof b[k] !== "string" || b[k].length > 2000)) {
      return { ok: false, error: `Neplatné pole: ${k}` };
    }
  }
  return { ok: true, data: { ...b, variant } as InquiryBody };
}

function adminEmailHtml(d: InquiryBody, id: string) {
  const sectionLabel = d.variant === "geo" ? "Geodetické služby" : "Dronové služby";
  const row = (k: string, v?: string) =>
    v && v.trim()
      ? `<tr><td style="padding:8px 12px;background:#f5f7f5;font-weight:600;color:#0d2818;width:180px;border-bottom:1px solid #e5e7e5">${esc(k)}</td><td style="padding:8px 12px;color:#222;border-bottom:1px solid #e5e7e5">${esc(v)}</td></tr>`
      : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f0f2f0;font-family:Arial,sans-serif">
    <div style="max-width:640px;margin:0 auto;background:#fff;padding:0">
      <div style="background:linear-gradient(135deg,#0d2818,#1a4a2e);padding:28px 32px;color:#39ff14">
        <div style="font-size:12px;letter-spacing:.2em;color:#9ec092;margin-bottom:6px">GEODRONA.CZ — NOVÁ POPTÁVKA</div>
        <div style="font-size:22px;color:#fff;font-weight:700">${esc(sectionLabel)}</div>
        <div style="font-size:13px;color:#9ec092;margin-top:6px">ID: ZL-${esc(id)}</div>
      </div>
      <div style="padding:24px 32px">
        <h2 style="margin:0 0 14px;font-size:15px;color:#0d2818;letter-spacing:.05em;text-transform:uppercase">Zákazník</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${row("Jméno", d.name)}
          ${row("Společnost", d.company)}
          ${row("Telefon", d.phone)}
          ${row("E-mail", d.email)}
        </table>
        <h2 style="margin:0 0 14px;font-size:15px;color:#0d2818;letter-spacing:.05em;text-transform:uppercase">Zakázka</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${row("Služba", d.service)}
          ${row("Typ objektu", d.objtype)}
          ${row("Lokalita", d.location)}
          ${d.variant === "geo" ? row("Parc. číslo", d.parcel) : ""}
          ${row("Rozsah / plocha", d.area)}
          ${row("Termín", d.date)}
          ${row("Rozpočet", d.budget)}
        </table>
        ${d.notes && d.notes.trim() ? `<h2 style="margin:0 0 10px;font-size:15px;color:#0d2818;letter-spacing:.05em;text-transform:uppercase">Poznámky</h2><div style="padding:14px 16px;background:#f5f7f5;border-left:3px solid #39ff14;font-size:14px;color:#222;white-space:pre-wrap;line-height:1.6">${esc(d.notes)}</div>` : ""}
        <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7e5;font-size:12px;color:#888">
          Odpovězte přímo na tento e-mail — odpověď půjde zákazníkovi (${esc(d.email)}).
        </div>
      </div>
    </div></body></html>`;
}

function customerEmailHtml(d: InquiryBody, id: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f0f2f0;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#fff">
      <div style="background:linear-gradient(135deg,#0d2818,#1a4a2e);padding:32px;text-align:center">
        <div style="font-size:28px;color:#fff;font-weight:700;letter-spacing:.05em">GEO<span style="color:#39ff14">DRONA</span></div>
        <div style="font-size:11px;letter-spacing:.2em;color:#9ec092;margin-top:8px">DRONOVÉ &amp; GEODETICKÉ SLUŽBY · MSK</div>
      </div>
      <div style="padding:36px 32px;color:#222;line-height:1.65">
        <h1 style="margin:0 0 16px;font-size:22px;color:#0d2818">Děkujeme za vaši poptávku, ${esc(d.name.split(" ")[0])}!</h1>
        <p style="margin:0 0 18px;font-size:15px">Vaši poptávku jsme přijali a co nejdříve (obvykle do 24 hodin) se vám ozveme s nezávaznou nabídkou.</p>
        <div style="margin:24px 0;padding:18px 22px;background:#f5f7f5;border-left:3px solid #39ff14;border-radius:4px;font-size:14px">
          <div style="color:#666;font-size:12px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Číslo poptávky</div>
          <div style="font-size:18px;font-weight:700;color:#0d2818;font-family:monospace">ZL-${esc(id)}</div>
          <div style="margin-top:14px;color:#444"><strong>Služba:</strong> ${esc(d.service)}</div>
          <div style="color:#444"><strong>Lokalita:</strong> ${esc(d.location)}</div>
        </div>
        <p style="margin:18px 0 6px;font-size:14px;color:#444">Pokud potřebujete cokoliv doplnit, stačí na tento e-mail odpovědět.</p>
        <p style="margin:24px 0 0;font-size:14px;color:#444">S pozdravem,<br/><strong>tým GeoDrona</strong></p>
        <div style="margin-top:32px;padding-top:18px;border-top:1px solid #e5e7e5;font-size:12px;color:#888;text-align:center">
          GeoDrona · Ostrava, Moravskoslezský kraj<br/>
          <a href="https://geodrona.cz" style="color:#1a4a2e;text-decoration:none">geodrona.cz</a>
        </div>
      </div>
    </div></body></html>`;
}

async function sendViaResend(
  apiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string; reply_to?: string },
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
  return text;
}

function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
  const allowOrigin =
    origin && allowed.includes(origin) ? origin : allowed[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cors = corsHeaders(origin, allowed);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/inquiry") {
      return new Response("Not found", { status: 404, headers: cors });
    }

    if (!env.RESEND_API_KEY) {
      return Response.json(
        { error: "Server není nakonfigurován (chybí RESEND_API_KEY)." },
        { status: 500, headers: cors },
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers: cors });
    }

    const v = validate(body);
    if (!v.ok) {
      return Response.json({ error: v.error }, { status: 400, headers: cors });
    }
    const data = v.data;
    const id = String(Math.floor(1000 + Math.random() * 9000));
    const sectionLabel = data.variant === "geo" ? "Geodetické služby" : "Dronové služby";

    try {
      // 1. Notifikace adminovi
      await sendViaResend(env.RESEND_API_KEY, {
        from: env.FROM_EMAIL,
        to: [env.TARGET_EMAIL],
        subject: `[GeoDrona] Nová poptávka ZL-${id} — ${sectionLabel} — ${data.name}`,
        html: adminEmailHtml(data, id),
        reply_to: data.email,
      });

      // 2. Potvrzení zákazníkovi (best-effort)
      try {
        await sendViaResend(env.RESEND_API_KEY, {
          from: env.FROM_EMAIL,
          to: [data.email],
          subject: `Potvrzení poptávky ZL-${id} — GeoDrona`,
          html: customerEmailHtml(data, id),
          reply_to: env.TARGET_EMAIL,
        });
      } catch (err) {
        console.error("Customer confirmation email failed:", err);
      }

      return Response.json({ ok: true, id }, { headers: cors });
    } catch (err) {
      console.error("Inquiry send failed:", err);
      return Response.json(
        { error: "E-mail se nepodařilo odeslat. Zkuste to prosím za chvíli, nebo nás kontaktujte přímo." },
        { status: 502, headers: cors },
      );
    }
  },
};