import { createFileRoute } from "@tanstack/react-router";
import { HeroTopoBg } from "@/components/geo/HeroBg";
import { Faq } from "@/components/geo/Faq";
import { InquiryForm } from "@/components/geo/InquiryForm";
import { useRevealObserver } from "@/components/geo/Reveal";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "GeoDrona — Dronové služby Ostrava | Termovize, 3D skenování, FVE",
      },
      {
        name: "description",
        content:
          "Profesionální dronové služby v MSK. Termovize, 3D laserové skenování, fotogrammetrie, FVE inspekce, kubatury, foto a video. Ověřené AZI, RTK přesnost ±1 cm.",
      },
      {
        property: "og:title",
        content: "GeoDrona — Dronové služby MSK | Termovize, 3D, FVE",
      },
      {
        property: "og:description",
        content:
          "Termovize, 3D skenování, fotogrammetrie a inspekce drony. Ostrava a Moravskoslezský kraj.",
      },
      {
        property: "og:image",
        content: "/assets/hero-drone.jpg",
      },
      {
        name: "twitter:image",
        content: "/assets/hero-drone.jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Index,
});

const services = [
  {
    num: "01",
    name: "Termovize & tepelné úniky",
    desc: "Odhalení úniků tepla, kontrola izolací, FVE panelů i plochých střech. Certifikovaný protokol s razítkem diagnostika.",
  },
  {
    num: "02",
    name: "Fotogrammetrie & 3D skenování",
    desc: "Přesné 3D modely, mračno bodů, ortofotomapy a výškové modely terénu. Výstupy pro CAD, BIM a GIS – centimetrová přesnost.",
  },
  {
    num: "03",
    name: "Objemová analýza kubatur",
    desc: "Měsíční fakturace staveb, výpočet objemů výkopů, násypů a zásob. Výsledky ověřené AZI, vhodné pro fakturaci. 1 km za 20 min.",
  },
  {
    num: "04",
    name: "Kontrola FVE panelů",
    desc: "Termovizní inspekce solárních panelů – odhalení přehřívání, vadných článků, stínění. Protokol pro pojišťovnu či reklamaci.",
  },
  {
    num: "05",
    name: "Inspekce výškových objektů",
    desc: "Fasády, střechy, komíny, stožáry, rozhledny – bez lešení a horolezecké techniky. Vizuální i termovizní výstup, vhodné pro revize.",
  },
  {
    num: "06",
    name: "Foto, video & postprodukce",
    desc: "Propagační záběry z dronu, realitní snímky, časosběrná videa, kompletní střih a barevné korekce.",
  },
];

const steps = [
  {
    n: "1",
    t: "Konzultace",
    txt: "Vyplníte poptávkový formulář nebo nás kontaktujete. Domluvíme se na lokalitě, rozsahu a požadovaném výstupu.",
  },
  {
    n: "2",
    t: "Let & snímkování",
    txt: "Dron DJI Matrice 4T s RTK, termovizní nebo fotogrammetrickou kamerou přesně zaznamenává každý detail.",
  },
  {
    n: "3",
    t: "Zpracování dat",
    txt: "Během 1–2 pracovních dnů zpracujeme data v profesionálním softwaru (Reality Capture, Agisoft).",
  },
  {
    n: "4",
    t: "Předání výsledků",
    txt: "Data dostanete ve formátech OBJ, STL, DXF, LAS, TIFF — připravená pro váš CAD, GIS nebo BIM systém.",
  },
];

type PriceTab = "termovize" | "fve" | "inspekce" | "3d" | "objem" | "media";

const priceData: Record<
  PriceTab,
  { label: string; cards: { tier: string; name: string; desc: string; val: string; featured?: boolean }[] }
> = {
  termovize: {
    label: "Termovize",
    cards: [
      { tier: "Základní", name: "Exteriér – Základní", desc: "Měření dronem nebo ruční termokamerou + zjednodušený slovní popis + termosnímky.", val: "od 1 900 Kč" },
      { tier: "Rozšířená", name: "Exteriér – S protokolem", desc: "Kompletní měření + oficiální protokol s razítkem certifikovaného technika diagnostika.", val: "od 4 200 Kč", featured: true },
      { tier: "Interiér", name: "Interiér – Informativní", desc: "Vhodné pro byty a RD. Slovní popis při měření za přítomnosti zákazníka, ukázka na displeji.", val: "od 1 900 Kč" },
      { tier: "Interiér – Protokol", name: "Interiér – Protokol", desc: "Certifikovaný protokol vhodný pro reklamace a doložení stavu budovy.", val: "od 3 400 Kč" },
      { tier: "Speciální", name: "Průmysl & Bytové domy", desc: "Průmyslové haly, administrativní budovy, hotely – individuální plán a komplexní zpráva.", val: "Na dotaz" },
    ],
  },
  fve: {
    label: "FVE panely",
    cards: [
      { tier: "Rodinný dům", name: "FVE do 10 kWp", desc: "Termovizní inspekce s možností protokolu za 1 500 Kč. Přesná lokalizace vadných článků.", val: "od 1 900 Kč" },
      { tier: "Komerční", name: "FVE nad 10 kWp", desc: "Komerční budova s FVE, možnost protokolu od 1 900 Kč. Pravidelný monitoring dle dohody.", val: "od 3 600 Kč", featured: true },
      { tier: "Solární parky", name: "Rozsáhlé FVE", desc: "Letecké termovizní snímky velkých parků, přesná lokalizace závad, dlouhodobý monitoring.", val: "Na dotaz" },
    ],
  },
  inspekce: {
    label: "Inspekce objektů",
    cards: [
      { tier: "Základní audit", name: "Vizuální přehled", desc: "Fotodokumentace z výšky, stručný report zjevných poškození fasád, střech a konstrukcí.", val: "od 4 900 Kč" },
      { tier: "Detailní", name: "Detailní inspekce", desc: "Video záběry + detailní snímky rizikových míst (sváry, kotvení), HD videozáznam.", val: "od 8 500 Kč", featured: true },
      { tier: "Komplex", name: "Komplex + Termovize", desc: "Video, detailní snímky, termovizní záběry, celkový report pro speciální stavby.", val: "od 13 500 Kč" },
      { tier: "Ploché střechy", name: "Průsaky – Menší objekty", desc: "Letecké termografické snímky, report nalezených anomálií průniku vody.", val: "od 5 200 Kč" },
      { tier: "Průmyslové haly", name: "Průsaky – Velké objekty", desc: "Větší objekty a průmyslové haly, letecké termografické snímky + report anomálií.", val: "od 10 900 Kč" },
    ],
  },
  "3d": {
    label: "Fotogrammetrie & 3D",
    cards: [
      { tier: "3D model", name: "Jednoduchý 3D model", desc: "Malé i velké objekty. Exportovaný model nebo originální mračno bodů ve zvoleném formátu.", val: "od 4 900 Kč" },
      { tier: "RTK Měření", name: "Zaměřování s RTK", desc: "Délky stran, plocha pozemku, výškový profil, rozměry střechy pro FVE projektování. Přesnost 1–2 cm.", val: "od 1 900 Kč", featured: true },
      { tier: "Ortofotomapa", name: "Velkoplošný snímek", desc: "Aktuální ortofotomapa z ptačí perspektivy, georeferencované výstupy.", val: "Na dotaz" },
    ],
  },
  objem: {
    label: "Kubatury",
    cards: [
      { tier: "Jednorázové", name: "Měření objemů", desc: "Výpočet objemu 4 hromad + report. Každá další hromada +290 Kč. Ověřeno AZI pro fakturaci.", val: "od 2 500 Kč" },
      { tier: "Pravidelné", name: "Kvartální monitoring", desc: "Kvartální měření (cena za jedno měření, min. 1 rok). Při častějším měření individuální cena.", val: "od 1 900 Kč", featured: true },
      { tier: "Stavební", name: "Stavební výkopy", desc: "Zaměření výkopů, kontrola spádu, měření vykopané zeminy a materiálu.", val: "od 1 900 Kč" },
    ],
  },
  media: {
    label: "Foto & Video",
    cards: [
      { tier: "Foto", name: "Foto balíček", desc: "8 snímků + základní úprava barev a expozice. Každý další snímek +290 Kč.", val: "od 3 900 Kč" },
      { tier: "Video", name: "Video balíček", desc: "Video do 2 minut, střih + barevná korekce. Delší videa nebo celodenní sestřihy individuálně.", val: "od 6 900 Kč", featured: true },
      { tier: "Realitní", name: "Realitní snímky", desc: "Komplet pro realitní inzerát – exteriér, interiér, letecký záběr, půdorys.", val: "od 4 500 Kč" },
    ],
  },
};

const faqItems = [
  {
    q: "Jak přesné jsou výstupy fotogrammetrie a 3D skenování?",
    a: "Díky RTK technologii a pokročilému softwaru dosahujeme přesnosti v řádu 1–2 cm. Výstupy jsou vhodné pro technické dokumentace, plánování staveb i fakturaci. Výpočty kubatur jsou ověřené AZI.",
  },
  {
    q: "Jak dlouho trvá let a zpracování dat?",
    a: "Let dronem obvykle trvá 20–60 minut podle velikosti a členitosti oblasti. Zpracování dat a tvorba výstupů pak 1–2 pracovní dny. U rodinných domů pro termovizi počítejte s 40–90 minutami na místě.",
  },
  {
    q: "Jaké formáty dat mohu získat?",
    a: "Dodáváme OBJ, STL, DXF, LAS, TIFF, JPG, PDF — dle potřeby a typu projektu. Data jsou kompatibilní s CAD, GIS a BIM systémy.",
  },
  {
    q: "Co když je špatné počasí?",
    a: "Bezpečnost je prioritou. Při silném větru, dešti nebo snížené viditelnosti inspekci přesuneme na jiný termín bez dalších poplatků.",
  },
  {
    q: "Jak vysoko může dron létat?",
    a: "Do 120 m nad zemí lze na většině míst létat bez omezení. Pro větší výšky nebo chráněné lokality zajistíme potřebné povolení u Úřadu pro civilní letectví.",
  },
  {
    q: "Je nutná termografická inspekce FVE ze zákona?",
    a: "Ne, není zákonem předepsána, ale je silně doporučována odborníky, pojišťovnami i výrobci panelů jako preventivní nástroj a podklad pro reklamace nebo optimalizaci výkonu.",
  },
  {
    q: "Je nutná příprava budovy před termovizní inspekcí?",
    a: "Ano — den před měřením je nutné budovu stabilně zahřát. Hodinu před samotným měřením topení vypněte, aby vznikl teplotní gradient.",
  },
];

function Index() {
  useRevealObserver();
  const [tab, setTab] = useState<PriceTab>("termovize");
  const tabs: PriceTab[] = ["termovize", "fve", "inspekce", "3d", "objem", "media"];

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <HeroTopoBg />
        <div className="hero-corner tl">
          49.8209° N · 18.2625° E
          <br />
          OSTRAVA, CZ · MSK
        </div>
        <div className="hero-corner br">
          GEODRONA.CZ
          <br />
          PRO LICENCE A2
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DRONOVÉ SLUŽBY MSK & OKOLÍ
          </div>
          <h1 className="hero-h1">
            <span className="w1">VIDÍME</span>
            <span className="w2">VÁŠ SVĚT</span>
            <span className="w3">ZE VZDUCHU</span>
          </h1>
          <p className="hero-sub">
            Termovize, 3D skenování, fotogrammetrie, inspekce a monitoring – přesně a rychle. Pokrýváme Ostrava, Opava, Olomouc a přeshraniční oblast Polska.
          </p>
          <div className="hero-btns">
            <a href="#kontakt" className="btn-primary">
              Nezávazná poptávka →
            </a>
            <a href="#sluzby" className="btn-outline">
              Prohlédnout služby
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-val">20 min</div>
              <div className="stat-label">1 km stavby</div>
            </div>
            <div>
              <div className="stat-val">±1 cm</div>
              <div className="stat-label">Přesnost RTK</div>
            </div>
            <div>
              <div className="stat-val">1–2 dny</div>
              <div className="stat-label">Zpracování dat</div>
            </div>
            <div>
              <div className="stat-val">300–500</div>
              <div className="stat-label">Bodů na m²</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="sluzby">
        <div className="wrap">
          <div className="section-eyebrow reveal">CO NABÍZÍME</div>
          <h2 className="section-title reveal">
            Komplexní dronové služby<br />na jednom místě
          </h2>
          <p className="section-sub reveal">
            Od termovize přes 3D skenování až po záchranné operace. Každou zakázku řešíme s maximální přesností a rychlostí.
          </p>

          <div className="services-grid">
            {services.map((s, i) => (
              <a
                key={s.num}
                href="#kontakt"
                className={`service-card reveal d${(i % 4) + 1}`}
              >
                <div className="service-num">{s.num}</div>
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-arrow">Více info →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-alt" id="postup">
        <div className="wrap">
          <div className="section-eyebrow reveal">JAK FUNGUJEME</div>
          <h2 className="section-title reveal">Postup spolupráce</h2>
          <p className="section-sub reveal">
            Jednoduchý čtyřkrokový proces od prvního kontaktu až po předání výsledků.
          </p>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.n} className={`step reveal d${i + 1}`}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <div className="step-text">{s.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="cenik">
        <div className="wrap">
          <div className="section-eyebrow reveal">CENÍK</div>
          <h2 className="section-title reveal">Transparentní ceny</h2>
          <p className="section-sub reveal">
            Přehledné balíčky bez skrytých poplatků. U nestandardních zakázek vždy individuální nabídka.
          </p>

          <div className="pricing-tabs reveal">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {priceData[t].label}
              </button>
            ))}
          </div>

          <div className="pricing-panel">
            {priceData[tab].cards.map((c, i) => (
              <div key={i} className={`price-card ${c.featured ? "featured" : ""} reveal`}>
                <div className="price-tier">{c.tier}</div>
                <div className="price-name">{c.name}</div>
                <div className="price-desc">{c.desc}</div>
                <div className="price-val">{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGION */}
      <section className="section section-alt" id="region">
        <div className="wrap">
          <div className="section-eyebrow reveal">OBLAST PŮSOBENÍ</div>
          <h2 className="section-title reveal">
            Moravskoslezský kraj<br />& okolí
          </h2>
          <p className="section-sub reveal">
            Primárně pokrýváme Ostravsko a Opavsko, jsme mobilní po celém MSK, dostaneme se do Olomouce i přes hranice do části Polska.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 14,
              marginTop: 40,
            }}
          >
            {[
              { name: "OSTRAVA", note: "Hlavní základna", primary: true },
              { name: "OPAVA", note: "Pravidelně", primary: true },
              { name: "OLOMOUC", note: "Na dotaz" },
              { name: "PŘESHRANIČNÍ PL", note: "Na dotaz" },
            ].map((c) => (
              <div
                key={c.name}
                className="reveal"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 22px",
                  background: "rgba(57,255,20,0.035)",
                  border: "1px solid var(--geo-card-brd)",
                  borderRadius: 12,
                  boxShadow: "var(--geo-shadow-md)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c.primary ? "var(--geo-accent)" : "var(--geo-text2)",
                    boxShadow: c.primary ? "0 0 12px var(--geo-accent)" : "none",
                  }}
                />
                <div className="display" style={{ fontSize: "1.2rem", color: c.primary ? "#fff" : "var(--geo-text2)" }}>
                  {c.name}
                </div>
                <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--geo-text2)" }}>{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-eyebrow reveal">ČASTÉ DOTAZY</div>
          <h2 className="section-title reveal">Nejčastější otázky</h2>
          <Faq items={faqItems} />
        </div>
      </section>

      {/* CONTACT */}
      <section className="section section-alt" id="kontakt">
        <div className="wrap">
          <div className="section-eyebrow reveal">KONTAKT</div>
          <h2 className="section-title reveal">Nezávazná poptávka</h2>
          <p className="section-sub reveal" style={{ marginBottom: 48 }}>
            Vyplňte poptávkový formulář — odpovíme do 24 hodin s nezávaznou nabídkou. Zdarma a bez závazku.
          </p>
          <div className="form-grid">
            <InquiryForm variant="drone" />
          </div>
        </div>
      </section>
    </>
  );
}
