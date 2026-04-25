import { useEffect } from "react";

export function useRevealObserver(dependency?: unknown) {
  useEffect(() => {
    // Najdeme všechny elementy, které mají animaci
    const els = document.querySelectorAll(".reveal");
    
    if (els.length === 0) return;

    // Fallback pro staré prohlížeče
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // Jakmile je prvek viditelný, přestaneme ho sledovat (lepší výkon)
            obs.unobserve(e.target);
          }
        });
      },
      { 
        threshold: 0.1, // Spustí se, když je vidět 10 % prvku
        rootMargin: "0px 0px -50px 0px" // Spustí se o 50px dříve, než prvek vstoupí do viewportu
      },
    );

    els.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [dependency]); // Znovu se spustí při změně závislosti (např. navigace)
}