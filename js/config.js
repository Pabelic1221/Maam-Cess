/* Site settings – edit here, no other file needs to change. */
window.BIRTHDAY = {
  name: "Ma’am Cess",

  flashes: {
    // number of invisible "photographers" ≈ screen area / areaPerShooter, clamped to min..max
    areaPerShooter: 60000,
    minShooters: 10,
    maxShooters: 34,
    maxLive: 46,                 // max flashes on screen at once (performance guard)
    // The flashing is the whole point of the page, so it runs even when the visitor's system has
    // "reduce motion" on. Set to true to make it 4x calmer for those visitors instead.
    respectReducedMotion: false
  }
};
