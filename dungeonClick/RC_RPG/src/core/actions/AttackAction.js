import Action from './Action.js';
import logs from '../state/LogManager.js';
export default class AttackAction extends Action {
  constructor(opts){ super({ ...opts, kind: 'attack' }); }
  apply(user, target, { battle, rng, flags = {} } = {}) {
    if (!this.canUse(user)) return { type: 'fail' };
    if (this.target === 'self') target = user;
    logs.log(`[ACTION] ${user.name} tente ${this.name} sur ${target?.name ?? 'cible inconnue'}`);
    const hit = this._computeAccuracy(user, target, rng);
    if (!hit){
      if (!flags.noCooldown) this.startCooldown();
      logs.log(`[MISS] ${user.name} -> ${target.name} avec ${this.name}`);
      return { type: 'miss' };
    }
    if (!flags.noCost && this.costMP > 0 && !user.spendMP(this.costMP)) {
      logs.log(`[FAIL] ${user.name} manque de MP pour ${this.name}`);
      return { type: 'fail' };
    }
    const base = Math.max(0, this.baseDamage);
    const finalDmg = battle.computeIncomingDamage(target, base);
    target.takeDamage(finalDmg);
    this.applyEffects(user, target, battle);
    if (!flags.noCooldown) this.startCooldown();
    logs.log(`[HIT] ${user.name} -> ${target.name} ${this.name} : ${finalDmg} dégâts`);
    return { type: 'damage', value: finalDmg };
  }
}
