// Effet "CLEAR" : retire les effets de type DEG (dégâts sur la durée) en cours
export default class ClearEffect {
  constructor({
    name = "Purge",
    description = "Retire les effets de dégâts en cours.",
    applyTo = "ally",           // "self" | "ally" | "target"
    typesToClear = ["DEG"],     // types d'effets à retirer
  } = {}) {
    this.name = name;
    this.description = description;
    this.type = "CLEAR";
    this.applyTo = applyTo;
    this.typesToClear = Array.isArray(typesToClear) ? typesToClear : ["DEG"];
    this.remaining = 0; // effet instantané, ne persiste pas
  }

  onApply(battle, target) {
    if (!target?.activeEffects || target.activeEffects.length === 0) {
      return `${target?.name ?? "La cible"} n'a aucun effet à dissiper.`;
    }
    const before = target.activeEffects.length;
    target.activeEffects = target.activeEffects.filter(
      (e) => !this.typesToClear.includes(e.type)
    );
    const removed = before - target.activeEffects.length;
    if (removed > 0) {
      return `${target.name} est purifié : ${removed} effet(s) de dégâts retiré(s).`;
    }
    return `${target.name} n'avait pas d'effet de dégâts à retirer.`;
  }

  // Tick retourne false pour indiquer "supprimer si <=0"
  tick() {
    this.remaining = 0;
    return false;
  }

  // Ne bloque pas l'action
  blocksAction() { return false; }

  // Hooks facultatifs que d'autres effets possèdent
  modifyIncomingDamage(v /*, battle, target */) { return v; }
  modifyHealReceived(v /*, battle, target */) { return v; }
}
