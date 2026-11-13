/*
 * Paparazzi flash engine.
 * A crowd of invisible "photographers" is scattered over the screen. Each one fires at its own
 * rhythm, sometimes in motor-drive bursts, and sometimes walks to a new spot – so the flashes
 * never stop and never repeat. Flashes never land on the model (#mag); a nearby flash makes
 * her photo glint instead.
 *
 * API: FlashEngine.init()  .shoot()  .volley(n)  .cam()  .soft()
 */
(function () {
  "use strict";
  var cfg = Object.assign({ areaPerShooter: 60000, minShooters: 10, maxShooters: 34, maxLive: 46,
    respectReducedMotion: false }, (window.BIRTHDAY && window.BIRTHDAY.flashes) || {});
  var calm = cfg.respectReducedMotion && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pace = calm ? 4 : 1;                       // gap multiplier

  var crowd, flares, mag, flashEl, washEl, shooters = [], live = 0, started = false;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function retrigger(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function cam()  { retrigger(flashEl, "go"); if (window.Sound) Sound.click(1); }   // full-screen white flash + shutter click
  function soft() { retrigger(washEl, "go"); }    // faint screen-wide glow

  function pop(x, y, size, dur) {
    if (live >= cfg.maxLive) return;
    live++;
    var f = document.createElement("span");
    f.className = "flare";
    f.style.cssText = "left:" + x + "px;top:" + y + "px;--s:" + size + "px;--r:" + rnd(-30, 30) + "deg;--d:" + dur + "s";
    flares.appendChild(f);
    setTimeout(function () { f.remove(); live--; }, dur * 1000 + 80);
  }
  function glint() {
    var im = mag && mag.querySelector("img");
    if (im) retrigger(im, "lit");
  }
  function fire(x, y, size) {
    var R = mag ? mag.getBoundingClientRect() : { left: 0, right: 0, top: 0, bottom: 0 };
    if (x > R.left && x < R.right && y > R.top && y < R.bottom) { glint(); return; }
    pop(x, y, size, rnd(.35, .75));
    if (window.Sound && Math.random() < .1) Sound.click(.12);   // faint crowd clicks
    if (x > R.left - 180 && x < R.right + 180 && y > R.top - 180 && y < R.bottom + 180) glint();
    if (Math.random() < .06 / pace) soft();
  }

  function shoot() { try { fire(rnd(0, innerWidth), rnd(0, innerHeight), rnd(60, 220)); } catch (e) {} }
  function volley(n) { for (var i = 0; i < n; i++) setTimeout(shoot, i * 70); }

  function seed() {
    var n = Math.round(innerWidth * innerHeight / cfg.areaPerShooter);
    n = Math.max(cfg.minShooters, Math.min(cfg.maxShooters, n));
    var t = performance.now();
    shooters = [];
    for (var i = 0; i < n; i++)
      shooters.push({ x: rnd(0, innerWidth), y: rnd(0, innerHeight), s: rnd(50, 200), next: t + rnd(0, 2500), burst: 0 });
  }

  function frame(t) {
    requestAnimationFrame(frame);                // scheduled first: nothing below can stop the loop
    if (document.hidden || scrollY > innerHeight * .9) return;
    for (var i = 0; i < shooters.length; i++) {
      var c = shooters[i];
      if (t < c.next) continue;
      try { fire(c.x + rnd(-14, 14), c.y + rnd(-14, 14), c.s * rnd(.8, 1.2)); } catch (e) {}
      if (c.burst > 0) { c.burst--; c.next = t + rnd(80, 170) * pace; }          // motor-drive burst
      else {
        c.next = t + rnd(600, 3400) * pace;
        if (Math.random() < .22) c.burst = Math.floor(rnd(2, 6));
        if (Math.random() < .08) { c.x = rnd(0, innerWidth); c.y = rnd(0, innerHeight); }  // moves to a new spot
      }
    }
  }

  function init() {
    if (started) return; started = true;
    crowd = document.getElementById("crowd"); flares = document.getElementById("flares");
    mag = document.getElementById("mag"); flashEl = document.getElementById("flash"); washEl = document.getElementById("wash");
    if (!flares) return;
    seed();
    var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(seed, 200); });
    addEventListener("scroll", function () {      // background fades out as the hero scrolls away
      var o = Math.max(0, 1 - scrollY / (innerHeight * .85));
      if (crowd) crowd.style.opacity = o; flares.style.opacity = o;
    }, { passive: true });
    requestAnimationFrame(frame);
  }

  window.FlashEngine = { init: init, shoot: shoot, volley: volley, cam: cam, soft: soft };
})();