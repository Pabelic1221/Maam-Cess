/* Page wiring: name, opening countdown, buttons, tilt. */
(function () {
  "use strict";
  var cfg = window.BIRTHDAY || { name: "Birthday Star" };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function text(id, v) { var el = $(id); if (el) el.textContent = v; }

  text("title", cfg.name);
  text("who", cfg.name);
  text("win", cfg.name + "!");
  document.title = "Happy Birthday, " + cfg.name + "!";

  FlashEngine.init();

  // depth: mouse (desktop) or phone tilt moves the crowd and turns her photo a few degrees
  var askTilt = function () {};
  if (!reduce) {
    var root = document.documentElement;
    var setTilt = function (x, y) { root.style.setProperty("--mx", x.toFixed(3)); root.style.setProperty("--my", y.toFixed(3)); };
    var clamp = function (v) { return Math.max(-1, Math.min(1, v)); };
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "touch") setTilt(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
    }, { passive: true });
    var onTilt = function (e) { if (e.gamma != null) setTilt(clamp(e.gamma / 25), clamp(((e.beta || 45) - 45) / 25)); };
    askTilt = function () {
      if (!window.DeviceOrientationEvent) return;
      if (typeof DeviceOrientationEvent.requestPermission === "function") {      // iOS needs a tap
        DeviceOrientationEvent.requestPermission().then(function (r) {
          if (r === "granted") addEventListener("deviceorientation", onTilt);
        }).catch(function () {});
      } else addEventListener("deviceorientation", onTilt);
    };
  }

  // opening gate -> "Surprise me" -> 3... 2... 1... -> flash burst
  var gate = $("gate"), started = false;
  function reveal() {
    $("site").classList.add("on");
    window.scrollTo(0, 0);
    FlashEngine.cam(); setTimeout(FlashEngine.cam, 160); setTimeout(FlashEngine.cam, 340); setTimeout(FlashEngine.cam, 540);
    FlashEngine.volley(16);
    setTimeout(function () { gate.classList.add("open"); }, 300);
    if (!reduce) setTimeout(function () {
      Confetti.burst(150, innerWidth * .25, innerHeight * .8);
      Confetti.burst(150, innerWidth * .75, innerHeight * .8);
    }, 600);
    setTimeout(function () { gate.style.display = "none"; }, 1600);
  }
  $("surprise").addEventListener("click", function () {
    if (started) return; started = true;
    Sound.enable();                                  // this tap unlocks audio
    askTilt();
    var box = document.querySelector(".gatein"), n = 3;
    (function step() {
      if (n === 0) { reveal(); return; }
      box.innerHTML = '<div class="cd" aria-live="assertive">' + n + '</div>';   // new node restarts the animation
      FlashEngine.cam();
      n--; setTimeout(step, 850);
    })();
  });

  // arrow button in the hero -> scroll to the greeting
  $("more").addEventListener("click", function () {
    $("invite").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  // final reveal
  var open = $("open");
  open.addEventListener("click", function () {
    $("winner").hidden = false;
    open.textContent = "Celebrate again";
    FlashEngine.cam();
    if (!reduce) {
      Confetti.burst(140, innerWidth * .3, innerHeight * .85);
      Confetti.burst(140, innerWidth * .7, innerHeight * .85);
    }
  });
})();