// Animación "vuela al carrito": una copia de la foto viaja desde el producto
// hasta el botón con [data-cart-target] y el botón rebota. Resuelve al terminar.
export function flyToCart(from: Element | null | undefined): Promise<void> {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();

  const end = target.getBoundingClientRect();
  const bounce = () => {
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35) rotate(-8deg)" }, { transform: "scale(1)" }],
      { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)" },
    );
  };

  const img = from?.querySelector("img");
  if (!from || !img) { bounce(); return Promise.resolve(); }

  const start = img.getBoundingClientRect();
  const size = Math.min(start.width, start.height, 160);
  const ghost = img.cloneNode() as HTMLImageElement;
  Object.assign(ghost.style, {
    position: "fixed", zIndex: "9999", pointerEvents: "none", objectFit: "contain",
    left: `${start.left + (start.width - size) / 2}px`, top: `${start.top + (start.height - size) / 2}px`,
    width: `${size}px`, height: `${size}px`, borderRadius: "16px", background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
  });
  document.body.appendChild(ghost);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.6)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0.4 },
    ],
    { duration: 700, easing: "cubic-bezier(.5,0,.75,0)" },
  );
  return anim.finished.then(() => { ghost.remove(); bounce(); }, () => ghost.remove());
}
