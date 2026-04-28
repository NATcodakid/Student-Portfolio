import { reducedMotion } from "./motion";

const reduceMotion = reducedMotion();
document.documentElement.classList.add("ui-ready");

function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>(".scroll-progress");
  if (!bar) return;
  if (reduceMotion) {
    bar.style.display = "none";
    return;
  }
  const onScroll = (): void => {
    const doc = document.documentElement;
    const h = doc.scrollHeight - doc.clientHeight;
    const p = h > 0 ? doc.scrollTop / h : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initTilt(): void {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    let raf = 0;
    el.style.transformStyle = "preserve-3d";
    el.addEventListener(
      "pointermove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rect = el.getBoundingClientRect();
          if (rect.width < 1) return;
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.setProperty("--tiltX", `${(y * -5).toFixed(2)}deg`);
          el.style.setProperty("--tiltY", `${(x * 5.5).toFixed(2)}deg`);
        });
      },
      { passive: true }
    );
    el.addEventListener("pointerleave", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.style.setProperty("--tiltX", "0deg");
      el.style.setProperty("--tiltY", "0deg");
    });
  });
}

function initAuroraPointer(): void {
  if (reduceMotion) return;
  const aur = document.querySelector<HTMLElement>(".bg-aurora");
  if (!aur) return;
  let ticking = false;
  document.addEventListener("pointermove", (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      aur.style.setProperty("--apx", `${x.toFixed(1)}%`);
      aur.style.setProperty("--apy", `${y.toFixed(1)}%`);
    });
  });
}

function initMagnetic(): void {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLAnchorElement>(".btn[data-magnetic]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = (e.clientX - (r.left + r.width / 2)) * 0.2;
      const my = (e.clientY - (r.top + r.height / 2)) * 0.16;
      btn.style.setProperty("--mx", `${mx.toFixed(1)}px`);
      btn.style.setProperty("--my", `${my.toFixed(1)}px`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });
}

function run(): void {
  initScrollProgress();
  initTilt();
  initAuroraPointer();
  initMagnetic();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}
