import { useEffect } from "react";

export function useRevealObserver() {
  useEffect(() => {
    // Pokud prohlížeč nepodporuje IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);   // jednou a dost
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    // Najdeme všechny .reveal prvky a začneme je pozorovat (jen ty bez visible)
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    reveals.forEach((el) => {
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []); // ← důležité: prázdné pole
}