import Action from './Action.js';
import logs from '../state/LogManager.js';
export default class StatusAction extends Action {
  constructor(opts){ super({ ...opts, kind: 'status' }); }
  apply(user, target, { battle, flags = {} } = {}) {
    if (!this.canUse(user, { battle })) return { type: 'fail' };
    if (this.target === 'self') target = user;
    if (!flags.noCost && this.costMP > 0 && !user.spendMP(this.costMP)) {
      return { type: 'fail' };
    }
    this.applyEffects(user, target, battle);
    if (!flags.noCooldown) this.startCooldown();
    logs.log(`${user.name} utilise ${this.name}.`);
    return { type: 'status' };
  }
}
