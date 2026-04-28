import { reducedMotion, revealCascadeItems } from "./motion";
import { initTestimonialDeck, initTechStripMotion } from "./testimonials";

const reduceMotion = reducedMotion();
const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
const menu = document.getElementById("site-nav");
const header = document.querySelector<HTMLElement>(".site-header");

if (toggle && menu) {
  const setOpen = (open: boolean): void => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
  });
}

if (header) {
  const onScroll = (): void => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function runCascadeStagger(t: Element): void {
  const items = t.querySelectorAll<HTMLElement>(".cascade-item");
  if (t.getAttribute("data-cascade") === null) return;
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("cascade-in"));
  } else {
    items.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("cascade-in");
      }, 64 * i);
    });
  }
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const t = entry.target;
          t.classList.add("is-visible");
          runCascadeStagger(t);
          io.unobserve(t);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    io.observe(el);
  });
} else {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    el.classList.add("is-visible");
    revealCascadeItems(el);
  });
}

document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
  const shot = card.querySelector<HTMLElement>(".feature-card__shot--premium");
  if (!shot || reduceMotion) return;

  const setPos = (clientX: number, clientY: number): void => {
    const r = shot.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    shot.style.setProperty("--sx", `${Math.max(0, Math.min(100, x))}%`);
    shot.style.setProperty("--sy", `${Math.max(0, Math.min(100, y))}%`);
  };

  card.addEventListener("mousemove", (e) => setPos(e.clientX, e.clientY), { passive: true });
  card.addEventListener("touchmove", (e) => {
    if (e.touches[0]) {
      setPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  });
});

initTestimonialDeck();
initTechStripMotion();

if ("IntersectionObserver" in window) {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('.case-toc-list a[href^="#"]');
  const headings = document.querySelectorAll<HTMLElement>(".case-main [id]");
  if (tocLinks.length && headings.length) {
    const ids: string[] = [];
    headings.forEach((h) => {
      if (h.id) ids.push(h.id);
    });
    const activeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          tocLinks.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      if (h.id && ids.indexOf(h.id) !== -1) activeIo.observe(h);
    });
  }
}
