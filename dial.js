/*
 * UofT Watch Club dial logo.
 * buildDial() returns SVG markup; it is used live on the site (animated
 * seconds hand + seconds ring) and by the build script for static icons.
 */
(function (root) {
  const CYAN = '#4fd1ff';
  const WHITE = '#eef3f8';
  const C = 200;

  const pt = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [C + r * Math.sin(a), C - r * Math.cos(a)];
  };
  const xy = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
  // point at radius r along angle deg, pushed sideways by w
  const side = (r, deg, w) => {
    const [x, y] = pt(r, deg);
    const [dx, dy] = pt(w, deg + 90);
    return [x + dx - C, y + dy - C];
  };
  const tick = (r1, r2, deg, attrs) => {
    const [x1, y1] = pt(r1, deg), [x2, y2] = pt(r2, deg);
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" ${attrs}/>`;
  };

  function buildDial({ id = 'dial', text = true, ticks = true, small = false, detailed = false, secAngle = 200, ring = 0.7 } = {}) {
    if (small) return buildMark({ id, secAngle, ring });
    if (!detailed) return buildMinimal({ id, text, secAngle, ring });
    const glow = `filter="url(#${id}-glow)"`;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="dial-svg">
  <defs>
    <radialGradient id="${id}-face" cx="50%" cy="44%" r="62%">
      <stop offset="0" stop-color="#142234"/><stop offset=".7" stop-color="#0c141f"/><stop offset="1" stop-color="#080d14"/>
    </radialGradient>
    <filter id="${id}-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="200" cy="200" r="189" fill="none" stroke="#1b2735" stroke-width="3"/>
  <circle class="ring" cx="200" cy="200" r="189" fill="none" stroke="${CYAN}" stroke-width="4" stroke-linecap="round"
          pathLength="100" stroke-dasharray="${(ring * 100).toFixed(2)} 100" transform="rotate(-90 200 200)" ${glow}/>
  <circle cx="200" cy="200" r="180" fill="#0a1019" stroke="#1a2633" stroke-width="1.5"/>
  <circle cx="200" cy="200" r="174" fill="url(#${id}-face)"/>`;

    if (ticks) {
      s += `<g stroke="#5d6b7a" stroke-width="1.4" stroke-linecap="round">`;
      for (let i = 0; i < 60; i++) s += tick(158, 167, i * 6, '');
      s += `</g><circle cx="200" cy="200" r="151" fill="none" stroke="#1c2836" stroke-width="1"/>`;
    }

    // hour markers: white batons, cyan bars at 3/6/9, cyan triangle at 12
    s += `<g stroke="${WHITE}" stroke-width="5" stroke-linecap="round">`;
    for (const h of [1, 2, 4, 5, 7, 8, 10, 11]) s += tick(122, 137, h * 30, '');
    s += `</g><g stroke="${CYAN}" stroke-width="8" ${glow}>`;
    for (const h of [3, 6, 9]) s += tick(119, 141, h * 30, '');
    s += `</g>`;
    s += `<polygon points="${xy(pt(116, 0))} ${xy(side(142, 0, 10))} ${xy(side(142, 0, -10))}" fill="${CYAN}" ${glow}/>`;

    s += `<circle cx="200" cy="200" r="100" fill="none" stroke="#3a4a5c" stroke-width="1" stroke-dasharray="1.5 4.5"/>
  <circle cx="200" cy="200" r="52" fill="none" stroke="#2f7590" stroke-width="1.2" opacity=".85"/>`;

    if (text) {
      s += `<text x="203.5" y="134" text-anchor="middle" font-family="Michroma, Eurostile, 'Arial Black', sans-serif" font-size="27" letter-spacing="7" fill="${WHITE}">UOFT</text>
  <text x="202.5" y="280" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="11.5" letter-spacing="5" fill="${CYAN}">WATCH CLUB</text>
  <text x="201.3" y="299" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-size="7.2" letter-spacing="2.6" fill="#6f7c8b">43.66°N · 79.40°W</text>`;
    }

    // hands: skeleton hour hand at ~10, sword minute hand at ~2
    const H = 304, M = 60;
    s += `<polygon points="${xy(side(-7, H, 5))} ${xy(pt(88, H))} ${xy(side(-7, H, -5))}" fill="#0c141f" stroke="${WHITE}" stroke-width="2.4" stroke-linejoin="round"/>
  <polygon points="${xy(side(-9, M, 5.5))} ${xy(side(18, M, 4.5))} ${xy(pt(132, M))} ${xy(side(18, M, -4.5))} ${xy(side(-9, M, -5.5))}" fill="${WHITE}"/>
  <g class="sec" transform="rotate(${secAngle} 200 200)">
    <line x1="200" y1="232" x2="200" y2="62" stroke="${CYAN}" stroke-width="6" opacity=".14" stroke-linecap="round"/>
    <line x1="200" y1="232" x2="200" y2="62" stroke="${CYAN}" stroke-width="1.8" stroke-linecap="round" ${glow}/>
    <circle cx="200" cy="79" r="3.6" fill="${CYAN}" ${glow}/>
  </g>
  <circle cx="200" cy="200" r="9.5" fill="#0a1019" stroke="${CYAN}" stroke-width="2.6" ${glow}/>
  <circle cx="200" cy="200" r="4.2" fill="${WHITE}"/>
  <circle cx="200" cy="200" r="1.6" fill="#0a1019"/>
</svg>`;
    return s;
  }

  // The club logo: minimal dial, cyan markers at 12/3/6/9, seconds ring.
  function buildMinimal({ id, text, secAngle, ring }) {
    const glow = `filter="url(#${id}-glow)"`;
    const H = 304, M = 60;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="dial-svg">
  <defs>
    <radialGradient id="${id}-face" cx="50%" cy="42%" r="60%">
      <stop offset="0" stop-color="#121c2a"/><stop offset="1" stop-color="#0b121c"/>
    </radialGradient>
    <filter id="${id}-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="200" cy="200" r="189" fill="url(#${id}-face)" stroke="#1d2937" stroke-width="3.5"/>
  <circle class="ring" cx="200" cy="200" r="189" fill="none" stroke="${CYAN}" stroke-width="4.5" stroke-linecap="round"
          pathLength="100" stroke-dasharray="${(ring * 100).toFixed(2)} 100" transform="rotate(-90 200 200)" ${glow}/>
  <polygon points="${xy(pt(133, 0))} ${xy(side(156, 0, 10.5))} ${xy(side(156, 0, -10.5))}" fill="${CYAN}" ${glow}/>
  <g stroke="${CYAN}" stroke-width="9" stroke-linecap="round" ${glow}>
    ${[3, 6, 9].map((h) => tick(137, 153, h * 30, '')).join('')}
  </g>
  ${text ? `<text x="203.5" y="130" text-anchor="middle" font-family="Michroma, Eurostile, 'Arial Black', sans-serif" font-size="28" letter-spacing="7" fill="${WHITE}">UOFT</text>
  <text x="202.5" y="291" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="12.5" letter-spacing="5" fill="${CYAN}" ${glow}>WATCH CLUB</text>` : ''}
  <polygon points="${xy(side(-8, H, 5))} ${xy(pt(88, H))} ${xy(side(-8, H, -5))}" fill="#0e1622" stroke="${WHITE}" stroke-width="2.6" stroke-linejoin="round"/>
  <polygon points="${xy(side(-10, M, 6))} ${xy(side(16, M, 5))} ${xy(pt(131, M))} ${xy(side(16, M, -5))} ${xy(side(-10, M, -6))}" fill="${WHITE}"/>
  <g class="sec" transform="rotate(${secAngle} 200 200)">
    <line x1="200" y1="236" x2="200" y2="52" stroke="${CYAN}" stroke-width="6" opacity=".14" stroke-linecap="round"/>
    <line x1="200" y1="236" x2="200" y2="52" stroke="${CYAN}" stroke-width="1.9" stroke-linecap="round" ${glow}/>
    <circle cx="200" cy="70" r="3.8" fill="${CYAN}" ${glow}/>
  </g>
  <circle cx="200" cy="200" r="10.5" fill="#0b121c" stroke="${CYAN}" stroke-width="3" ${glow}/>
</svg>`;
  }

  // Simplified, heavier version for favicons and the nav (readable at 16–40px).
  function buildMark({ id, secAngle, ring }) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="dial-svg">
  <circle cx="200" cy="200" r="178" fill="none" stroke="#1b2735" stroke-width="22"/>
  <circle class="ring" cx="200" cy="200" r="178" fill="none" stroke="${CYAN}" stroke-width="22" stroke-linecap="round"
          pathLength="100" stroke-dasharray="${(ring * 100).toFixed(2)} 100" transform="rotate(-90 200 200)"/>
  <circle cx="200" cy="200" r="150" fill="#0c141f"/>
  <g stroke="${CYAN}" stroke-width="22">${[3, 6, 9].map((h) => tick(92, 132, h * 30, '')).join('')}</g>
  <polygon points="${xy(pt(88, 0))} ${xy(side(136, 0, 26))} ${xy(side(136, 0, -26))}" fill="${CYAN}"/>
  <line x1="200" y1="200" x2="${pt(78, 304)[0].toFixed(2)}" y2="${pt(78, 304)[1].toFixed(2)}" stroke="${WHITE}" stroke-width="20" stroke-linecap="round"/>
  <line x1="200" y1="200" x2="${pt(112, 60)[0].toFixed(2)}" y2="${pt(112, 60)[1].toFixed(2)}" stroke="${WHITE}" stroke-width="16" stroke-linecap="round"/>
  <circle cx="200" cy="200" r="20" fill="${CYAN}"/>
</svg>`;
  }

  // Sweep the seconds hand and seconds ring in real time.
  function animateDial(svg) {
    const sec = svg.querySelector('.sec');
    const ring = svg.querySelector('.ring');
    const frame = () => {
      const now = new Date();
      const t = now.getSeconds() + now.getMilliseconds() / 1000;
      sec.setAttribute('transform', `rotate(${(t * 6).toFixed(2)} 200 200)`);
      ring.setAttribute('stroke-dasharray', `${((t / 60) * 100).toFixed(2)} 100`);
    };
    frame();
    if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const loop = () => { frame(); root.requestAnimationFrame(loop); };
    root.requestAnimationFrame(loop);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildDial };
  } else {
    root.buildDial = buildDial;
    document.querySelectorAll('[data-dial]').forEach((el, i) => {
      el.innerHTML = buildDial({ id: 'dial' + i, small: el.dataset.dial === 'mark' });
      if (el.dataset.live !== undefined) animateDial(el.querySelector('svg'));
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
