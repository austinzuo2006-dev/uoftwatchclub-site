/*
 * Guilloché (rose-engine) pattern, drawn as fine lines.
 * Each band is n copies of r(t) = R + a·sin(k·t + phase), phase-shifted
 * so the curves weave into the moiré you see on engraved watch dials.
 */
(function () {
  const BANDS = [
    { R: 352, a: 20, k: 18, n: 9 },
    { R: 432, a: 26, k: 12, n: 12 },
  ];

  function band({ R, a, k, n }) {
    const steps = k * 8;
    let d = '';
    for (let i = 0; i < n; i++) {
      const phase = (i * 2 * Math.PI) / n;
      for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * 2 * Math.PI;
        const r = R + a * Math.sin(k * t + phase);
        d += (j ? 'L' : 'M') + (500 + r * Math.cos(t)).toFixed(1) + ' ' + (500 + r * Math.sin(t)).toFixed(1);
      }
      d += 'Z';
    }
    return d;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" fill="none" stroke="currentColor" stroke-width=".9">
    ${BANDS.map((b) => `<path d="${band(b)}"/>`).join('')}
    <circle cx="500" cy="500" r="318" stroke-width=".9"/>
    <circle cx="500" cy="500" r="388" stroke-width=".5"/>
    <circle cx="500" cy="500" r="478" stroke-width=".9"/>
  </svg>`;

  document.querySelectorAll('[data-guilloche]').forEach((el) => { el.innerHTML = svg; });
})();
