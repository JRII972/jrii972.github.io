export default class AIController {
  constructor(rng) {
    // rng est une instance de RNG (core/combat/RNG.js)
    this.rng = rng;
  }

  getFeatures(actor) {
    return actor?.ai?.features ?? [];
  }

  availableTargets(actor, action, battle) {
    const isEnemy = actor?.id?.startsWith?.("enemy");

    if (action.kind === "attack") {
      return isEnemy ? battle.allAllies() : battle.allEnemies();
    }
    if (action.kind === "heal") {
      if (action.target === "self") return [actor];
      if (action.target === "ally") return isEnemy ? battle.allEnemies() : battle.allAllies();
      if (action.target === "enemy") return isEnemy ? battle.allAllies() : battle.allEnemies();
      return [actor];
    }
    if (action.kind === "defend") return [actor];
    return isEnemy ? battle.allAllies() : battle.allEnemies();
  }

  scoreTarget(t, features) {
    let score = 0;
    for (const f of features) {
      switch (f) {
        case "max_pv":       score += Number(t.hp || 0); break;
        case "min_pv":       score += -Number(t.hp || 0); break;
        case "no_def": {
          const flat = Number(t.statuses?.get?.("defend_flat") || 0);
          score += flat > 0 ? -50 : 10; break;
        }
        case "lowest_def":   score += -Number(t.def || 0); break;
        case "weakest_pct": {
          const pct = (Number(t.hp || 0) / Math.max(1, Number(t.maxHP || 1)));
          score += -pct * 100; break;
        }
        case "random":
          score += this.rng.range(0, 0.01); // léger bruit
          break;
        default: break;
      }
    }
    return score;
  }

  pickTarget(actor, action, battle) {
    const candidates = this.availableTargets(actor, action, battle).filter(x => x && x.alive);
    if (candidates.length === 0) return null;

    const feats = this.getFeatures(actor);

    // 🎲 Si la seule feature est "random" → choix uniforme
    const onlyRandom = feats.length > 0 && feats.every(f => f === "random");
    if (onlyRandom) {
      const idx = this.rng.rangeInt(0, candidates.length - 1);
      return candidates[idx];
    }

    if (feats.length === 0) {
      if (action.kind === "heal") {
        return candidates.slice().sort((a, b) => (a.hp || 0) - (b.hp || 0))[0];
      }
      return candidates[0];
    }

    let best = candidates[0], bestScore = -Infinity;
    for (const c of candidates) {
      const s = this.scoreTarget(c, feats);
      if (s > bestScore) { bestScore = s; best = c; }
    }
    return best;
  }

  chooseAction(actor, battle) {
    const usable = (actor?.actions ?? []).filter(a => a.canUse(actor, { battle }));
    if (usable.length === 0) return null;

    for (const action of usable) {
      if (this.rng.chance(action.aiWeight ?? 1)) {
        const target = this.pickTarget(actor, action, battle);
        if (target) {
          return { action, target };
        }
      }
    }

    const fallback = usable[this.rng.rangeInt(0, usable.length - 1)];
    return { action: fallback, target: this.pickTarget(actor, fallback, battle) };
  }
}
