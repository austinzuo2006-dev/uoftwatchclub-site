/*
 * Ripple guilloché, drawn on canvas.
 * Concentric engraved rings, each carrying a fine wave (r += A·sin(Kθ + i·D))
 * so neighbouring rings weave like an engine-turned dial. A slow radial
 * ripple (r += B·sin(2πR/L − ωt)) travels outward through the rings.
 * Animates only while on screen; static if the user prefers reduced motion.
 */
(function () {
  const P = { R0: 296, R1: 494, gap: 6, A: 4.5, K: 28, D: Math.PI / 7, B: 5, L: 64, W: 1.1 };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setup(el) {
    const canvas = document.createElement('canvas');
    el.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const color = getComputedStyle(el).color;
    let size = 0, visible = false, last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = el.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform((dpr * size) / 1000, 0, 0, (dpr * size) / 1000, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, 1000, 1000);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.9;
      const steps = P.K * 7;
      for (let i = 0, R = P.R0; R <= P.R1; i++, R += P.gap) {
        const ripple = P.B * Math.sin((2 * Math.PI * R) / P.L - t * P.W);
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const th = (j / steps) * 2 * Math.PI;
          const r = R + ripple + P.A * Math.sin(P.K * th + i * P.D);
          const x = 500 + r * Math.cos(th), y = 500 + r * Math.sin(th);
          j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = (now) => {
      if (!visible) return;
      if (now - last > 40) { draw(now / 1000); last = now; } // ~24 fps is plenty for a slow ripple
      requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    window.addEventListener('resize', () => { resize(); draw(performance.now() / 1000); });
    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) requestAnimationFrame(loop);
    }).observe(el);
  }

  document.querySelectorAll('[data-guilloche]').forEach(setup);
})();
