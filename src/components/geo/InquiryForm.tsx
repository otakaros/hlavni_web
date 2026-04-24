import { useState, type FormEvent } from "react";

export type FormVariant = "drone" | "geo";

const droneServices = [
  "Termovize – exteriér (úniky tepla)",
  "Termovize – interiér",
  "Kontrola FVE panelů",
  "Inspekce výškových objektů",
  "Průsaky plochých střech",
  "Fotogrammetrie / 3D skenování",
  "Objemová analýza kubatur",
  "Letecké foto / video",
  "Hledání zvěře / monitoring",
  "Pátrání – pohřešovaná osoba",
  "Jiné",
];

const geoServices = [
  "Geometrický plán – vyznačení budovy",
  "Geometrický plán – rozdělení pozemku",
  "Geometrický plán – věcné břemeno",
  "Geometrický plán – průběh hranice",
  "Vytyčení hranice pozemku",
  "Vytyčovací protokol a přehlídka hranic",
  "Podklad pro projekt",
  "Vytyčení stavby",
  "Zápis do DTM (GAD)",
  "Pasportizace budovy",
  "3D laserové skenování / BIM",
  "Jiné – konzultace",
];

const objectTypes = [
  "Rodinný dům",
  "Bytový dům",
  "Průmyslová hala",
  "Kancelářský objekt",
  "Staveniště / pozemek",
  "Lom / skládka materiálu",
  "FVE elektrárna",
  "Výškový objekt / stožár",
  "Jiné",
];

export function InquiryForm({ variant }: { variant: FormVariant }) {
  const services = variant === "geo" ? geoServices : droneServices;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg(null);
    const data = new FormData(e.currentTarget);
    const required = ["name", "phone", "email", "service", "location"];
    for (const r of required) {
      if (!String(data.get(r) ?? "").trim()) {
        setErrorMsg("Vyplňte prosím povinná pole označená *");
        return;
      }
    }

    const get = (k: string) => String(data.get(k) ?? "").trim();
    const payload: Record<string, string> = {
      variant,
      name: get("name"),
      company: get("company"),
      phone: get("phone"),
      email: get("email"),
      service: get("service"),
      location: get("location"),
      objtype: get("objtype"),
      area: get("area"),
      date: get("date"),
      budget: get("budget"),
      notes: get("notes"),
    };
    if (variant === "geo") payload.parcel = get("parcel");

    setSubmitting(true);
    try {
      const endpoint =
        (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) ||
        "/api/public/inquiry";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(json.error || "Odeslání selhalo. Zkuste to prosím znovu.");
        setSubmitting(false);
        return;
      }
      setRefId(json.id ?? null);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Síťová chyba. Zkontrolujte připojení a zkuste to znovu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-wrap reveal" style={{ textAlign: "center" }}>
        <div className="form-title" style={{ color: "var(--geo-accent)" }}>
          ✓ Poptávka odeslána
        </div>
        <div className="form-sub">
          Děkujeme{refId ? ` — vaše referenční číslo je ZL-${refId}` : ""}. Potvrzení jsme vám poslali e-mailem. Ozveme se do 24 hodin.
        </div>
        <button
          type="button"
          className="btn-outline"
          style={{ marginTop: 18 }}
          onClick={() => {
            setSubmitted(false);
            setRefId(null);
          }}
        >
          Odeslat další poptávku
        </button>
      </div>
    );
  }

  return (
    <form className="form-wrap reveal" onSubmit={onSubmit}>
      <div className="form-title">Poptávkový formulář</div>
      <div className="form-sub">
        Vyplňte co nejvíce polí pro přesnou nabídku. Odpovíme do 24 hodin, zdarma a bez závazku.
      </div>

      <div className="field-group">
        <label className="field-label">
          Služba <span className="field-required">*</span>
        </label>
        <select className="field-select" name="service" required defaultValue="">
          <option value="" disabled>
            — Vyberte službu —
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">
            Jméno <span className="field-required">*</span>
          </label>
          <input className="field-input" type="text" name="name" placeholder="Jan Novák" required />
        </div>
        <div className="field-group">
          <label className="field-label">Společnost</label>
          <input className="field-input" type="text" name="company" placeholder="Novák s.r.o." />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">
            Telefon <span className="field-required">*</span>
          </label>
          <input className="field-input" type="tel" name="phone" placeholder="+420 777 000 000" required />
        </div>
        <div className="field-group">
          <label className="field-label">
            E-mail <span className="field-required">*</span>
          </label>
          <input className="field-input" type="email" name="email" placeholder="jan@firma.cz" required />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">
          Lokalita / adresa objektu <span className="field-required">*</span>
        </label>
        <input
          className="field-input"
          type="text"
          name="location"
          placeholder="Ostrava-Poruba, ul. Nádražní 12"
          required
        />
      </div>

      {variant === "geo" && (
        <div className="field-group">
          <label className="field-label">
            Parcelní číslo <span className="field-optional">(nepovinné)</span>
          </label>
          <input
            className="field-input"
            type="text"
            name="parcel"
            placeholder="např. 1234/5, k. ú. Ostrava-Poruba"
          />
        </div>
      )}

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Typ objektu</label>
          <select className="field-select" name="objtype" defaultValue="">
            <option value="">— Typ objektu —</option>
            {objectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Rozsah / plocha</label>
          <input
            className="field-input"
            type="text"
            name="area"
            placeholder={variant === "geo" ? "cca 1 000 m², 2 budovy..." : "cca 500 m², 2 km trasy..."}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Požadovaný termín</label>
          <input className="field-input" type="text" name="date" placeholder="ASAP / do 30. 6." />
        </div>
        <div className="field-group">
          <label className="field-label">Rozpočet</label>
          <select className="field-select" name="budget" defaultValue="">
            <option value="">— Orientační —</option>
            <option>do 5 000 Kč</option>
            <option>5 000 – 15 000 Kč</option>
            <option>15 000 – 50 000 Kč</option>
            <option>nad 50 000 Kč</option>
            <option>Dle nabídky</option>
          </select>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Poznámky / popis zakázky</label>
        <textarea
          className="field-textarea"
          name="notes"
          placeholder="Popište co nejpřesněji co potřebujete, zvláštní podmínky, přístup k objektu apod."
        />
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#fca5a5",
            fontSize: "0.92rem",
            marginTop: 4,
          }}
          role="alert"
        >
          {errorMsg}
        </div>
      )}
      <button type="submit" className="btn-primary form-submit" disabled={submitting}>
        {submitting ? "Odesílám…" : "Odeslat poptávku →"}
      </button>
      <div className="form-note">Odpovíme do 24 hodin. Bez závazku, zdarma.</div>
    </form>
  );
}