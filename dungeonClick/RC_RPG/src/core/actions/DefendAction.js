import Action from './Action.js';
import logs from '../state/LogManager.js';
export default class DefendAction extends Action {
  constructor(opts){ super({ ...opts, kind: 'defend' }); }
  apply(user, target, { battle, flags = {} } = {}) {
    if (!this.canUse(user, { battle })) return { type: 'fail' };
    if (this.target === 'self') target = user; else target = user; // défense est toujours sur soi
    if (!flags.noCost && this.costMP > 0 && !user.spendMP(this.costMP)) {
      return { type: 'fail' };
    }
    const flat = (this.defendFlat == null) ? user.def : Number(this.defendFlat || 0);
    user.statuses.set('defend_flat', flat);
    this.applyEffects(user, user, battle);
    if (!flags.noCooldown) this.startCooldown();
    logs.log(`${user.name} se met en défense (${flat}).`);
    return { type: 'status', defendFlat: flat };
  }
}
