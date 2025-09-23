// Paramètres modifiables à la volée
export default {
  // Afficher la barre de MP des ennemis ?
  showEnemyMP: false,

  // Afficher la défense actuelle (réduction) sur l'ennemi ?
  showEnemyDefense: true, // mettre false pour la masquer

  // Si défini (0..1), remplace la chance de toucher pour les attaques
  // de l'ennemi CONTRE le héros. Mettre 1 pour toucher tout le temps.
  enemyToHeroHitChanceOverride: 1, // ex: 1 (toujours touche), null pour désactiver

  // Bonus d'accuracy conféré par Focus (ex: +20% = 0.2)
  focusAccuracyBonus: 0.2,
};
