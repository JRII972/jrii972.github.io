export default class BaseEffect {
  constructor({ name, description, applyTo = "target", duration = 1, aiWeight = 1, icon = null, iconText = null } = {}) {
    this.name = name;
    this.description = description;
    this.applyTo = applyTo;
    this.duration = duration;
    this.remaining = duration;
    this.aiWeight = aiWeight; // pondération pour IA (0..1)
    this.icon = icon;         // chemin d'icône (optionnel)
    this.iconText = iconText; // texte court à afficher si pas d'icône
  }
  onApply(_battle, target) { return `${this.name} appliqué sur ${target.name}`; }
  modifyIncomingDamage(value) { return value; }
  modifyHealReceived(value) { return value; }
  modifyAccuracy(baseAcc /*, action, user */) { return baseAcc; }
  blocksAction() { return false; }
  tick() { this.remaining -= 1; return this.remaining > 0; }
  is() { return false; }
}
