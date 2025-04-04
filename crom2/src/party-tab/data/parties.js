const parties = [
  {
    "id": 101,
    "date": "2025-04-04",
    "maitre_de_jeu": "Julien",
    "jeu": "Warhammer",
    "type": "Cmp",
    "lieu": "FSV",
    "commentaire": "Plongez dans une guerre sans fin contre le Chaos. L’Empire a besoin de héros !",
    "max_player": 5,
    "players": ["Alice", "Bastien", "Camille", "Damien"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://warhammer.com/images/chaos_space_marines.jpg",
    "image_alt": "Chaos Space Marines in battle"
  },
  {
    "id": 102,
    "date": "2025-04-04",
    "maitre_de_jeu": "Pierre",
    "jeu": "L’Appel de Cthulhu",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Un mystère indicible vous attend. Survivrez-vous à la folie des Grands Anciens ?",
    "max_player": 6,
    "players": ["Karine", "Laurent", "Manon", "Nicolas", "Ophélie", "Pascal"],
    "number_of_players_registered": 6,
    "locked": true,
    "image": "https://cthulhu-rpg.com/artwork/great_old_one_cthulhu.jpg",
    "image_alt": "Depiction of the Great Old One Cthulhu"
  },
  {
    "id": 103,
    "date": "2025-04-05",
    "maitre_de_jeu": "Marie",
    "jeu": "Donjons et Dragons",
    "type": "Cmp",
    "lieu": "MDA",
    "commentaire": "Une quête épique commence dans les terres oubliées. Affrontez dragons et mystères !",
    "max_player": 5,
    "players": ["François", "Gabrielle", "Hugo", "Isabelle"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://dnd.wizards.com/images/dragon_horde.jpg",
    "image_alt": "A horde of dragons guarding treasure"
  },
  {
    "id": 104,
    "date": "2025-04-11",
    "maitre_de_jeu": "Sophie",
    "jeu": "Vampire: La Mascarade",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Dans l’ombre d’Orléans, les vampires règlent leurs comptes. Serez-vous prédateur ou proie ?",
    "max_player": 4,
    "players": ["Pascal", "Quentin", "Roxane", "Sébastien"],
    "number_of_players_registered": 4,
    "locked": true,
    "image": "https://worldofdarkness.com/images/vampire_masquerade_clan.jpg",
    "image_alt": "Vampire clan meeting in the shadows"
  },
  {
    "id": 105,
    "date": "2025-04-12",
    "maitre_de_jeu": "Marie",
    "jeu": "Donjons et Dragons",
    "type": "Cmp",
    "lieu": "MDA",
    "commentaire": "La quête se poursuit : un artefact perdu menace l’équilibre du monde.",
    "max_player": 5,
    "players": ["François", "Gabrielle", "Hugo", "Isabelle"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://dnd.wizards.com/images/ancient_artifact.jpg",
    "image_alt": "An ancient artifact glowing with power"
  },
  {
    "id": 106,
    "date": "2025-04-12",
    "maitre_de_jeu": "Lucas",
    "jeu": "Chroniques Oubliées",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Une aventure rapide et héroïque dans un monde médiéval fantastique. À vos dés !",
    "max_player": 6,
    "players": ["Alice", "François", "Karine", "Pascal", "Manon"],
    "number_of_players_registered": 5,
    "locked": false,
    "image": "https://chroniquesoubliees.fr/images/medieval_knight.jpg",
    "image_alt": "A medieval knight in armor"
  },
  {
    "id": 107,
    "date": "2025-04-18",
    "maitre_de_jeu": "Julien",
    "jeu": "Warhammer",
    "type": "Cmp",
    "lieu": "FSV",
    "commentaire": "Les ténèbres s’épaississent. Défendez l’Empire contre une nouvelle menace !",
    "max_player": 5,
    "players": ["Alice", "Bastien", "Camille", "Damien"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://warhammer.com/images/empire_soldiers.jpg",
    "image_alt": "Empire soldiers defending against darkness"
  },
  {
    "id": 108,
    "date": "2025-04-19",
    "maitre_de_jeu": "Sophie",
    "jeu": "Vampire: La Mascarade",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Une nuit de trahisons et de pouvoir. Survivrez-vous à la Mascarade ?",
    "max_player": 6,
    "players": ["Pascal", "Quentin", "Roxane", "Sébastien", "Théo"],
    "number_of_players_registered": 5,
    "locked": false,
    "image": "https://worldofdarkness.com/images/vampire_night.jpg",
    "image_alt": "A dark night with lurking vampires"
  },
  {
    "id": 109,
    "date": "2025-04-25",
    "maitre_de_jeu": "Pierre",
    "jeu": "L’Appel de Cthulhu",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Un culte ancien refait surface. Enquêtez avant que la réalité ne s’effondre !",
    "max_player": 5,
    "players": ["Damien", "Élodie", "Hugo", "Manon", "Nicolas"],
    "number_of_players_registered": 5,
    "locked": true,
    "image": "https://cthulhu-rpg.com/artwork/cult_ritual.jpg",
    "image_alt": "A sinister cult performing a ritual"
  },
  {
    "id": 110,
    "date": "2025-04-26",
    "maitre_de_jeu": "Marie",
    "jeu": "Donjons et Dragons",
    "type": "Cmp",
    "lieu": "MDA",
    "commentaire": "Les héros affrontent un ennemi ancestral. Le destin du royaume est en jeu.",
    "max_player": 5,
    "players": ["François", "Gabrielle", "Hugo", "Isabelle"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://dnd.wizards.com/images/ancient_enemy.jpg",
    "image_alt": "Heroes facing an ancient enemy"
  },
  {
    "id": 111,
    "date": "2025-05-02",
    "maitre_de_jeu": "Julien",
    "jeu": "Warhammer",
    "type": "Cmp",
    "lieu": "FSV",
    "commentaire": "Bataille finale : l’Empire tremble sous les assauts du Chaos. Qui survivra ?",
    "max_player": 5,
    "players": ["Alice", "Bastien", "Camille", "Damien"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://warhammer.com/images/final_battle.jpg",
    "image_alt": "The final battle against Chaos forces"
  },
  {
    "id": 112,
    "date": "2025-05-02",
    "maitre_de_jeu": "Lucas",
    "jeu": "Chroniques Oubliées",
    "type": "Event",
    "lieu": "FSV",
    "commentaire": "Événement spécial : une épopée unique avec défis et récompenses exclusives !",
    "max_player": 6,
    "players": ["Bastien", "Camille", "Laurent", "Roxane", "Théo", "Élodie"],
    "number_of_players_registered": 6,
    "locked": true,
    "image": "https://chroniquesoubliees.fr/images/epic_quest.jpg",
    "image_alt": "Heroes on an epic quest"
  },
  {
    "id": 113,
    "date": "2025-05-03",
    "maitre_de_jeu": "Sophie",
    "jeu": "Vampire: La Mascarade",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Les clans s’affrontent dans une nuit sanglante. Choisissez votre camp !",
    "max_player": 5,
    "players": ["Karine", "Laurent", "Ophélie", "Pascal"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://worldofdarkness.com/images/clan_war.jpg",
    "image_alt": "Vampire clans in a bloody conflict"
  },
  {
    "id": 114,
    "date": "2025-05-09",
    "maitre_de_jeu": "Pierre",
    "jeu": "L’Appel de Cthulhu",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Un manuscrit maudit révèle des secrets interdits. La sanity est en jeu !",
    "max_player": 4,
    "players": ["Hugo", "Isabelle", "Jérôme", "Manon"],
    "number_of_players_registered": 4,
    "locked": true,
    "image": "https://cthulhu-rpg.com/artwork/cursed_manuscript.jpg",
    "image_alt": "A cursed manuscript with forbidden secrets"
  },
  {
    "id": 115,
    "date": "2025-05-10",
    "maitre_de_jeu": "Marie",
    "jeu": "Donjons et Dragons",
    "type": "Cmp",
    "lieu": "MDA",
    "commentaire": "Conclusion épique : le sort du monde repose sur vos épaules.",
    "max_player": 5,
    "players": ["François", "Gabrielle", "Hugo", "Isabelle"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://dnd.wizards.com/images/epic_conclusion.jpg",
    "image_alt": "Heroes in an epic world-saving battle"
  },
  {
    "id": 116,
    "date": "2025-05-16",
    "maitre_de_jeu": "Julien",
    "jeu": "Warhammer",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Une bataille brutale dans le Vieux Monde. Gloire ou mort vous attendent !",
    "max_player": 6,
    "players": ["Alice", "Bastien", "Camille", "Pascal", "Roxane"],
    "number_of_players_registered": 5,
    "locked": false,
    "image": "https://warhammer.com/images/brutal_battle.jpg",
    "image_alt": "A brutal battle in the Old World"
  },
  {
    "id": 117,
    "date": "2025-05-16",
    "maitre_de_jeu": "Sophie",
    "jeu": "Vampire: La Mascarade",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Une nuit de trahisons et de pouvoir. Survivrez-vous à la Mascarade ?",
    "max_player": 5,
    "players": ["Karine", "Laurent", "Ophélie", "Quentin", "Sébastien"],
    "number_of_players_registered": 5,
    "locked": true,
    "image": "https://worldofdarkness.com/images/vampire_betrayal.jpg",
    "image_alt": "A vampire betraying another in the night"
  },
  {
    "id": 118,
    "date": "2025-05-17",
    "maitre_de_jeu": "Lucas",
    "jeu": "Chroniques Oubliées",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Une quête héroïque contre un dragon oublié. Prenez votre courage à deux mains !",
    "max_player": 6,
    "players": ["Damien", "Élodie", "François", "Gabrielle"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://chroniquesoubliees.fr/images/dragon_slayer.jpg",
    "image_alt": "A hero slaying a forgotten dragon"
  },
  {
    "id": 119,
    "date": "2025-05-23",
    "maitre_de_jeu": "Pierre",
    "jeu": "L’Appel de Cthulhu",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Un culte ancien refait surface. Enquêtez avant que la réalité ne s’effondre !",
    "max_player": 5,
    "players": ["Damien", "Élodie", "Hugo", "Manon"],
    "number_of_players_registered": 4,
    "locked": false,
    "image": "https://cthulhu-rpg.com/artwork/ancient_cult.jpg",
    "image_alt": "An ancient cult resurfacing"
  },
  {
    "id": 120,
    "date": "2025-05-24",
    "maitre_de_jeu": "Marie",
    "jeu": "Donjons et Dragons",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Une aventure unique dans un donjon perdu. Trésors et dangers garantis !",
    "max_player": 6,
    "players": ["Alice", "Bastien", "Camille", "Sébastien", "Théo"],
    "number_of_players_registered": 5,
    "locked": false,
    "image": "https://dnd.wizards.com/images/lost_dungeon.jpg",
    "image_alt": "Explorers in a lost dungeon"
  },
  {
    "id": 121,
    "date": "2025-05-30",
    "maitre_de_jeu": "Sophie",
    "jeu": "Vampire: La Mascarade",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Les clans s’affrontent dans une nuit sanglante. Choisissez votre camp !",
    "max_player": 4,
    "players": ["Karine", "Laurent", "Ophélie", "Pascal"],
    "number_of_players_registered": 4,
    "locked": true,
    "image": "https://worldofdarkness.com/images/bloody_clans.jpg",
    "image_alt": "Vampire clans in a bloody confrontation"
  },
  {
    "id": 122,
    "date": "2025-05-30",
    "maitre_de_jeu": "Lucas",
    "jeu": "Chroniques Oubliées",
    "type": "1Sht",
    "lieu": "FSV",
    "commentaire": "Une quête héroïque contre un dragon oublié. Prenez votre courage à deux mains !",
    "max_player": 6,
    "players": ["Damien", "Élodie", "François", "Gabrielle", "Théo"],
    "number_of_players_registered": 5,
    "locked": false,
    "image": "https://chroniquesoubliees.fr/images/forgotten_dragon.jpg",
    "image_alt": "A forgotten dragon menacing heroes"
  },
  {
    "id": 123,
    "date": "2025-05-31",
    "maitre_de_jeu": "Julien",
    "jeu": "Warhammer",
    "type": "1Sht",
    "lieu": "MDA",
    "commentaire": "Une bataille brutale dans le Vieux Monde. Gloire ou mort vous attendent !",
    "max_player": 5,
    "players": ["Alice", "Bastien", "Camille", "Pascal", "Roxane"],
    "number_of_players_registered": 5,
    "locked": true,
    "image": "https://warhammer.com/images/glory_or_death.jpg",
    "image_alt": "Warriors fighting for glory or death"
  }
];

export default parties;