export default class AIController {
  chooseAction(enemy, hero) {
    // Heuristique simple : si PV bas -> Heal si possible, sinon Attack
    const byPriority = [
      (e,h) => e.actions.find(a => a.id === "heal" && a.canUse(e, {})),
      (e,h) => e.actions.find(a => a.id === "special" && a.canUse(e, {})),
      (e,h) => e.actions.find(a => a.id === "attack" && a.canUse(e, {})),
      (e,h) => e.actions.find(a => a.id === "defend" && a.canUse(e, {})),
      (e,h) => e.actions.find(a => a.id === "focus" && a.canUse(e, {})),
    ];
    if (enemy.hp < enemy.maxHP * 0.35) {
      const tryHeal = byPriority[0](enemy, hero);
      if (tryHeal) return { action: tryHeal, target: enemy };
    }
    for (const pick of byPriority.slice(1)) {
      const a = pick(enemy, hero);
      if (a) return { action: a, target: a.id === "defend" || a.id === "focus" ? enemy : hero };
    }
    // fallback
    const any = enemy.actions.find(a => a.canUse(enemy, {}));
    return { action: any, target: any?.id === "defend" || any?.id === "focus" ? enemy : hero };
  }
}
