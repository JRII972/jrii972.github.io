import ClearEffect from "./ClearEffect.js";
import FocusEffect from "../effects/FocusEffect.js";

export function createFocus(name = "Focus", description = "Augmente la précision.", duration = 2, amount = 0.1) {
  return [new FocusEffect({ name, description, duration, amount })];
}


export function createClear(
  name = "Purge",
  description = "Retire les effets de dégâts en cours.",
  applyTo = "ally",
  typesToClear = ["DEG"]
) {
  return new ClearEffect({ name, description, applyTo, typesToClear });
}

