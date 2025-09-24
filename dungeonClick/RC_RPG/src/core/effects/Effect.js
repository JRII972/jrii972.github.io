// Wrapper de compatibilité : ancien fichier unifié.
// On ré-exporte les classes séparées et on conserve createEffect.
import BaseEffect from "./BaseEffect.js";
import StunEffect from "./StunEffect.js";
import DotEffect from "./DotEffect.js";
import MalusDefEffect from "./MalusDefEffect.js";
import MalusHealEffect from "./MalusHealEffect.js";
import CompositeEffect from "./CompositeEffect.js";

export function createEffect(name, description, types, applyTo = "target", duration = 1, amount = 0, extra = {}) {
  const makeOne = (t) => {
    const baseOpts = { name, description, applyTo, duration, amount, ...extra };
    switch (t) {
      case "STUN": return new StunEffect(baseOpts);
  case "DOT": return new DotEffect(baseOpts);
  case "DEG": return new DotEffect(baseOpts); // compat ancien nom
      case "MALUS_DEF": return new MalusDefEffect(baseOpts);
      case "MALUS_HEAL": return new MalusHealEffect(baseOpts);
      default: return new BaseEffect(baseOpts);
    }
  };
  if (Array.isArray(types)) {
    const list = types.map(makeOne);
    return list.length === 1 ? list[0] : new CompositeEffect(list);
  }
  return makeOne(types);
}

export { BaseEffect, StunEffect, DotEffect, MalusDefEffect, MalusHealEffect, CompositeEffect };
export default { BaseEffect, StunEffect, DotEffect, MalusDefEffect, MalusHealEffect, CompositeEffect, createEffect };
