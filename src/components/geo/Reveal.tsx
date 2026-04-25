import { useEffect } from "react";

export function useRevealObserver() {
  useEffect(() => {
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
            const el = entry.target as HTMLElement;

            // Důležitý trik: reset + force reflow → animace se spustí znovu
            el.classList.remove("visible");
            void el.offsetWidth;                    // force reflow

            el.classList.add("visible");
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    reveals.forEach((el) => {
      // Pozorujeme všechny prvky (i ty už s .visible), protože chceme reset
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}