/**
 * Système d'effets orienté classes.
 *
 * Types pris en charge :
 *  - STUN        : empêche d'agir. amount est ignoré (c'est la durée qui compte).
 *  - DEG         : inflige des dégâts immédiats à l'application (amount = dégâts flat avant modifs).
 *  - MALUS_DEF   : augmente les dégâts ENTRANTS de +amount (flat) pendant 'duration' tours.
 *  - MALUS_HEAL  : réduit les SOINS REÇUS de 'amount' (ratio 0..1) pendant 'duration' tours.
 *
 * Ciblage lors de la création :
 *   applyTo: "target" | "self"   (par défaut "target")
 *
 * Méthodes de cycle (polymorphes) :
 *  - onApply(battle, target): effets immédiats (ex. DEG). Retourne un texte de log (string) facultatif.
 *  - modifyIncomingDamage(value, battle, target): permet d'altérer les dégâts reçus.
 *  - modifyHealReceived(value, battle, target): permet d'altérer les soins reçus.
 *  - blocksAction(): true si l'effet empêche d'agir (ex. STUN).
 *  - tick(): décrémente la durée, retourne true si l'effet reste actif.
 */

export class BaseEffect {
  constructor({ name, description, applyTo = "target", duration = 1 }) {
    this.name = name;
    this.description = description;
    this.applyTo = applyTo;     // "target" | "self"
    this.duration = duration;   // nombre de tours
    this.remaining = duration;  // décrémenté en fin de round
  }

  onApply(_battle, _target) {
    // Par défaut, rien de spécial.
    return `${this.name} appliqué.`;
  }

  modifyIncomingDamage(value, _battle, _target) {
    return value;
  }

  modifyHealReceived(value, _battle, _target) {
    return value;
  }

  blocksAction() {
    return false;
  }

  tick() {
    this.remaining -= 1;
    return this.remaining > 0;
  }

  is(type) {
    return false; // surclassé
  }
}

/** STUN : empêche d'agir pendant 'duration' tours. */
export class StunEffect extends BaseEffect {
  constructor(opts) { super(opts); }
  blocksAction() { return true; }
  onApply(_battle, _target) {
    return `${this.name}: la cible est étourdie pour ${this.remaining} tour(s).`;
  }
  is(t) { return t === "STUN"; }
}

/** DEG : inflige des dégâts immédiats (amount) lors de l'application. */
export class DegEffect extends BaseEffect {
  constructor(opts) {
    super(opts);
    this.amount = Number(opts.amount || 0);
  }
  onApply(battle, target) {
    if (this.amount > 0) {
      const final = battle.computeIncomingDamage(target, this.amount);
      target.takeDamage(final);
      return `${target.name} subit ${final} dégâts (${this.name}).`;
    }
    return `${this.name} appliqué.`;
  }
  is(t) { return t === "DEG"; }
}

/** MALUS_DEF : ajoute +amount flat aux dégâts entrants pendant 'duration'. */
export class MalusDefEffect extends BaseEffect {
  constructor(opts) {
    super(opts);
    this.amount = Number(opts.amount || 0);
  }
  modifyIncomingDamage(value, _battle, _target) {
    return Math.max(0, value + this.amount);
  }
  onApply(_battle, _target) {
    return `${this.name}: +${this.amount} dégâts subis pendant ${this.remaining} tour(s).`;
  }
  is(t) { return t === "MALUS_DEF"; }
}

/** MALUS_HEAL : réduit les soins reçus de 'amount' (ratio 0..1) pendant 'duration'. */
export class MalusHealEffect extends BaseEffect {
  constructor(opts) {
    super(opts);
    this.amount = Math.max(0, Math.min(1, Number(opts.amount || 0)));
  }
  modifyHealReceived(value, _battle, _target) {
    const factor = Math.max(0, 1 - this.amount);
    return Math.floor(value * factor);
  }
  onApply(_battle, _target) {
    return `${this.name}: soins reçus -${Math.round(this.amount * 100)}% pendant ${this.remaining} tour(s).`;
  }
  is(t) { return t === "MALUS_HEAL"; }
}

/** CompositeEffect : permet d’emballer plusieurs effets en un seul objet. */
export class CompositeEffect extends BaseEffect {
  constructor(effects = []) {
    super({ name: "Composite", description: "Effets combinés", applyTo: "target", duration: 1 });
    this.effects = effects;
  }
  onApply(battle, target) {
    const logs = [];
    for (const e of this.effects) {
      const l = e.onApply(battle, target);
      if (l) logs.push(l);
    }
    return logs.join(" ");
  }
  modifyIncomingDamage(value, battle, target) {
    return this.effects.reduce((v, e) => e.modifyIncomingDamage(v, battle, target), value);
  }
  modifyHealReceived(value, battle, target) {
    return this.effects.reduce((v, e) => e.modifyHealReceived(v, battle, target), value);
  }
  blocksAction() {
    return this.effects.some(e => e.blocksAction());
  }
  tick() {
    // Chaque enfant gère sa propre durée ; si l’un reste actif, on garde le composite.
    this.effects = this.effects.filter(e => e.tick());
    return this.effects.length > 0;
  }
  is(t) {
    return this.effects.some(e => e.is(t));
  }
}

/**
 * Fabrique d’effets : signature claire (pas d’ambiguïté).
 * @param {string} name
 * @param {string} description
 * @param {string|string[]} types - un type ou une liste
 * @param {"self"|"target"} applyTo - cible d’application
 * @param {number} duration - nb de tours (>=1). Pour STUN, c’est la durée d’étourdissement.
 * @param {number} amount - valeur de l’effet (DEG: dégâts, MALUS_DEF: +flat dmg, MALUS_HEAL: ratio 0..1)
 * @returns BaseEffect | CompositeEffect
 */
export function createEffect(name, description, types, applyTo = "target", duration = 1, amount = 0) {
  const makeOne = (t) => {
    const baseOpts = { name, description, applyTo, duration, amount };
    switch (t) {
      case "STUN":       return new StunEffect(baseOpts);
      case "DEG":        return new DegEffect(baseOpts);
      case "MALUS_DEF":  return new MalusDefEffect(baseOpts);
      case "MALUS_HEAL": return new MalusHealEffect(baseOpts);
      default:
        return new BaseEffect(baseOpts); // fallback neutre
    }
  };

  if (Array.isArray(types)) {
    const list = types.map(makeOne);
    return list.length === 1 ? list[0] : new CompositeEffect(list);
  }
  return makeOne(types);
}

export default {
  BaseEffect,
  StunEffect,
  DegEffect,
  MalusDefEffect,
  MalusHealEffect,
  CompositeEffect,
  createEffect,
};
