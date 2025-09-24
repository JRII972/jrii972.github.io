import Action from './Action.js';
import logs from '../state/LogManager.js';
export default class HealAction extends Action {
  constructor(opts){ super({ ...opts, kind: 'heal' }); }
  apply(user, target, { battle, rng, flags = {} } = {}) {
    if (!this.canUse(user, { battle })) return { type: 'fail' };
    if (this.target === 'self') target = user;
    const hit = this._computeAccuracy(user, target, rng);
    if (!hit){
      if (!flags.noCooldown) this.startCooldown();
      logs.log(`${user.name} échoue à lancer ${this.name}.`);
      return { type: 'miss' };
    }
    if (!flags.noCost && this.costMP > 0 && !user.spendMP(this.costMP)) {
      return { type: 'fail' };
    }
    const raw = Math.max(0, this.healAmount + rng.range(0,2));
    const final = battle.computeHealReceived(target, raw);
    target.heal(final);
    this.applyEffects(user, target, battle);
    if (!flags.noCooldown) this.startCooldown();
    logs.log(`${user.name} utilise ${this.name} sur ${target.name} (+${final} PV).`);
    return { type: 'heal', value: final };
  }
}
