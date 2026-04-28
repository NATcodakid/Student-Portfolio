import { reducedMotion } from "./motion";

type StackPos = "front" | "middle" | "back";

const DECK = '[data-testimonial-deck]';
const CARD = "[data-testimonial-card]";

export function initTestimonialDeck(): void {
  const root = document.querySelector<HTMLElement>(DECK);
  if (!root) return;
  if (reducedMotion()) {
    root.classList.add("testimonial-deck--static");
    return;
  }

  const cards = root.querySelectorAll<HTMLElement>(CARD);
  if (cards.length !== 3) return;

  let positions: StackPos[] = ["front", "middle", "back"];
  const dragRef = { startX: 0, dragging: false, active: false };

  function applyLayout(): void {
    cards.forEach((card, i) => {
      const pos = positions[i];
      if (!pos) return;
      card.dataset.pos = pos;
      const isFront = pos === "front";
      card.setAttribute("tabindex", isFront ? "0" : "-1");
      card.setAttribute("aria-hidden", isFront ? "false" : "true");
    });
  }

  function shuffle(): void {
    const next: StackPos[] = [...positions];
    const last = next.pop();
    if (last !== undefined) {
      next.unshift(last);
    }
    positions = next;
    applyLayout();
  }

  function onPointerDown(e: PointerEvent): void {
    const t = (e.currentTarget as HTMLElement).closest(CARD) as HTMLElement | null;
    if (!t || t.dataset.pos !== "front") return;
    dragRef.startX = e.clientX;
    dragRef.dragging = true;
    dragRef.active = true;
    t.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: PointerEvent): void {
    if (!dragRef.dragging) return;
    const t = (e.currentTarget as HTMLElement).closest(CARD) as HTMLElement | null;
    if (t && t.dataset.pos === "front") {
      try {
        t.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (dragRef.active && dragRef.startX - e.clientX > 150) {
      shuffle();
    }
    dragRef.dragging = false;
    dragRef.active = false;
    dragRef.startX = 0;
  }

  cards.forEach((card) => {
    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
    card.addEventListener("keydown", (e) => {
      if (card.dataset.pos === "front" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        shuffle();
      }
    });
  });

  applyLayout();
}

export function initTechStripMotion(): void {
  const el = document.querySelector<HTMLElement>(".techstrip__viewport");
  if (!el || reducedMotion()) {
    if (el) {
      el.classList.add("techstrip__viewport--in");
    }
    return;
  }
  if (!("IntersectionObserver" in window)) {
    el.classList.add("techstrip__viewport--in");
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("techstrip__viewport--in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -5% 0px", threshold: 0.15 }
  );
  io.observe(el);
}
