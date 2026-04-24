import React, { useState, useEffect, useRef } from 'react';

/* ============================================================
   CUSTOM HOOKS
   ============================================================ */

function useInView(threshold = 0.13) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          setVisible(true);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, dur = 2400) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useInView(0.4);
  const done = useRef(false);
  useEffect(() => {
    if (!visible || done.current) return;
    done.current = true;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, dur]);
  return [val, ref];
}

/* ============================================================
   ANIMATED BACKGROUND
   ============================================================ */

function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(145deg,#020811 0%,#030d1c 55%,#020810 100%)' }}
      />
      {/* Topographic SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.038 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="tp" x="0" y="0" width="320" height="240" patternUnits="userSpaceOnUse">
            <ellipse cx="160" cy="120" rx="148" ry="111" fill="none" stroke="#00cfff" strokeWidth="0.9" />
            <ellipse cx="160" cy="120" rx="112" ry="84"  fill="none" stroke="#00cfff" strokeWidth="0.9" />
            <ellipse cx="160" cy="120" rx="78"  ry="58"  fill="none" stroke="#00cfff" strokeWidth="0.9" />
            <ellipse cx="160" cy="120" rx="46"  ry="34"  fill="none" stroke="#00cfff" strokeWidth="1"   />
            <ellipse cx="160" cy="120" rx="18"  ry="13"  fill="none" stroke="#00cfff" strokeWidth="1.2" />
            <circle  cx="160" cy="120" r="3"            fill="#00cfff" opacity="0.7" />
            <line x1="0" y1="120" x2="320" y2="120" stroke="#00cfff" strokeWidth="0.4" opacity="0.4" />
            <line x1="160" y1="0" x2="160" y2="240" stroke="#00cfff" strokeWidth="0.4" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tp)" />
      </svg>
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,207,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.018) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />
      {/* Radial mask */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, #020811 75%)',
        }}
      />
      {/* Corner glows */}
      <div
        className="absolute -top-40 right-0 w-[750px] h-[750px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.055) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.055) 0%, transparent 65%)' }}
      />
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px animate-scan-line"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,207,255,0.18) 20%, rgba(0,207,255,0.35) 50%, rgba(0,207,255,0.18) 80%, transparent)',
          top: 0,
        }}
      />
    </div>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Jak to funguje', href: '#how' },
    { label: 'Služby', href: '#services' },
    { label: 'Geodeti', href: '#providers' },
    { label: 'Ceník', href: '#pricing' },
    { label: 'Ochrana', href: '#security' },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(2,8,17,0.92)] backdrop-blur-2xl border-b border-cyan-400/12 shadow-[0_8px_50px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/" className="flex flex-col leading-none group">
            <span className="font-syne text-[28px] font-black text-white tracking-tight group-hover:text-cyan-50 transition-colors">
              Geode<span className="text-cyan-400">ťák</span>
            </span>
            <span
              className="font-outfit text-[9px] tracking-[0.28em] uppercase mt-0.5"
              style={{ color: 'rgba(0,207,255,0.45)' }}
            >
              powered by GeoDrona.cz
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-outfit text-[13px] tracking-wide text-slate-400 hover:text-cyan-300 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="px-5 py-2.5 font-outfit text-[13px] font-medium text-slate-300 border border-slate-700/80 rounded-xl hover:border-cyan-400/40 hover:text-cyan-300 transition-all">
              Přihlásit se
            </button>
            <button className="btn-glow px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-outfit text-[13px] font-bold rounded-xl shadow-[0_4px_20px_rgba(0,207,255,0.28)]">
              Začít zdarma →
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? 'max-h-[400px] pb-6' : 'max-h-0'
          }`}
        >
          <div className="border-t border-slate-800/60 pt-4 space-y-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 px-2 font-outfit text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full py-3 border border-slate-700 rounded-xl font-outfit text-slate-300">
                Přihlásit se
              </button>
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-outfit font-bold">
                Začít zdarma →
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */

const HERO_WORDS = ['geodeta', 'skenéra', 'dronistu', 'kartografa', 'odborníka'];

function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % HERO_WORDS.length);
        setFade(true);
      }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-[72px] pb-20 overflow-hidden">
      {/* Center glow blob */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          className="w-[900px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,207,255,0.055) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-cyan-400/22 bg-cyan-400/[0.05] backdrop-blur-sm mb-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>
          <span className="font-outfit text-[12px] text-cyan-300 tracking-[0.2em] uppercase font-medium">
            Platforma č. 1 pro geodetické služby v ČR
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-syne font-black text-white leading-[0.9] mb-8 select-none">
          <div className="text-[52px] md:text-[72px] lg:text-[88px] mb-1">
            Najděte svého
          </div>
          <div
            className="text-[52px] md:text-[72px] lg:text-[88px] inline-block"
            style={{
              background: 'linear-gradient(135deg, #67e8f9, #22d3ee, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {HERO_WORDS[wordIdx]}
          </div>
          <div className="text-[38px] md:text-[58px] lg:text-[68px] text-slate-300 font-bold mt-2">
            během 5 minut.
          </div>
        </h1>

        {/* Sub */}
        <p className="font-outfit text-[18px] md:text-[22px] text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Geodeťák je první česká platforma propojující klienty s nejlepšími geodetickými
          firmami a specialisty.{' '}
          <span className="text-cyan-300 font-semibold">Bezpečně, rychle, výhodně.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-14">
          <button className="btn-glow group relative px-10 md:px-14 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[18px] md:text-[20px] font-black rounded-2xl font-syne shadow-[0_8px_40px_rgba(0,207,255,0.32)]">
            🏗️ Hledám geodeta — ZDARMA
          </button>
          <button className="btn-glow px-10 md:px-14 py-5 bg-white/[0.05] border-2 border-white/14 backdrop-blur-md text-white text-[18px] md:text-[20px] font-black rounded-2xl font-syne hover:border-cyan-400/45 hover:bg-cyan-400/[0.06]">
            📐 Jsem geodet / firma
          </button>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap items-center justify-center gap-5 font-outfit text-[13px] text-slate-500">
          {[
            ['✅', 'Registrace zdarma'],
            ['🔒', 'Escrow platby'],
            ['⚖️', 'Digitální smlouva'],
            ['⭐', 'Prověření odborníci'],
            ['⚡', 'Nabídky do 24 h'],
          ].map(([ico, txt]) => (
            <span key={txt} className="flex items-center gap-1.5">
              <span>{ico}</span> <span>{txt}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce z-10">
        <span className="font-outfit text-[10px] uppercase tracking-[0.2em]">Scrollujte</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

/* ============================================================
   STATS BAR
   ============================================================ */

function StatItem({ target, suffix, label }) {
  const [val, ref] = useCounter(target);
  return (
    <div ref={ref} className="text-center px-6 py-8">
      <div
        className="font-syne text-[52px] md:text-[60px] font-black leading-none"
        style={{
          background: 'linear-gradient(180deg, #67e8f9 0%, #22d3ee 60%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {val}{suffix}
      </div>
      <div className="font-outfit text-[15px] text-slate-400 mt-3">{label}</div>
    </div>
  );
}

function StatsBar() {
  return (
    <section className="py-2 border-y border-cyan-400/[0.08]" style={{ background: 'rgba(0,207,255,0.018)' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-cyan-400/[0.08]">
          <StatItem target={500}  suffix="+"  label="Prověřených odborníků"   />
          <StatItem target={2800} suffix="+"  label="Dokončených zakázek"      />
          <StatItem target={98}   suffix=" %" label="Spokojených klientů"      />
          <StatItem target={47}   suffix=" M" label="Ušetřeno klientům (Kč)"  />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */

const SERVICES = [
  { icon: '📐', title: 'Pozemkové zaměření', desc: 'Geodetické zaměření a vytyčení pozemků, parcel a hranic pro katastrální úřad.', tags: ['Katastr', 'Vytyčení', 'BPEJ'] },
  { icon: '🛰️', title: '3D laserové skenování', desc: 'Přesné 3D skenování budov, interiérů a průmyslových objektů — výstup mračna bodů, BIM.', tags: ['Point Cloud', 'BIM', 'Revize'] },
  { icon: '🚁', title: 'Drony & LiDAR mapování', desc: 'Letecká fotogrammetrie, LiDAR skenování terénu, digitální modely povrchu z UAV.', tags: ['Fotogrammetrie', 'DSM', 'Ortofoto'] },
  { icon: '🏗️', title: 'Inženýrská geodézie', desc: 'Zaměření sítí, výškové vytyčení staveb, dokumentace skutečného provedení stavby.', tags: ['Stavba', 'Sítě', 'DPS'] },
  { icon: '🗺️', title: 'Výškopis & polohopis', desc: 'Situační plány, výškopisné mapy, digitální modely terénu a tvorba podkladů pro projekt.', tags: ['DMT', 'Situace', 'Kontura'] },
  { icon: '📋', title: 'Katastr nemovitostí', desc: 'Geometrické plány, rozdělení pozemků, věcná břemena, reambulace, RÚIAN.', tags: ['GP', 'Věcná břemena', 'RÚIAN'] },
];

function ServiceCard({ svc, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="group glass-card card-hover rounded-2xl p-7 border border-slate-800/80 hover:border-cyan-400/30 hover:shadow-[0_12px_50px_rgba(0,207,255,0.09)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.04) 0%, transparent 60%)' }}
      />
      <div className="text-[40px] mb-5">{svc.icon}</div>
      <h3 className="font-syne text-[20px] font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">{svc.title}</h3>
      <p className="font-outfit text-[14px] text-slate-400 leading-relaxed mb-5">{svc.desc}</p>
      <div className="flex flex-wrap gap-2">
        {svc.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 text-[11px] text-cyan-400/75 border border-cyan-400/18 rounded-md font-outfit bg-cyan-400/[0.04]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  const [ref, visible] = useInView();
  return (
    <section id="services" className="py-32 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-18"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Co zprostředkujeme</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mb-6 mt-4">
            Všechny geodetické služby<br />
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              na jednom místě
            </span>
          </h2>
          <p className="font-outfit text-[18px] md:text-[20px] text-slate-400 max-w-2xl mx-auto">
            Od katastrálního zaměření po 3D skenování — najdeme vám ideálního odborníka na každou zakázku.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} svc={s} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */

const CLIENT_STEPS = [
  { n: '01', icon: '📝', title: 'Popište svůj projekt', desc: 'Vyplňte krátký formulář — typ práce, lokalita, termín. Žádná registrace předem není nutná.' },
  { n: '02', icon: '📬', title: 'Dostanete nabídky', desc: 'Do 24 hodin vám přijdou nabídky od prověřených odborníků. Porovnáte ceny i reference.' },
  { n: '03', icon: '✅', title: 'Vyberte a rezervujte', desc: 'Vyberete nejvhodnější nabídku. Platba jde přes Geodeťák — odborník ji dostane až po vašem souhlasu.' },
  { n: '04', icon: '🏆', title: 'Dílo hotovo, platba volná', desc: 'Po dokončení potvrdíte spokojenost — odborník dostane prostředky. Celé chráněno smlouvou.' },
];

const PROVIDER_STEPS = [
  { n: '01', icon: '🔐', title: 'Zaregistrujte se a ověřte', desc: 'Vytvořte profil, nahrajte oprávnění a certifikáty. Ověření trvá do 48 hodin.' },
  { n: '02', icon: '🎯', title: 'Prezentujte své služby', desc: 'Nastavte portfolio, ceník a region. Volitelně aktivujte Prémiové umístění pro víc zakázek.' },
  { n: '03', icon: '📥', title: 'Přijímejte poptávky', desc: 'Systém vám zasílá relevantní zakázky. Posílejte nabídky přímo v platformě — bez sdílení kontaktů.' },
  { n: '04', icon: '💳', title: 'Splňte a získejte platbu', desc: 'Po odsouhlasení klientem dostanete 93 % z hodnoty zakázky. Geodeťák si bere jen 7 %.' },
];

function StepCard({ step, delay, last }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {!last && (
        <div className="hidden lg:block absolute top-10 left-[55%] right-[-10%] h-px z-0"
          style={{ background: 'linear-gradient(90deg, rgba(0,207,255,0.22), transparent)' }}
        />
      )}
      <div className="relative z-10 glass-card rounded-2xl p-7 border border-slate-800/80 hover:border-cyan-400/25 transition-all duration-400 hover:shadow-[0_8px_30px_rgba(0,207,255,0.07)]">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
            style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.15), rgba(37,99,235,0.15))', border: '1px solid rgba(0,207,255,0.22)' }}>
            {step.icon}
          </div>
          <div className="font-syne text-[42px] font-black leading-none" style={{ color: 'rgba(0,207,255,0.14)' }}>{step.n}</div>
        </div>
        <h3 className="font-syne text-[18px] font-bold text-white mb-3">{step.title}</h3>
        <p className="font-outfit text-[14px] text-slate-400 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  const [tab, setTab] = useState('client');
  const [ref, visible] = useInView();
  const steps = tab === 'client' ? CLIENT_STEPS : PROVIDER_STEPS;

  return (
    <section id="how" className="py-32 px-5 lg:px-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,8,17,0.4), transparent)' }}>
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Jak Geodeťák funguje</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mb-10 mt-4">
            Jednoduché kroky,{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              skvělé výsledky
            </span>
          </h2>

          {/* Tab switcher */}
          <div
            className="inline-flex rounded-2xl p-1.5"
            style={{ background: 'rgba(13,21,38,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {[
              { id: 'client', label: '🏗️ Jsem klient' },
              { id: 'provider', label: '📐 Jsem geodet / firma' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-8 py-3.5 rounded-xl font-outfit font-semibold text-[14px] transition-all duration-300 ${
                  tab === t.id
                    ? 'text-white shadow-[0_4px_22px_rgba(0,207,255,0.28)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={
                  tab === t.id
                    ? { background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }
                    : {}
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <StepCard key={s.n + tab} step={s} delay={i * 100} last={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WHY US / BENEFITS
   ============================================================ */

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Ušetříte hodiny hledání',
    desc: 'Nemusíte obvolávat desítky firem. Nabídky přijdou za vámi — vše porovnáte na jednom místě.',
    grad: 'from-yellow-500/15 to-orange-500/15',
    border: 'border-yellow-500/18',
  },
  {
    icon: '💰',
    title: 'Nejlepší cena na trhu',
    desc: 'Konkurenční nabídky od více odborníků zaručují férovou tržní cenu — vždy.',
    grad: 'from-emerald-500/15 to-teal-500/15',
    border: 'border-emerald-500/18',
  },
  {
    icon: '🛡️',
    title: 'Platba pod ochranou',
    desc: 'Peníze uvolníme odborníkovi teprve po vašem potvrzení hotové práce. Nulové riziko.',
    grad: 'from-blue-500/15 to-indigo-500/15',
    border: 'border-blue-500/18',
  },
  {
    icon: '⭐',
    title: 'Prověření odborníci',
    desc: 'Každý geodet prochází ověřením oprávnění, pojistné smlouvy, referencí. Žádní amatéři.',
    grad: 'from-violet-500/15 to-purple-500/15',
    border: 'border-violet-500/18',
  },
];

function BenefitCard({ b, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`p-7 rounded-2xl border ${b.border} bg-gradient-to-br ${b.grad} backdrop-blur-sm card-hover hover:shadow-2xl`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      <div className="text-[42px] mb-5">{b.icon}</div>
      <h3 className="font-syne text-[20px] font-bold text-white mb-3">{b.title}</h3>
      <p className="font-outfit text-[14px] text-slate-300 leading-relaxed">{b.desc}</p>
    </div>
  );
}

function WhyUs() {
  const [ref, visible] = useInView();
  return (
    <section className="py-32 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Proč Geodeťák?</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mt-4">
            Výhody, které{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              pocítíte okamžitě
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b, i) => <BenefitCard key={b.title} b={b} delay={i * 90} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PHOTO GALLERY — glow frames
   ============================================================ */

const PHOTOS = [
  {
    bg: 'linear-gradient(135deg, #0d2740 0%, #0a3d62 50%, #1a5276 100%)',
    icon: '🛰️',
    label: 'LiDAR skenování lesa',
    desc: 'Jihočeský kraj, 240 ha',
    accent: '#22d3ee',
  },
  {
    bg: 'linear-gradient(135deg, #1a0d40 0%, #2e1a7a 50%, #3d2085 100%)',
    icon: '🏗️',
    label: 'Zaměření staveniště',
    desc: 'Praha 6, průmyslový objekt',
    accent: '#818cf8',
  },
  {
    bg: 'linear-gradient(135deg, #0d3320 0%, #14532d 50%, #166534 100%)',
    icon: '🗺️',
    label: 'Výškopisná mapa',
    desc: 'Beskydská oblast, DMT 1:5000',
    accent: '#4ade80',
  },
  {
    bg: 'linear-gradient(135deg, #3d1a00 0%, #7c2d12 50%, #9a3412 100%)',
    icon: '🚁',
    label: 'Ortofoto letecké snímkování',
    desc: 'Zemědělský areál, 580 ha',
    accent: '#fb923c',
  },
  {
    bg: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #1d4ed8 100%)',
    icon: '📋',
    label: 'Geometrický plán GP',
    desc: 'Katastr nemovitostí, Brno-venkov',
    accent: '#60a5fa',
  },
  {
    bg: 'linear-gradient(135deg, #1e0d2a 0%, #4c1d95 50%, #5b21b6 100%)',
    icon: '🛡️',
    label: '3D sken průmyslové haly',
    desc: 'BIM dokumentace, Ostrava',
    accent: '#c084fc',
  },
];

function PhotoCard({ ph, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="group cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl photo-glow transition-all duration-500"
        style={{ border: `1.5px solid ${ph.accent}30` }}
      >
        {/* Photo placeholder */}
        <div
          className="aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: ph.bg }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${ph.accent}15 1px, transparent 1px), linear-gradient(90deg, ${ph.accent}15 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
          {/* Radial spotlight */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full blur-2xl"
              style={{ background: `${ph.accent}18` }}
            />
          </div>
          <div className="relative z-10 text-[56px] mb-3 group-hover:scale-110 transition-transform duration-500">{ph.icon}</div>
          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl" style={{ borderColor: `${ph.accent}60` }} />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr" style={{ borderColor: `${ph.accent}60` }} />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl" style={{ borderColor: `${ph.accent}60` }} />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br" style={{ borderColor: `${ph.accent}60` }} />
          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: `linear-gradient(to top, ${ph.accent}20 0%, transparent 60%)` }} />
        </div>

        {/* Caption */}
        <div className="p-4" style={{ background: 'rgba(2,8,17,0.85)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-syne font-bold text-[14px] text-white">{ph.label}</div>
              <div className="font-outfit text-[12px] text-slate-500 mt-0.5">{ph.desc}</div>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${ph.accent}18`, border: `1px solid ${ph.accent}40` }}>
              <svg className="w-3 h-3" fill="none" stroke={ph.accent} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoGallery() {
  const [ref, visible] = useInView();
  return (
    <section className="py-32 px-5 lg:px-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,8,17,0.3), transparent)' }}>
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Ukázky realizací</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mt-4">
            Výsledky, které{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              mluví za vše
            </span>
          </h2>
          <p className="font-outfit text-[18px] text-slate-400 max-w-xl mx-auto mt-4">
            Přes Geodeťák zprostředkovávané zakázky — přesnost a kvalita na každém projektu.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHOTOS.map((p, i) => <PhotoCard key={p.label} ph={p} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURED PROVIDERS
   ============================================================ */

const PROVIDERS = [
  { name: 'GeoStar s.r.o.',     spec: 'Pozemkové zaměření & Katastr', rating: 4.9, reviews: 127, location: 'Praha & Středočeský kraj', premium: true,  tags: ['Katastr', 'GP', 'Vytyčení'], years: 12, grad: 'from-cyan-400 to-blue-600' },
  { name: 'Ing. Pavel Novák',   spec: '3D skenování & BIM',           rating: 5.0, reviews: 64,  location: 'Jihomoravský kraj',         premium: false, tags: ['3D scan', 'BIM', 'Revit'],  years: 8,  grad: 'from-violet-400 to-purple-600' },
  { name: 'DroneMap CZ',        spec: 'Drony, LiDAR & Fotogrammetrie',rating: 4.8, reviews: 89,  location: 'Celá ČR',                   premium: true,  tags: ['LiDAR', 'Ortofoto', 'DSM'], years: 5,  grad: 'from-emerald-400 to-teal-600' },
  { name: 'GEOPRO a.s.',        spec: 'Inženýrská geodézie & Stavba', rating: 4.9, reviews: 203, location: 'Moravskoslezský kraj',       premium: false, tags: ['Stavba', 'Sítě', 'DPS'],    years: 20, grad: 'from-rose-400 to-pink-600' },
];

function ProviderCard({ p, delay }) {
  const [ref, visible] = useInView();
  const initials = p.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={ref}
      className="group relative glass-card card-hover rounded-2xl border border-slate-800/80 overflow-hidden hover:border-cyan-400/28 hover:shadow-[0_16px_60px_rgba(0,207,255,0.10)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {p.premium && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 text-white text-[11px] font-bold font-outfit rounded-full shadow-[0_0_16px_rgba(251,191,36,0.35)]"
          style={{ background: 'linear-gradient(135deg, #eab308, #f97316)' }}>
          ⭐ PREMIUM
        </div>
      )}

      <div className="p-7">
        {/* Avatar */}
        <div className="relative mb-5 inline-block">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center text-white font-syne text-[22px] font-black photo-glow transition-all duration-500`}
          >
            {initials}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,207,255,0.5)]"
            style={{ background: '#06b6d4' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h3 className="font-syne text-[20px] font-bold text-white mb-1">{p.name}</h3>
        <p className="font-outfit text-[13px] text-cyan-400 mb-3">{p.spec}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400 text-[15px]">{'★'.repeat(Math.floor(p.rating))}</span>
          <span className="font-outfit font-bold text-white text-[14px]">{p.rating.toFixed(1)}</span>
          <span className="font-outfit text-slate-500 text-[13px]">({p.reviews} hodnocení)</span>
        </div>

        <div className="font-outfit text-[13px] text-slate-400 mb-4 space-y-1">
          <div>📍 {p.location}</div>
          <div>🏆 {p.years} let zkušeností</div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {p.tags.map((t) => (
            <span key={t} className="px-2.5 py-1 text-[11px] text-cyan-400/75 border border-cyan-400/18 rounded-md font-outfit bg-cyan-400/[0.04]">
              {t}
            </span>
          ))}
        </div>

        <button className="btn-glow w-full py-3 text-white font-outfit font-semibold text-[14px] rounded-xl shadow-[0_4px_16px_rgba(0,207,255,0.22)]"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
          Poptávka přes Geodeťák →
        </button>
        <p className="text-center font-outfit text-[11px] text-slate-600 mt-2">
          🔒 Přímý kontakt chráněn platformou
        </p>
      </div>
    </div>
  );
}

function FeaturedProviders() {
  const [ref, visible] = useInView();
  return (
    <section id="providers" className="py-32 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Doporučení odborníci</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mt-4">
            Prověření geodeti,{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              připraveni pro vás
            </span>
          </h2>
          <p className="font-outfit text-[18px] text-slate-400 max-w-xl mx-auto mt-4">
            Každý odborník prošel ověřením. Hodnocení jsou reálná od skutečných klientů.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROVIDERS.map((p, i) => <ProviderCard key={p.name} p={p} delay={i * 90} />)}
        </div>

        <div className="text-center mt-12">
          <button className="btn-glow px-10 py-4 border border-cyan-400/25 text-cyan-400 font-outfit font-semibold rounded-2xl hover:bg-cyan-400/[0.07] hover:border-cyan-400/50 transition-all">
            Zobrazit všechny odborníky →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PRICING
   ============================================================ */

function Pricing() {
  const [ref, visible] = useInView();
  return (
    <section id="pricing" className="py-32 px-5 lg:px-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,8,17,0.4), transparent)' }}>
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Transparentní ceník</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mt-4">
            Jednoduché,{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              férové podmínky
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Clients */}
          <PricingCard
            icon="🏗️"
            title="Pro klienty"
            priceLabel="ZDARMA"
            sub="navždy, bez poplatků"
            items={['Zadání poptávky zdarma', 'Porovnání všech nabídek', 'Chat přes platformu', 'Escrow platba zdarma', 'Hodnocení odborníka']}
            accentColor="#22d3ee"
            btn={{ label: 'Zadat poptávku', href: '#register' }}
          />
          {/* Providers */}
          <PricingCard
            icon="📐"
            title="Geodet / Firma"
            priceLabel="7 %"
            sub="z hodnoty zakázky"
            items={['Profil a prezentace zdarma', 'Příjem poptávek zdarma', 'Platba jen za realizaci', 'Podpora při sporech', 'Digitální smlouva']}
            accentColor="#22d3ee"
            btn={{ label: 'Registrovat se', href: '#register' }}
          />
          {/* Premium */}
          <PricingCard
            icon="⭐"
            title="Prémiové umístění"
            priceLabel="Top"
            sub="zobrazení výsledků"
            items={['1. místo ve výsledcích', 'Zvýrazněný profil ⭐', 'Preferované přiřazování', 'Analytika & statistiky', 'Prioritní podpora']}
            accentColor="#eab308"
            premium
            btn={{ label: 'Aktivovat prémiové →', href: '#register' }}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({ icon, title, priceLabel, sub, items, accentColor, premium, btn }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-8 overflow-hidden card-hover"
      style={{
        background: premium
          ? 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(249,115,22,0.05) 100%)'
          : 'rgba(13,21,38,0.6)',
        border: `1px solid ${accentColor}28`,
        backdropFilter: 'blur(16px)',
        boxShadow: premium ? `0 0 50px ${accentColor}12` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      <div className="text-[36px] mb-4">{icon}</div>
      <div className="font-syne text-[22px] font-bold text-white mb-3">{title}</div>
      <div
        className="font-syne text-[52px] font-black leading-none mb-1"
        style={{ color: accentColor }}
      >
        {priceLabel}
      </div>
      <div className="font-outfit text-[13px] text-slate-400 mb-6">{sub}</div>
      <ul className="space-y-3 mb-7">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-outfit text-[14px] text-slate-300">
            <span style={{ color: accentColor }} className="mt-0.5 shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <button
        className="btn-glow w-full py-3.5 text-white font-outfit font-bold text-[14px] rounded-xl"
        style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)` }}
      >
        {btn.label}
      </button>
    </div>
  );
}

/* ============================================================
   SECURITY / ANTI-ABUSE
   ============================================================ */

const PROTECTIONS = [
  { icon: '🔒', title: 'Maskované kontakty', desc: 'Telefony ani e-maily odborníků nejsou nikdy viditelné klientům a naopak. Veškerá komunikace probíhá přes šifrovanou platformu.' },
  { icon: '📄', title: 'Závazná digitální smlouva', desc: 'Každá zakázka je automaticky podložena digitální smlouvou. Domluva mimo platformu je porušením podmínek — vedoucím k trvalému zablokování.' },
  { icon: '💳', title: 'Escrow platby', desc: 'Platba klienta je uložena v zabezpečeném escrow. Odborník ji obdrží až po potvrzení dokončení — žádné riziko pro obě strany.' },
  { icon: '🚫', title: 'Anti-bypass monitoring', desc: 'AI systém automaticky detekuje pokusy o přímý kontakt (sdílení čísel, IČO, e-mailů v chatech). Porušovatelé jsou trvale zablokováni.' },
  { icon: '⚖️', title: 'Právní mediace sporů', desc: 'Geodeťák vstupuje jako mediátor s přístupem ke kompletní komunikaci. Smlouvy jsou právně závazné dokumenty.' },
  { icon: '✅', title: 'Ověření identity & oprávnění', desc: 'Každá firma a geodet prochází ověřením IČO, úředního oprávnění, pojistné smlouvy a min. 3 referencí. Falešné profily jsou odmítány.' },
];

function ProtectionCard({ p, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className="p-7 rounded-2xl glass-card border border-slate-800/70 hover:border-cyan-400/22 card-hover hover:shadow-[0_8px_30px_rgba(0,207,255,0.06)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="text-[34px] mb-4">{p.icon}</div>
      <h3 className="font-syne text-[18px] font-bold text-white mb-3">{p.title}</h3>
      <p className="font-outfit text-[14px] text-slate-400 leading-relaxed">{p.desc}</p>
    </div>
  );
}

function SecuritySection() {
  const [ref, visible] = useInView();
  return (
    <section id="security" className="py-32 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <SectionLabel>Ochrana platformy</SectionLabel>
          <h2 className="font-syne text-[40px] md:text-[58px] lg:text-[68px] font-black text-white leading-tight mt-4 mb-5">
            Žádné obcházení.{' '}
            <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Žádné podvody.
            </span>
          </h2>
          <p className="font-outfit text-[18px] md:text-[20px] text-slate-400 max-w-2xl mx-auto">
            Geodeťák chrání integritu celého ekosystému vícevrstvým systémem ochrany —
            férovost pro obě strany je základem naší platformy.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROTECTIONS.map((p, i) => <ProtectionCard key={p.title} p={p} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   REGISTER CTA
   ============================================================ */

function RegisterCTA() {
  const [ref, visible] = useInView();
  const [type, setType] = useState('client');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="register" className="py-32 px-5 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(13,21,38,0.95) 0%, rgba(7,14,30,0.98) 100%)',
            border: '1px solid rgba(0,207,255,0.18)',
            boxShadow: '0 24px 100px rgba(0,207,255,0.10)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.98)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* BG orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.09) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)' }} />

          <div className="relative z-10 p-10 md:p-16 text-center">
            <SectionLabel>Začněte ještě dnes</SectionLabel>
            <h2 className="font-syne text-[40px] md:text-[58px] font-black text-white leading-tight mt-4 mb-4">
              Staňte se součástí{' '}
              <span style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Geodeťáku
              </span>
            </h2>
            <p className="font-outfit text-[18px] text-slate-400 mb-10">
              Registrace je zdarma a trvá méně než 2 minuty.
            </p>

            {/* Type toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-2xl p-1.5" style={{ background: 'rgba(2,8,17,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { id: 'client',   label: '🏗️ Jsem klient'          },
                  { id: 'provider', label: '📐 Jsem geodet / firma' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`px-7 py-3 rounded-xl font-outfit font-semibold text-[14px] transition-all duration-300 ${
                      type === t.id ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    style={type === t.id ? { background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 4px 20px rgba(0,207,255,0.26)' } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="max-w-md mx-auto space-y-4">
              {[
                { key: 'name',  type: 'text',  ph: type === 'client' ? 'Vaše jméno nebo název firmy' : 'Jméno / Název firmy' },
                { key: 'email', type: 'email', ph: 'E-mailová adresa'               },
                { key: 'phone', type: 'tel',   ph: 'Telefonní číslo (nepovinné)'   },
              ].map((f) => (
                <input
                  key={f.key}
                  type={f.type}
                  placeholder={f.ph}
                  value={form[f.key]}
                  onChange={upd(f.key)}
                  className="w-full px-5 py-4 font-outfit text-[15px] text-white placeholder-slate-500 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(2,8,17,0.7)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid rgba(0,207,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,207,255,0.08)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                />
              ))}

              <button
                className="btn-glow w-full py-5 text-white font-syne font-black text-[18px] rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 8px 40px rgba(0,207,255,0.3)' }}
              >
                {type === 'client' ? '🏗️ Hledám geodeta — REGISTROVAT' : '📐 Nabízím služby — REGISTROVAT'}
              </button>
              <p className="font-outfit text-[12px] text-slate-600">
                Registrací souhlasíte s{' '}
                <span className="text-cyan-400 cursor-pointer hover:underline">Podmínkami použití</span> a{' '}
                <span className="text-cyan-400 cursor-pointer hover:underline">Zásadami soukromí</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */

const FAQS = [
  { q: 'Je Geodeťák pro klienty opravdu zdarma?',         a: 'Ano. Pro klienty je Geodeťák zcela bezplatný — od zadání poptávky přes výběr odborníka až po správu zakázky. Platíte pouze za samotné geodetické práce.' },
  { q: 'Jak je zajištěno, že odborník práci opravdu odvede?', a: 'Vaše platba je uložena v zabezpečeném escrow účtu a uvolní se teprve poté, co vy osobně potvrdíte spokojenost s prací. Geodeťák funguje jako bezpečný prostředník.' },
  { q: 'Může mě odborník kontaktovat přímo a obejít platformu?', a: 'Ne. Veškerá komunikace probíhá přes šifrovaný messaging platformy. Kontaktní údaje jsou automaticky skryty. Pokusy o přímý kontakt jsou detekovány AI systémem a vedou k trvalému zablokování.' },
  { q: 'Co je Prémiové umístění a jak funguje?',          a: 'Prémiové umístění zobrazuje profil odborníka na prvních místech relevantních výsledků, zvýrazňuje ho ikonou ⭐ a preferuje ho při automatickém přiřazování poptávek. Více informací v ceníku.' },
  { q: 'Jak probíhá ověření odborníků?',                  a: 'Každý geodet nebo firma musí doložit platné úřední oprávnění, pojistnou smlouvu a minimálně 3 reference. Tým Geodeťáku dokumenty prověřuje do 48 hodin.' },
  { q: 'Kdo stojí za Geodeťákem?',                        a: 'Geodeťák provozuje a zaštituje GeoDrona.cz — jeden z předních poskytovatelů geodetických a dronových služeb v ČR. Víme přesně, co geodeti i klienti potřebují.' },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  const [ref, visible] = useInView();
  return (
    <section className="py-32 px-5 lg:px-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,8,17,0.3), transparent)' }}>
      <div className="max-w-4xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <h2 className="font-syne text-[40px] md:text-[58px] font-black text-white mb-4">
            Časté dotazy
          </h2>
          <p className="font-outfit text-[18px] text-slate-400">Vše, co potřebujete vědět před startem.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-400/18 transition-all duration-300"
              style={{ background: 'rgba(13,21,38,0.55)' }}
            >
              <button
                className="w-full flex items-center justify-between p-6 md:p-7 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-syne font-bold text-white text-[17px] md:text-[19px] pr-4 leading-snug">{f.q}</span>
                <span
                  className="shrink-0 text-cyan-400 transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '300px' : '0' }}
              >
                <div className="px-6 md:px-7 pb-6 md:pb-7 font-outfit text-[15px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  const cols = [
    { title: 'Pro klienty',  links: ['Jak zadat poptávku', 'Bezpečné platby', 'Hodnocení odborníků', 'Časté dotazy'] },
    { title: 'Pro odborníky', links: ['Registrace geodeta', 'Prémiové umístění', 'Jak funguje provize', 'Pravidla & podmínky'] },
    { title: 'Společnost',    links: ['O nás', 'GeoDrona.cz', 'Kontakt', 'Zásady soukromí'] },
  ];

  return (
    <footer className="border-t border-slate-800/60 py-20 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          <div>
            <div className="font-syne text-[30px] font-black text-white mb-0.5">
              Geode<span className="text-cyan-400">ťák</span>
            </div>
            <div className="font-outfit text-[9px] tracking-[0.28em] uppercase mb-5" style={{ color: 'rgba(0,207,255,0.38)' }}>
              powered by GeoDrona.cz
            </div>
            <p className="font-outfit text-[14px] text-slate-500 leading-relaxed">
              První česká platforma zprostředkovávající geodetické a skenovací služby. Bezpečně, rychle, výhodně.
            </p>
            <div className="mt-6 flex gap-3">
              {['📘', '🐦', '📸', '▶️'].map((s) => (
                <button key={s} className="w-9 h-9 rounded-lg text-[16px] flex items-center justify-center hover:bg-cyan-400/10 transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="font-syne font-bold text-white text-[16px] mb-5">{c.title}</div>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="font-outfit text-[14px] text-slate-500 hover:text-cyan-400 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-outfit text-[13px] text-slate-600">
            © 2024 Geodeťák. Provozuje GeoDrona.cz. Všechna práva vyhrazena.
          </div>
          <div className="flex gap-6">
            {['Podmínky použití', 'Soukromí', 'Cookies'].map((l) => (
              <a key={l} href="#" className="font-outfit text-[13px] text-slate-600 hover:text-slate-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */

function ScrollToTop({ visible }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Zpět nahoru"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-xl text-white transition-all duration-400"
      style={{
        background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
        boxShadow: '0 4px 24px rgba(0,207,255,0.36)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="inline-block font-outfit text-[12px] text-cyan-400 tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
      style={{ border: '1px solid rgba(0,207,255,0.2)', background: 'rgba(0,207,255,0.05)' }}>
      {children}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10">
        <Navbar scrolled={scrolled} />
        <Hero />
        <StatsBar />
        <ServicesSection />
        <HowItWorks />
        <WhyUs />
        <PhotoGallery />
        <FeaturedProviders />
        <Pricing />
        <SecuritySection />
        <RegisterCTA />
        <FAQSection />
        <Footer />
      </div>
      <ScrollToTop visible={showTop} />
    </div>
  );
}
