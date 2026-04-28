import { reducedMotion } from "./motion";

const reduce = reducedMotion();

function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.92 && r.bottom > 0;
}

function initReveals(): void {
  const nodes = document.querySelectorAll<HTMLElement>(".case-reveal");
  if (reduce) {
    nodes.forEach((el) => el.classList.add("is-inview"));
    document.body.classList.add("js-case-ready");
    return;
  }

  nodes.forEach((el) => {
    if (inViewport(el)) {
      el.classList.add("is-inview");
    }
  });
  document.body.classList.add("js-case-ready");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-inview"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  nodes.forEach((el) => {
    if (!el.classList.contains("is-inview")) {
      io.observe(el);
    }
  });
}

function initCompare(): void {
  document.querySelectorAll<HTMLElement>("[data-compare]").forEach((root) => {
    const range = root.querySelector<HTMLInputElement>(".compare__range");
    const before = root.querySelector<HTMLElement>(".compare__before");
    const gutter = root.querySelector<HTMLElement>(".compare__gutter");
    if (!range || !before) return;

    const setP = (p: number): void => {
      const n = Math.max(0, Math.min(100, p));
      before.style.setProperty("--p", `${n}%`);
      if (gutter) gutter.style.setProperty("--pos", `${n}%`);
    };

    setP(parseFloat(range.value) || 50);

    range.addEventListener("input", () => {
      setP(parseFloat(range.value) || 0);
    });

    if (reduce) return;
    let moved = false;
    root.addEventListener(
      "pointerenter",
      () => {
        if (moved) return;
        root.classList.add("compare--touched");
      },
      { passive: true }
    );
    range.addEventListener("pointerdown", () => {
      moved = true;
    });
  });
}

function start(): void {
  initReveals();
  initCompare();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
