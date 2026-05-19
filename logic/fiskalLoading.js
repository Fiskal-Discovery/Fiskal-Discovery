// fiskalLoading.js
// Shared tunnel-animation loading screen for all Fiskal Discovery modules.
//
// Usage:
//   showFiskalLoadingScreen(firstName, onComplete)
//   - firstName: string (may be empty — falls back to generic message)
//   - onComplete: function called after the loading screen fades out (~12s)

function showFiskalLoadingScreen(firstName, onComplete) {
  // Remove any existing instance
  const existing = document.getElementById('fiskal-loading-screen');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'fiskal-loading-screen';
  overlay.style.cssText = 'width:100%;height:100vh;background:#050008;display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;z-index:99999;opacity:1;transition:opacity 0.8s ease;';

  overlay.innerHTML = `
    <canvas id="fiskal-tunnel-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;"></canvas>
    <div style="position:relative;z-index:2;text-align:center;padding:0 40px;max-width:600px;">
      <div id="fiskal-loading-message" style="font-size:22px;font-weight:500;color:white;letter-spacing:0.06em;line-height:1.5;opacity:1;transition:opacity 0.8s ease;"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  // ── Canvas tunnel animation ──────────────────────────────────
  const canvas = document.getElementById('fiskal-tunnel-canvas');
  const ctx = canvas.getContext('2d');
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  const cx = W / 2;
  const cy = H / 2;
  let offset = 0;
  let time = 0;

  const palette = [
    [78,  0,  99],
    [100, 5,  130],
    [126, 9,  165],
    [155, 48, 192],
    [100, 5,  130],
    [78,  0,  99],
    [60,  20, 160],
    [78,  0,  99],
    [126, 9,  165],
    [200, 70, 10],
    [126, 9,  165],
    [78,  0,  99],
  ];

  function getColor(ringIndex, totalRings) {
    const t = (time * 0.003 + ringIndex / totalRings) % 1;
    const scaled = t * (palette.length - 1);
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const a = palette[idx % palette.length];
    const b = palette[(idx + 1) % palette.length];
    return [
      Math.round(a[0] + (b[0] - a[0]) * frac),
      Math.round(a[1] + (b[1] - a[1]) * frac),
      Math.round(a[2] + (b[2] - a[2]) * frac),
    ];
  }

  let animFrame;
  function draw() {
    ctx.fillStyle = 'rgba(5,0,8,0.25)';
    ctx.fillRect(0, 0, W, H);
    const RINGS = 28;
    for (let i = RINGS; i >= 0; i--) {
      const progress = ((i / RINGS) + offset) % 1;
      const size = progress;
      const rx = size * W * 0.54;
      const ry = size * H * 0.50;
      const alpha = (1 - size) * 0.8 + 0.03;
      const lw = (1 - size) * 4 + 0.3;
      const [r, g, b] = getColor(i, RINGS);
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(0, rx), Math.max(0, ry), 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 75);
    cg.addColorStop(0, 'rgba(180,80,255,0.5)');
    cg.addColorStop(0.4, 'rgba(126,9,165,0.25)');
    cg.addColorStop(0.8, 'rgba(78,0,99,0.1)');
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.fillStyle = cg;
    ctx.fill();
    offset += 0.004;
    time++;
    animFrame = requestAnimationFrame(draw);
  }
  draw();

  // ── Message cycling ──────────────────────────────────────────
  const name = firstName && firstName.trim() ? firstName.trim() : '';
  const messages = [
    "Every great business is on a journey...",
    "The right funding can change everything...",
    "Your options are taking shape...",
    name ? `Thanks for waiting, ${name} — your discovery is ready.` : "Thanks for waiting — your discovery is ready."
  ];

  let msgIndex = 0;
  const msgEl = document.getElementById('fiskal-loading-message');

  function showMessage(index) {
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = messages[index];
      msgEl.style.opacity = '1';
    }, 400);
  }

  showMessage(0);

  const msgInterval = setInterval(() => {
    msgIndex++;
    if (msgIndex < messages.length) showMessage(msgIndex);
    if (msgIndex >= messages.length - 1) {
      clearInterval(msgInterval);
      // Hold last message 1s, then fade out and call onComplete
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          cancelAnimationFrame(animFrame);
          overlay.remove();
          if (onComplete) onComplete();
        }, 800);
      }, 1000);
    }
  }, 3000);
}
