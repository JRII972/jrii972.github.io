export default class RNG {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
  }

  next() {
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 0xffffffff;
  }

  random() {
    return this.next();
  }

  range(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  rangeInt(min, max) {
    return this.range(min, max);
  }

  chance(p) {
    return this.next() < p;
  }
}

