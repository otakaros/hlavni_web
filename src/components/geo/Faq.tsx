import { useState } from "react";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`faq-item reveal ${isOpen ? "open" : ""}`}>
            <button
              className="faq-q"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              type="button"
            >
              {it.q}
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-a">{it.a}</div>
          </div>
        );
      })}
    </div>
  );
}