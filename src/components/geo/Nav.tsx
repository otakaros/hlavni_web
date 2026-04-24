import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

type NavLinkItem = { href: string; label: string; cta?: boolean };

const dronLinks: NavLinkItem[] = [
  { href: "#sluzby", label: "Služby" },
  { href: "#postup", label: "Jak fungujeme" },
  { href: "#cenik", label: "Ceník" },
  { href: "#region", label: "Oblast" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Poptávka", cta: true },
];

const geoLinks: NavLinkItem[] = [
  { href: "#sluzby", label: "Služby" },
  { href: "#pasportizace", label: "Pasportizace" },
  { href: "#dtm", label: "DTM" },
  { href: "#cenik", label: "Ceník" },
  { href: "#kontakt", label: "Poptávka", cta: true },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isGeo = location.pathname.startsWith("/geodetika");
  const links = isGeo ? geoLinks : dronLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const Switcher = ({ inMobile = false }: { inMobile?: boolean }) => (
    <div className={inMobile ? "mm-switcher" : "nav-pages"}>
      <Link
        to="/"
        className={`nav-page-btn ${!isGeo ? "active" : ""}`}
        onClick={closeMenu}
      >
        Dronové služby
      </Link>
      <Link
        to="/geodetika"
        className={`nav-page-btn ${isGeo ? "active" : ""}`}
        onClick={closeMenu}
      >
        Geodetické služby
      </Link>
    </div>
  );

  return (
    <>
      <nav className={`geo-nav ${scrolled ? "scrolled" : ""}`} id="mainNav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            GEO<span className="accent">DRONA</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Switcher />
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={l.cta ? "nav-cta" : ""}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`nav-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <div className="mm-section-label">Stránky</div>
          <Switcher inMobile />

          <div className="mm-section-label">Sekce</div>
          {links
            .filter((l) => !l.cta)
            .map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="mm-link"
                onClick={closeMenu}
              >
                <span>{l.label}</span>
                <span className="arrow">→</span>
              </a>
            ))}

          {links
            .filter((l) => l.cta)
            .map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="mm-link mm-cta"
                onClick={closeMenu}
              >
                {l.label}
                <span className="arrow">→</span>
              </a>
            ))}
        </div>
      )}
    </>
  );
}