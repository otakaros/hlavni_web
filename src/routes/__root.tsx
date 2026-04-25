import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Nav } from "@/components/geo/Nav";
import { Footer } from "@/components/geo/Footer";
import { ScrollToTop } from "@/components/geo/ScrollToTop";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", background: "var(--geo-bg)", color: "var(--geo-text)" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 className="display" style={{ fontSize: "6rem", color: "var(--geo-accent)", textShadow: "0 0 36px rgba(57,255,20,0.5)" }}>404</h1>
        <h2 style={{ fontSize: "1.4rem", color: "#fff", marginTop: 8 }}>Stránka nenalezena</h2>
        <p style={{ marginTop: 8, color: "var(--geo-text2)" }}>Tato stránka neexistuje nebo byla přesunuta.</p>
        <div style={{ marginTop: 28 }}>
          <Link to="/" className="btn-primary">Zpět na úvod</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "GeoDrona s.r.o." },
      { name: "theme-color", content: "#07090d" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "cs_CZ" },
      { property: "og:site_name", content: "GeoDrona" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Geodetické služby – Pasportizace budov, DTM | GeoDrona Ostra" },
      { property: "og:title", content: "Geodetické služby – Pasportizace budov, DTM | GeoDrona Ostra" },
      { name: "twitter:title", content: "Geodetické služby – Pasportizace budov, DTM | GeoDrona Ostra" },
      { name: "description", content: "Profesionální geodetické služby: pasportizace budov (3D laserové skenování, BIM), vklady do DTM, geometrické plány a geodetická aktualizační dokumentace (GAD)." },
      { property: "og:description", content: "Profesionální geodetické služby: pasportizace budov (3D laserové skenování, BIM), vklady do DTM, geometrické plány a geodetická aktualizační dokumentace (GAD)." },
      { name: "twitter:description", content: "Profesionální geodetické služby: pasportizace budov (3D laserové skenování, BIM), vklady do DTM, geometrické plány a geodetická aktualizační dokumentace (GAD)." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/IWU2rzwmTmfA1Vs8ovCcBs7A9032/social-images/social-1777056328974-reflection-prism-4973007.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/IWU2rzwmTmfA1Vs8ovCcBs7A9032/social-images/social-1777056328974-reflection-prism-4973007.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // Favicon — multiformat pro maximum kompatibilitu se všemi vyhledávači a zařízeními
      { rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/assets/favicon-192.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicon-16.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/apple-touch-icon.png" },
      { rel: "manifest", href: "/assets/site.webmanifest" },
      { rel: "msapplication-config", content: "/assets/browserconfig.xml" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body className="geo-app">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Smooth-scroll for in-page hash links
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <div className="topo-bg" aria-hidden="true" />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
