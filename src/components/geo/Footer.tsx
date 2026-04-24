import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="geo-footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              GEO<span className="accent">DRONA</span>
            </div>
            <p className="footer-tagline">
              Profesionální dronové a geodetické služby pro průmysl, stavebnictví a
              energetiku. Ostrava, Opava a celý Moravskoslezský kraj.
            </p>
            <div className="footer-contact">
              <a href="mailto:info@geodrona.cz">✉ info@geodrona.cz</a>
              <a href="tel:+420000000000">☎ +420 000 000 000</a>
              <a href="https://geodrona.cz" target="_blank" rel="noreferrer">
                🌐 geodrona.cz
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Stránky</div>
            <ul className="footer-links">
              <li>
                <Link to="/">Dronové služby</Link>
              </li>
              <li>
                <Link to="/geodezie">Geodetické služby</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Specializace</div>
            <ul className="footer-links">
              <li>Termovize & FVE inspekce</li>
              <li>3D laserové skenování</li>
              <li>Pasportizace budov</li>
              <li>Vklady do DTM (GAD)</li>
              <li>Geometrické plány</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} <span className="accent">GEODRONA</span>{" "}
            s.r.o. · Všechna práva vyhrazena
          </span>
          <span>OSTRAVA · MORAVSKOSLEZSKÝ KRAJ · CZ</span>
        </div>
      </div>
    </footer>
  );
}