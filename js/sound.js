/* Camera shutter click (synthesised, no audio file). Silent until Sound.enable() runs from a tap. */
(function () {
  "use strict";
  var ctx, on = true, ready = false, btn = document.getElementById("mute");
  function enable() {
    if (ready) return;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.resume) ctx.resume(); ready = true; } catch (e) {}
  }
  function tick(t, dur, freq, q, g) {
    var n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain();
    s.buffer = b; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q; v.gain.value = g;
    s.connect(f); f.connect(v); v.connect(ctx.destination); s.start(t);
  }
  function click(vol) {                 // two-part shutter: open, then close
    if (!ready || !on) return;
    var t = ctx.currentTime, g = (vol == null ? 1 : vol) * .5;
    tick(t, .03, 2600, 1.2, g); tick(t + .055, .045, 1500, 1, g * .8);
  }
  if (btn) btn.addEventListener("click", function () {
    on = !on; btn.textContent = on ? "🔊" : "🔇";
    btn.setAttribute("aria-pressed", String(!on));
    btn.setAttribute("aria-label", on ? "Mute camera sounds" : "Unmute camera sounds");
    if (on) click(1);
  });
  window.Sound = { enable: enable, click: click };
})();