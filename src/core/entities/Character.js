export default class Character {
  constructor({ id, name, maxHP, maxMP, atk, def, speed, actions = [] }) {
    this.id = id;
    this.name = name;
    this.maxHP = maxHP; this.hp = maxHP;
    this.maxMP = maxMP; this.mp = maxMP;
    this.atk = atk; this.def = def; this.speed = speed;
    this.actions = actions; // instances d'Action
    this.alive = true;

    // Remplace l'usage de tags pour des valeurs (ex: 'defend_flat' => 10, 'acc_bonus' => 0.2)
    this.statuses = new Map(); // string -> number
    this.tags = new Set(); // (conserve si tu affiches des mots-clés)
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
