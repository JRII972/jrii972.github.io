export default class RNG {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
  }
  next() {
    // xorshift32 tout simple
    let x = this.seed;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 0xffffffff;
  }
  range(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  chance(p) { return this.next() < p; }
}
