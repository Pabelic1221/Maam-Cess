/* Gold & black confetti on the full-screen #fx canvas.  API: Confetti.burst(count, x, y) */
(function () {
  "use strict";
  var cv = document.getElementById("fx");
  if (!cv) { window.Confetti = { burst: function () {} }; return; }
  var cx = cv.getContext("2d"), parts = [], running = false;
  var colors = ["#f7e4a0", "#d4af37", "#fff3d6", "#1a1a1a", "#e0313f", "#ffffff"];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function size() { cv.width = innerWidth; cv.height = innerHeight; }
  size(); addEventListener("resize", size);

  function burst(n, x, y) {
    for (var i = 0; i < n; i++) {
      parts.push({ x: x, y: y, vx: rnd(-10, 10), vy: rnd(-18, -4), s: rnd(5, 11),
        c: colors[i % colors.length], round: i % 3 === 0, r: rnd(0, 6), vr: rnd(-.2, .2), life: rnd(150, 220) });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function (p) { return p.life > 0 && p.y < cv.height + 40; });
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += .32; p.vx *= .99; p.r += p.vr; p.life--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.s / 2.4, 0, 6.3); cx.fill(); }
      else { cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); }
      cx.restore();
    });
    if (parts.length) requestAnimationFrame(tick); else running = false;
  }
  window.Confetti = { burst: burst };
})();
