export default class Character {
  constructor({
    id,
    name,
    maxHP,
    maxMP,
    atk,
    def,
    speed,
    actions = [],
    portrait = "",
    ai = null, // ← ➕ accepté depuis les presets
  }) {
    this.id = id;
    this.name = name;

    this.maxHP = maxHP; this.hp = maxHP;
    this.maxMP = maxMP; this.mp = maxMP;

    this.atk = atk;
    this.def = def;
    this.speed = speed;

    this.actions = actions;
    this.alive = true;

    this.statuses = new Map();
    this.tags = new Set();
    this.portrait = portrait;

    // ➕ IA: stockée telle quelle, avec valeurs par défaut sûres
    const features = Array.isArray(ai?.features) ? ai.features.slice() : [];
    this.ai = { name: ai?.name ?? "default", features };
  }

  takeDamage(amount) {
    const dmg = Math.max(0, Math.floor(amount));
    this.hp = Math.max(0, this.hp - dmg);
    if (this.hp === 0) this.alive = false;
    return dmg;
  }

  heal(amount) {
    const val = Math.max(0, Math.floor(amount));
    this.hp = Math.min(this.maxHP, this.hp + val);
    return val;
  }

  spendMP(cost) {
    if (this.mp < cost) return false;
    this.mp -= cost;
    return true;
  }
}
