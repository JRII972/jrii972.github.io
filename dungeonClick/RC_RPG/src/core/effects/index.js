import ClearEffect from "./ClearEffect.js";
import FocusEffect from "./FocusEffect.js";
import BaseEffect from "./BaseEffect.js";
import StunEffect from "./StunEffect.js";
import DotEffect from "./DotEffect.js";
import MalusDefEffect from "./MalusDefEffect.js";
import MalusHealEffect from "./MalusHealEffect.js";
import CompositeEffect from "./CompositeEffect.js";

// Focus ne supporte plus d'icône personnalisée: suppression des paramètres icon/iconText
export function createFocus(name = "Focus", description = "Augmente la précision.", duration = 2, amount = 0.1, aiWeight = 1) {
  return new FocusEffect({ name, description, duration, amount, aiWeight });
}


export function createClear(
  name = "Purge",
  description = "Retire les effets de dégâts en cours.",
  applyTo = "ally",
  typesToClear = ["DOT"]
) {
  return new ClearEffect({ name, description, applyTo, typesToClear });
}

export {
  BaseEffect,
  StunEffect,
  DotEffect,
  MalusDefEffect,
  MalusHealEffect,
  CompositeEffect,
  ClearEffect,
  FocusEffect,
};

