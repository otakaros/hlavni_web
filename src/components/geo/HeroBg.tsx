import droneHero from "@/assets/hero-drone.jpg";
import geodetHero from "@/assets/hero-geodet.jpg";

function HeroPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="hero-photo"
        width={1920}
        height={1280}
      />
      <div className="hero-photo-overlay" aria-hidden="true" />
    </>
  );
}

export function HeroTopoBg() {
  return (
    <>
      <HeroPhoto
        src={droneHero}
        alt="Profesionální dron létající nad krajinou Moravskoslezského kraje s termovizní kamerou"
      />
      <div className="hero-glow" aria-hidden="true" />
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.35,
        }}
      >
        <ellipse cx="700" cy="450" rx="80" ry="55" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
        <ellipse cx="700" cy="450" rx="155" ry="108" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <ellipse cx="700" cy="450" rx="235" ry="168" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
        <ellipse cx="700" cy="450" rx="320" ry="232" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <ellipse cx="700" cy="450" rx="412" ry="300" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
        <ellipse cx="700" cy="450" rx="510" ry="374" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <ellipse cx="700" cy="450" rx="614" ry="452" fill="none" stroke="rgba(57,255,20,0.08)" strokeWidth="0.8" />
        <ellipse cx="200" cy="120" rx="60" ry="42" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
        <ellipse cx="1250" cy="780" rx="70" ry="50" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
      </svg>
      <div className="hero-scanline" aria-hidden="true" />
    </>
  );
}

export function HeroSurveyBg() {
  return (
    <>
      <HeroPhoto
        src={geodetHero}
        alt="Geodet s totální stanicí a 3D laserovým skenerem na stavbě"
      />
      <div className="hero-glow" aria-hidden="true" />
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.35,
        }}
      >
        <line x1="0" y1="200" x2="1400" y2="200" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="0" y1="400" x2="1400" y2="400" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="0" y1="600" x2="1400" y2="600" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="0" y1="800" x2="1400" y2="800" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="233" y1="0" x2="233" y2="900" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="466" y1="0" x2="466" y2="900" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="699" y1="0" x2="699" y2="900" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="932" y1="0" x2="932" y2="900" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <line x1="1165" y1="0" x2="1165" y2="900" stroke="rgba(57,255,20,0.04)" strokeWidth="0.5" />
        <rect x="520" y="180" width="360" height="280" rx="2" fill="none" stroke="rgba(57,255,20,0.10)" strokeWidth="0.8" />
        <rect x="580" y="240" width="80" height="120" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <rect x="740" y="240" width="80" height="120" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <rect x="620" y="380" width="160" height="80" fill="none" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="700" y2="200" stroke="rgba(56,189,248,0.05)" strokeWidth="0.5" />
        <line x1="100" y1="120" x2="700" y2="240" stroke="rgba(56,189,248,0.05)" strokeWidth="0.5" />
        <line x1="100" y1="140" x2="700" y2="280" stroke="rgba(56,189,248,0.05)" strokeWidth="0.5" />
      </svg>
      <div className="hero-scanline" aria-hidden="true" />
    </>
  );
}