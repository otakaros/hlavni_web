import { createFileRoute } from "@tanstack/react-router";
import { HeroSurveyBg } from "@/components/geo/HeroBg";
import { InquiryForm } from "@/components/geo/InquiryForm";
import { useRevealObserver } from "@/components/geo/Reveal";
import { useState } from "react";

export const Route = createFileRoute("/geodetika")({
  head: () => ({
    meta: [
      {
        title:
          "Geodetické služby Ostrava — Pasportizace, DTM, Geometrický plán | GeoDrona",
      },
      {
        name: "description",
        content:
          "Profesionální geodetické služby: pasportizace budov dle vyhl. 131/2024 Sb., 3D laserové skenování, BIM, vklady do DTM (GAD), geometrické plány, vytyčení staveb. Ostrava a MSK.",
      },
      {
        property: "og:title",
        content: "Geodetické služby — Pasportizace & DTM | GeoDrona",
      },
      {
        property: "og:description",
        content:
          "3D laserové skenování, pasportizace budov, vklady do DTM, geometrické plány, vytyčení. Ostrava a Moravskoslezský kraj.",
      },
      {
        property: "og:image",
        content: "/assets/hero-geodet.jpg",
      },
      {
        name: "twitter:image",
        content: "/assets/hero-geodet.jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Geodetika,
});

const introCards = [
  {
    num: "01",
    title: "Pasportizace budov",
    sub: "Povinná dokumentace objektu zahrnující důležité a aktuální informace včetně technického popisu a výkresů. Dle vyhlášky č. 131/2024 Sb. o dokumentaci staveb.",
    tags: ["3D Skenování", "Mračno bodů", "2D Výkresy", "BIM", "Legislativa"],
  },
  {
    num: "02",
    title: "Vklady do DTM",
    sub: "Geodetická aktualizační dokumentace (GAD) pro Digitální technickou mapu kraje. Povinné od 1. 7. 2024 při kolaudaci. Jsme autorizovanou firmou k vyhotovování i ověřování GAD.",
    tags: ["GAD", "Geometrický plán", "JVF / DMVS", "Autorizace", "Kolaudace"],
  },
  {
    num: "03",
    title: "Geometrické plány & vytyčení",
    sub: "Geometrické plány pro stavby, dělení pozemků, věcná břemena. Vytyčení hranic pozemků i staveb. Podklady pro projekty s ověřením AZI.",
    tags: ["GP", "Vytyčení", "S-JTSK", "Bpv", "AZI"],
  },
];

type GeoTab = "gp" | "vytyceni-hranic" | "podklad" | "vytyceni-stavby" | "dtm";

const geoPriceData: Record<
  GeoTab,
  {
    label: string;
    intro?: string;
    cards: { tier: string; name: string; desc: string; val: string; featured?: boolean }[];
    note?: string;
  }
> = {
  gp: {
    label: "Geometrický plán",
    intro:
      "V ceně je předání libovolného počtu originálů GP dle požadavků zákazníka (standardně 4–6 originálů). Složitější případy podléhají individuální kalkulaci.",
    cards: [
      {
        tier: "Vyznačení budovy",
        name: "Vyznačení budovy / změna obvodu",
        desc: "Běžný rodinný dům, garáž nebo přístavba. Cena za 1 budovu. Za každou další +1 000 Kč.",
        val: "6 000 Kč",
      },
      {
        tier: "Dělení pozemku",
        name: "Rozdělení pozemku bez sousedů",
        desc: "Jednoduché dělení – např. rozdělení na 2 části o daných výměrách nebo přikoupení části sousedního pozemku.",
        val: "6 000 Kč",
        featured: true,
      },
      {
        tier: "Dělení + sousedé",
        name: "Rozdělení pozemku se souhlasem sousedů",
        desc: "V oblastech, kde pozemky nebyly nikdy přesně zaměřeny, je nutná součinnost se sousedy (zpřesnění hranice nebo obeslání).",
        val: "7 000 Kč",
      },
      {
        tier: "Věcné břemeno",
        name: "Vyznačení věcného břemene",
        desc: "Běžné věcné břemeno vedení sítí (do cca 100 m délky u liniových břemen).",
        val: "5 000 Kč",
      },
      {
        tier: "Zpřesnění",
        name: "Průběh vlastníky zpřesněné hranice",
        desc: "Zpřesnění hranic pozemku běžné velikosti okolo 1 000 m².",
        val: "6 000 Kč",
      },
    ],
  },
  "vytyceni-hranic": {
    label: "Vytyčení hranic",
    intro:
      "Cena se odvíjí hlavně od dostupného mapového podkladu, velikosti pozemku, počtu lomových bodů a náročnosti terénu (např. hustá vegetace). Ceny platí pro běžné pozemky cca 1 000 m² a jednoduchý tvar.",
    cards: [
      {
        tier: "Souřadnice S-JTSK",
        name: "Pozemek daný souřadnicemi v S-JTSK",
        desc: "Pokud je váš pozemek přesně vymezen souřadnicemi (zjistíme), vytyčení je časově méně náročné a tedy levnější.",
        val: "4 000 Kč",
        featured: true,
      },
      {
        tier: "Starší podklady",
        name: "Pozemek dle starších podkladů",
        desc: "Pokud je váš pozemek určen jen na podkladě velmi starých plánů, je vytyčení časově náročnější a dražší.",
        val: "5 000 Kč",
      },
      {
        tier: "Protokol",
        name: "Vytyčovací protokol & přehlídka",
        desc: "Dle katastrálního zákona je třeba pro navazující právní úkony pozvat všechny vlastníky sousedních pozemků na přehlídku a sepsat protokol.",
        val: "2 500 Kč",
      },
    ],
    note:
      "V ceně je vyznačení bodů dřevěnými kolíky, železnými hřeby, sprejem nebo materiálem objednatele. Stabilizace certifikovanými hraničními znaky (mezníky s plast. hlavou a žel. nohou 50 cm) +200 Kč/bod.",
  },
  podklad: {
    label: "Podklad pro projekt",
    intro:
      "Standardní zaměření obsahuje výškové zaměření terénu a vyhotovení vrstevnic po 0,5 m, polohové zaměření pevných objektů (stavby, ploty, sítě, vzrostlé stromy). Předání v digitální formě (PDF + DWG/DGN).",
    cards: [
      {
        tier: "Malý rozsah",
        name: "Přehledné území do 1 000 m²",
        desc: "Území v rozsahu běžného pozemku k výstavbě, cca 1 000 m². Obsahuje zaměření přilehlé komunikace. Bez významného podílu zástavby/vegetace.",
        val: "5 500 Kč",
        featured: true,
      },
      {
        tier: "Zarostlé / zastavěné",
        name: "Zastavěné nebo zarostlé do 1 000 m²",
        desc: "Pozemek zastavěný budovou a dalšími objekty trvalého rázu nebo se vzrostlou vegetací (les). Obsahuje zaměření přilehlé komunikace.",
        val: "6 900 Kč",
      },
      {
        tier: "Střední",
        name: "Území 1 000 – 10 000 m²",
        desc: "Cena minimálně 6 000 Kč, za každých dalších 1 000 m² navýšení 1 000 – 3 000 Kč dle náročnosti.",
        val: "1 000–3 000 Kč",
      },
      {
        tier: "Velký rozsah",
        name: "Území nad 1 ha",
        desc: "Cena dle členitosti, vegetace a zástavby. Nejnižší hodnota platí pro přehledné území téměř bez stromů.",
        val: "7 000–25 000 Kč/ha",
      },
    ],
  },
  "vytyceni-stavby": {
    label: "Vytyčení stavby",
    intro:
      "Ceny zahrnují materiál na označení bodů příp. zajištění lavičkami. Při použití vlastního materiálu lze cenu snížit. Ke každému vytyčení je v ceně vytyčovací protokol pro stavební úřad.",
    cards: [
      {
        tier: "Základ",
        name: "Základní vytyčení objektu",
        desc: "Jednoduchý rodinný dům 4–10 bodů; vyznačení dřev. kolíky, žel. roxory nebo hřeby. Při vyšším počtu +200 Kč/bod.",
        val: "5 000 Kč",
      },
      {
        tier: "Zajištění",
        name: "Vytyčení se zajištěním / dvojí",
        desc: "Lomové body vytyčeny a zajištěny pomocí laviček nebo po vykopání základových pasů vytyčeny podruhé.",
        val: "8 500 Kč",
        featured: true,
      },
      {
        tier: "Rozsáhlé",
        name: "Stavby s 20+ body",
        desc: "Pro stavby s větším počtem bodů individuální ocenění dle počtu bodů a způsobu zajištění.",
        val: "200–300 Kč/bod",
      },
      {
        tier: "Pravidelné",
        name: "Pravidelné výjezdy na stavbu",
        desc: "Pro rozsáhlejší stavby kde je třeba častější vytyčování. 1 výjezd = 1–20 vyt. bodů.",
        val: "cca 4 000 Kč/výjezd",
      },
    ],
  },
  dtm: {
    label: "Zápis do DTM",
    intro:
      "Zaměření stavby dle požadavků vyhlášky, předání dokumentace na krajskou správu DTM. Zákazník obdrží protokol o přijetí záznamu do DTM s identifikátorem, který stavební úřad vyžaduje ke kolaudaci.",
    cards: [
      {
        tier: "Jednoduchá stavba",
        name: "RD, garáž apod.",
        desc: "Standardní zápis jednoduché stavby do DTM kraje. Zákazník obdrží protokol o přijetí včetně identifikátoru.",
        val: "5 000 Kč",
      },
      {
        tier: "DTM + GP",
        name: "Jednoduchá stavba s GP",
        desc: "Pokud je v rámci jedné zakázky vyhotoven i geometrický plán pro KN, doplatek za zápis do DTM je nižší.",
        val: "3 000 Kč",
        featured: true,
      },
      {
        tier: "Liniové",
        name: "Rozsáhlé / liniové stavby",
        desc: "Pro rozsáhlejší stavby (např. liniové) je nacenění individuální dle délky a složitosti.",
        val: "2 000–4 000 Kč /100 m",
      },
    ],
  },
};

function Geodetika() {
  useRevealObserver();
  const tabs: GeoTab[] = ["gp", "vytyceni-hranic", "podklad", "vytyceni-stavby", "dtm"];
  const [tab, setTab] = useState<GeoTab>("gp");
  const current = geoPriceData[tab];

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <HeroSurveyBg />
        <div className="hero-corner tl">
          GEODETICKÉ SLUŽBY
          <br />
          OSTRAVA, CZ · MSK
        </div>
        <div className="hero-corner br">
          AUTORIZOVANÁ FIRMA
          <br />
          DTM · GAD · BIM
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            GEODETICKÉ A DOKUMENTAČNÍ SLUŽBY
          </div>
          <h1 className="hero-h1">
            <span className="w1">GEODETICKÉ</span>
            <span className="w2">SLUŽBY MSK</span>
            <span className="w3">PASPORTIZACE · DTM · BIM · 3D SKENOVÁNÍ</span>
          </h1>
          <p className="hero-sub">
            Dokumentujeme, zaměřujeme a legalizujeme. Od pasportu stavby dle vyhlášky č. 131/2024 Sb. přes laserové 3D skenování až po geodetické aktualizační dokumentace pro DTM krajů.
          </p>
          <div className="hero-btns">
            <a href="#kontakt" className="btn-primary">
              Nezávazná poptávka →
            </a>
            <a href="#sluzby" className="btn-outline">
              Zjistit více
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-val">±2 mm</div>
              <div className="stat-label">Přesnost skeneru</div>
            </div>
            <div>
              <div className="stat-val">1:50</div>
              <div className="stat-label">Výkresová dok.</div>
            </div>
            <div>
              <div className="stat-val">3D</div>
              <div className="stat-label">Mračno + BIM</div>
            </div>
            <div>
              <div className="stat-val">GAD</div>
              <div className="stat-label">Autorizace DTM</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section" id="sluzby">
        <div className="wrap">
          <div className="section-eyebrow reveal">GEODETICKÉ SLUŽBY</div>
          <h2 className="section-title reveal">
            Komplexní dokumentace<br />od základu po střechu
          </h2>
          <p className="section-sub reveal">
            Pokrýváme celý životní cyklus stavby — od prvotní dokumentace přes legalizaci až po vklady do státních registrů. Vše v jedné firmě, se státní autorizací.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))",
              gap: 18,
              marginTop: 52,
            }}
          >
            {introCards.map((c, i) => (
              <div key={c.num} className={`service-card reveal d${i + 1}`}>
                <div className="service-num">{c.num}</div>
                <div className="service-name">{c.title}</div>
                <div className="service-desc">{c.sub}</div>
                <div className="tag-row">
                  {c.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASPORTIZACE */}
      <section className="section section-alt" id="pasportizace">
        <div className="wrap">
          <div className="section-eyebrow reveal">01 — PASPORTIZACE BUDOV</div>
          <h2 className="section-title reveal">
            Pasport stavby —<br />povinná dokumentace
          </h2>
          <p className="section-sub reveal">
            Pasport stavby je zjednodušená dokumentace skutečného stavu objektu. Soubor dokumentů popisující základní údaje o nemovitosti a její současný stav.
          </p>

          <div className="detail-block reveal">
            <div className="detail-block-title">Co pasport obsahuje</div>
            {[
              {
                t: "Průvodní zpráva",
                d: "Základní identifikační údaje o nemovitosti — vlastník, umístění, účel užívání, technické parametry.",
              },
              {
                t: "Souhrnná technická zpráva",
                d: "Detailní popis samotné stavby — konstrukční systém, použité materiály, technický stav.",
              },
              {
                t: "Zjednodušený situační výkres",
                d: "Zákres stavby do katastrální mapy — přesná poloha objektu v území.",
              },
              {
                t: "Zjednodušená výkresová dokumentace",
                d: "Půdorysy, řezy a pohledy v měřítku 1:50. Přesné podklady pro veškerá další řízení a projekty.",
              },
            ].map((it) => (
              <div key={it.t} className="detail-item">
                <div className="detail-dot" />
                <div>
                  <div className="detail-item-title">{it.t}</div>
                  <div className="detail-item-text">{it.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="law-banner reveal">
            <div className="law-banner-icon">⚖️</div>
            <div className="law-banner-text">
              Rozsah pasportu stavby je závazně vymezen{" "}
              <strong>vyhláškou č. 131/2024 Sb. o dokumentaci staveb (příloha 11)</strong>. Stavební zákon ukládá vlastníkovi stavby povinnost uchovávat dokumentaci odpovídající aktuálnímu stavu po celou dobu existence nemovitosti.
            </div>
          </div>
        </div>
      </section>

      {/* WHY 3D */}
      <section className="section">
        <div className="wrap">
          <div className="section-eyebrow reveal">TECHNOLOGIE</div>
          <h2 className="section-title reveal">
            Proč si pořídit<br />pasport ve 3D?
          </h2>
          <p className="section-sub reveal">
            Statické laserové skenování přináší nejpřesnější a nejkompletnější dokumentaci objektu. Přesnost ±2 mm, miliony bodů za sekundu.
          </p>

          <div className="services-grid">
            {[
              {
                num: "01 — PŘESNOST",
                t: "Nejmodernější technologie skenování",
                d: "Statické laserové skenery měří miliony bodů za sekundu s přesností ±2 mm. Husté detailní mračno bodů — kompletní digitální replika ve 3D.",
              },
              {
                num: "02 — UNIVERZÁLNOST",
                t: "Jeden sken, neomezené využití",
                d: "Z jednoho 3D mračna vytvoříme libovolné 2D výkresy, 3D modely i BIM. Žádné opakované zaměřování při každém novém projektu.",
              },
              {
                num: "03 — SEGMENTACE",
                t: "Inteligentní členění na části",
                d: "Mračno bodů rozdělíme na logické celky — budovy, patra, okna, dveře — a přiřadíme jim potřebné informace a atributy pro správu majetku.",
              },
              {
                num: "04 — EVIDENCE",
                t: "Správa a evidence vlastností",
                d: "U každého segmentu evidujeme podlaží, materiál, typ, stáří i stav. Propojení s BIM a CAFM systémy usnadňuje správu budov.",
              },
            ].map((c, i) => (
              <div key={c.num} className={`service-card reveal d${i + 1}`}>
                <div className="service-num">{c.num}</div>
                <div className="service-name">{c.t}</div>
                <div className="service-desc">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DTM */}
      <section className="section section-alt" id="dtm">
        <div className="wrap">
          <div className="section-eyebrow reveal">02 — DIGITÁLNÍ TECHNICKÁ MAPA</div>
          <h2 className="section-title reveal">
            Vklady do DTM —<br />povinné od 1. 7. 2024
          </h2>

          <div
            className="reveal"
            style={{
              marginTop: 28,
              padding: "30px 32px",
              background: "rgba(57,255,20,0.04)",
              border: "1px solid var(--geo-card-brd)",
              borderRadius: 14,
              boxShadow: "var(--geo-shadow-md)",
              fontSize: "1.05rem",
              color: "var(--geo-text2)",
              lineHeight: 1.75,
            }}
          >
            <p>
              <strong style={{ color: "#fff" }}>Digitální technická mapa (DTM) kraje</strong> je komplexní informační systém shromažďující data o dopravní a technické infrastruktuře. Od 1. 7. 2024 je při kolaudaci povinné doložit jak geometrický plán, tak geodetickou aktualizační dokumentaci (GAD).
            </p>
            <p style={{ marginTop: 14 }}>
              <strong style={{ color: "#fff" }}>GeoDrona s.r.o.</strong> splňuje veškerou odbornost k vyhotovování geodetických aktualizačních podkladů pro DTM. Vlastníme rovněž <strong style={{ color: "#fff" }}>autorizaci k ověřování GAD</strong>. Provádíme zaměření pro DTM společně s geometrickým plánem — úspora nákladů i času.
            </p>
          </div>

          <div className="services-grid" style={{ marginTop: 48 }}>
            {[
              { i: "🗺️", t: "Územní plánování", d: "Podrobný přehled o existující infrastruktuře a usnadnění plánování rozvoje území pro obce i kraje." },
              { i: "🏛️", t: "Příprava staveb", d: "Zjednodušení státní správy při povolování staveb a zajištění kompatibility s existující infrastrukturou." },
              { i: "🌿", t: "Životní prostředí", d: "Zdroj dat pro posuzování dopadů na životní prostředí a ochranu krajiny." },
              { i: "🔗", t: "Sdílení dat", d: "Centralizované sdílení dat o fyzické infrastruktuře mezi orgány — lepší koordinace a efektivita." },
            ].map((c, i) => (
              <div key={c.t} className={`service-card reveal d${i + 1}`}>
                <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{c.i}</div>
                <div className="service-name">{c.t}</div>
                <div className="service-desc">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CENÍK */}
      <section className="section" id="cenik">
        <div className="wrap">
          <div className="section-eyebrow reveal">CENÍK GEODETICKÝCH PRACÍ</div>
          <h2 className="section-title reveal">Ceny geodetických prací</h2>
          <p className="section-sub reveal">
            Orientační ceny běžně vykonávaných geodetických činností. U nejčastěji prováděných prací jsou uvedeny příklady složitosti a rozsahu. U rozsáhlejších zaměření nebo speciálních požadavků provádíme vždy individuální kalkulaci.
          </p>

          <div className="pricing-tabs reveal">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {geoPriceData[t].label}
              </button>
            ))}
          </div>

          {current.intro && (
            <p
              className="reveal"
              style={{
                color: "var(--geo-text2)",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 820,
              }}
            >
              {current.intro}
            </p>
          )}

          <div className="pricing-panel">
            {current.cards.map((c, i) => (
              <div key={i} className={`price-card ${c.featured ? "featured" : ""} reveal`}>
                <div className="price-tier">{c.tier}</div>
                <div className="price-name">{c.name}</div>
                <div className="price-desc">{c.desc}</div>
                <div className="price-val">{c.val}</div>
              </div>
            ))}
          </div>

          {current.note && <div className="price-note reveal">{current.note}</div>}
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="section section-alt">
        <div className="wrap">
          <div
            className="reveal"
            style={{
              padding: "48px 44px",
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(57,255,20,0.08), rgba(57,255,20,0.02))",
              border: "1px solid rgba(57,255,20,0.25)",
              boxShadow: "var(--geo-shadow-glow)",
              textAlign: "center",
            }}
          >
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#fff", marginBottom: 14, letterSpacing: "0.04em" }}>
              Autorizovaná firma pro DTM v MSK
            </h2>
            <p style={{ color: "var(--geo-text2)", fontSize: "1.05rem", maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
              Splňujeme veškerou odbornost k vyhotovování i ověřování geodetické aktualizační dokumentace DTM. Šetříme vám čas i peníze — geometrický plán a zaměření pro DTM realizujeme v jedné návštěvě.
            </p>
            <div className="tag-row" style={{ justifyContent: "center", marginTop: 24 }}>
              {[
                "Autorizovaný geodet (AZI)",
                "GAD ověřování",
                "Geometrický plán",
                "JVF / DMVS",
                "BIM modely",
                "Laserové skenování",
                "Ostrava & MSK",
              ].map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="kontakt">
        <div className="wrap">
          <div className="section-eyebrow reveal">KONTAKT</div>
          <h2 className="section-title reveal">
            Poptejte geodetické<br />služby
          </h2>
          <p className="section-sub reveal" style={{ marginBottom: 48 }}>
            Vyplňte poptávkový formulář — odpovíme do 24 hodin s nezávaznou nabídkou.
          </p>
          <div className="form-grid">
            <InquiryForm variant="geo" />
          </div>
        </div>
      </section>
    </>
  );
}