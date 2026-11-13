/* Page wiring: name, opening gate, buttons. */
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

  // opening gate -> "Surprise me"
  var gate = $("gate");
  $("surprise").addEventListener("click", function () {
    $("site").classList.add("on");
    window.scrollTo(0, 0);
    FlashEngine.cam(); setTimeout(FlashEngine.cam, 220); setTimeout(FlashEngine.cam, 460);
    FlashEngine.volley(10);
    setTimeout(function () { gate.classList.add("open"); }, 400);
    if (!reduce) setTimeout(function () {
      Confetti.burst(150, innerWidth * .25, innerHeight * .8);
      Confetti.burst(150, innerWidth * .75, innerHeight * .8);
    }, 700);
    setTimeout(function () { gate.style.display = "none"; }, 1700);
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
