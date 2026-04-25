import { useEffect } from "react";

export function useRevealObserver(dependency?: unknown) {
  useEffect(() => {
    // Only select elements that haven't been permanently revealed yet.
    // Elements with data-revealed="true" are already visible via CSS and
    // should not be re-observed — this prevents the flash-of-invisible
    // that occurs when React re-renders and classList is reset.
    const els = document.querySelectorAll<HTMLElement>(
      ".reveal:not([data-revealed='true'])"
    );

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.classList.add("visible");
        el.setAttribute("data-revealed", "true");
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add("visible");
            // Stamp a durable attribute that CSS can target independently.
            // This survives className reassignment (e.g. FAQ toggle logic
            // that sets el.className = "faq-item") and React re-renders
            // that unmount/remount child nodes.
            el.setAttribute("data-revealed", "true");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [dependency]);
}
