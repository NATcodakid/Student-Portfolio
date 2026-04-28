/** Shared motion preference helper for the portfolio bundle. */
export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Run cascade “in” for every `.cascade-item` under a `[data-cascade]` root. */
export function revealCascadeItems(root: Element): void {
  if (root.getAttribute("data-cascade") === null) return;
  root.querySelectorAll<HTMLElement>(".cascade-item").forEach((el) => {
    el.classList.add("cascade-in");
  });
}
