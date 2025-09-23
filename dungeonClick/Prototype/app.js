// Variables globales
// Game data and state management
class GameState {
    constructor() {
        this.hero = {
            name: "Aventurier",
            level: 1,
            hp: 50,
            max_hp: 50,
            attack: 10,
            defense: 5,
            speed: 8,
            experience: 0,
            experience_to_next: 100
        };

        this.clicks = {
            adventure: 20,
            max_adventure: 20,
            craft: 0,
            max_craft: 15
        };

        this.inventory = {
            leather: 2,
            iron: 1,
            thread: 1,
            wood: 3,
            gold: 25
        };

        this.equipment = {
            weapon: null,
            armor: null,
            boots: null,
            accessory: null
        };

        this.expedition_count = 1;
        this.expedition_level = 0; // 0=start, 1=first choice, 2=second choice, 3=third choice, 4=boss
        this.expedition_path = [];
        this.last_expedition_result = null;
        
        this.recipes = [
            {
                id: "leather_boots",
                name: "Bottes de Cuir",
                materials: { leather: 10, thread: 2 },
                craft_clicks: 3,
                stats: { speed: 2, defense: 1 },
                slot: 'boots'
            },
            {
                id: "iron_sword",
                name: "Épée de Fer", 
                materials: { iron: 5, wood: 3 },
                craft_clicks: 5,
                stats: { attack: 5 },
                slot: 'weapon'
            },
            {
                id: "leather_armor",
                name: "Armure de Cuir",
                materials: { leather: 8, thread: 3 },
                craft_clicks: 4,
                stats: { defense: 3, hp: 10 },
                slot: 'armor'
            },
            {
                id: "wooden_shield",
                name: "Bouclier de Bois",
                materials: { wood: 6, iron: 2 },
                craft_clicks: 4,
                stats: { defense: 4 },
                slot: 'accessory'
            }
        ];

        this.enemies = [
            { name: "Gobelin", hp: 20, attack: 6, defense: 2, xp: 15, materials: { leather: 2, gold: 5 } },
            { name: "Orc", hp: 35, attack: 12, defense: 4, xp: 25, materials: { iron: 1, leather: 3, gold: 10 } },
            { name: "Orc Élite", hp: 45, attack: 15, defense: 5, xp: 35, materials: { iron: 2, leather: 2, gold: 15 } },
            { name: "Troll Boss", hp: 80, attack: 22, defense: 8, xp: 100, materials: { iron: 5, leather: 4, wood: 3, gold: 50 } }
        ];

        this.dungeon_structure = {
            level_1: [
                { id: "room_a", name: "Tanière du Gobelin", type: "enemy", content: "Gobelin", description: "Facile - Combat garanti contre un Gobelin faible", difficulty: "easy" },
                { id: "room_b", name: "Chambre aux Trésors", type: "treasure_trap", content: { success: { leather: 4, gold: 15, thread: 2 }, failure: { damage: 15 } }, description: "Risqué - Trésor gardé par un piège", difficulty: "risky" }
            ],
            level_2: [
                { id: "room_c", name: "Repaire d'Orc", type: "enemy", content: "Orc", description: "Moyen - Combat contre un Orc", difficulty: "medium" },
                { id: "room_d", name: "Salle Mystérieuse", type: "special", content: { craft_clicks: 2, wood: 2 }, description: "Sûr - Bonus de clics d'artisanat", difficulty: "safe" }
            ],
            level_3: [
                { id: "room_e", name: "Garde d'Élite", type: "enemy", content: "Orc Élite", description: "Difficile - Orc Élite avec butin rare", difficulty: "hard" },
                { id: "room_f", name: "Sanctuaire Ancien", type: "treasure", content: { iron: 3, gold: 25, thread: 3 }, description: "Mystérieux - Matériaux rares garantis", difficulty: "mystery" }
            ],
            boss: { id: "boss_room", name: "Antre du Troll", type: "boss", content: "Troll Boss", description: "Boss Final - Récompense : 20 Clics d'Aventure", difficulty: "boss" }
        };
    }
}

const state = new GameState();

const adventureClicksElem = document.getElementById('adventure-clicks');
const craftClicksElem = document.getElementById('craft-clicks');
const heroLevelElem = document.getElementById('hero-level');
const heroHpElem = document.getElementById('hero-hp');
const heroMaxHpElem = document.getElementById('hero-max-hp');
const heroAttackElem = document.getElementById('hero-attack');
const heroDefenseElem = document.getElementById('hero-defense');
const heroSpeedElem = document.getElementById('hero-speed');
const xpFillElem = document.getElementById('xp-fill');
const xpTextElem = document.getElementById('xp-text');
const expeditionCountElem = document.getElementById('expedition-count');

const roomChoice1Elem = document.getElementById('room-choice-1');
const roomChoice2Elem = document.getElementById('room-choice-2');
const explorationAreaElem = document.getElementById('exploration-area');
const combatAreaElem = document.getElementById('combat-area');
const combatInfoElem = document.getElementById('combat-info');
const attackButton = document.getElementById('attack-button');
const powerAttackButton = document.getElementById('power-attack-button');
const craftingAreaElem = document.getElementById('crafting-area');
const materialsListElem = document.getElementById('materials-list');
const craftingRecipesElem = document.getElementById('crafting-recipes');
const messageAreaElem = document.getElementById('message-area');

const btnEnterDungeon = document.getElementById('btn-enter-dungeon');
const btnBackToBase = document.getElementById('btn-back-to-base');
const btnOpenCrafting = document.getElementById('btn-open-crafting');
const btnBackToExploration = document.getElementById('btn-back-to-exploration');
const btnReset = document.getElementById('btn-reset');

// Update display functions
function updateClicks() {
    adventureClicksElem.textContent = state.clicks.adventure;
    craftClicksElem.textContent = state.clicks.craft;
}

function updateHeroStats() {
    heroLevelElem.textContent = state.hero.level;
    heroHpElem.textContent = state.hero.hp;
    heroMaxHpElem.textContent = state.hero.max_hp;
    heroAttackElem.textContent = state.hero.attack;
    heroDefenseElem.textContent = state.hero.defense;
    heroSpeedElem.textContent = state.hero.speed;
    let xpPercent = (state.hero.experience / state.hero.experience_to_next) * 100;
    xpFillElem.style.width = `${xpPercent}%`;
    xpTextElem.textContent = `${state.hero.experience} / ${state.hero.experience_to_next}`;
}

function updateExpeditionCount() {
    expeditionCountElem.textContent = state.expedition_count;
}

function showMessage(msg) {
    messageAreaElem.textContent = msg;
}

// Navigation and UI functions
function showExploration() {
    explorationAreaElem.style.display = 'flex';
    combatAreaElem.style.display = 'none';
    craftingAreaElem.style.display = 'none';
    btnEnterDungeon.classList.add('hidden');
    btnBackToBase.classList.remove('hidden');
    btnOpenCrafting.classList.remove('hidden');
    btnBackToExploration.classList.add('hidden');
    showMessage('');
    updateExplorationChoices();
}

function showCombat(enemy) {
    explorationAreaElem.style.display = 'none';
    combatAreaElem.style.display = 'block';
    craftingAreaElem.style.display = 'none';
    btnEnterDungeon.classList.add('hidden');
    btnBackToBase.classList.add('hidden');
    btnOpenCrafting.classList.add('hidden');
    btnBackToExploration.classList.add('hidden');
    combatInfoElem.textContent = `Combat contre ${enemy.name} (${enemy.hp} PV)`;
    showMessage('Au combat ! Utilisez vos clics d\'aventure pour attaquer.');
}

function showCrafting() {
    explorationAreaElem.style.display = 'none';
    combatAreaElem.style.display = 'none';
    craftingAreaElem.style.display = 'block';
    btnEnterDungeon.classList.add('hidden');
    btnBackToBase.classList.remove('hidden');
    btnOpenCrafting.classList.add('hidden');
    btnBackToExploration.classList.remove('hidden');
    showMessage('Artisanat : utilisez vos clics d\'artisanat pour créer des équipements.');
    updateCraftingInterface();
}

function updateExplorationChoices() {
    // Determine which dungeon level we are at and display two room choices
    let level = state.expedition_level;
    let rooms = [];
    if (level === 0) rooms = state.dungeon_structure.level_1;
    else if (level === 1) rooms = state.dungeon_structure.level_2;
    else if (level === 2) rooms = state.dungeon_structure.level_3;
    else if (level === 3) rooms = [state.dungeon_structure.boss];
    else return; // expedition ended

    // For levels 0..2, display first two choices
    if (level < 3) {
        roomChoice1Elem.textContent = `${rooms[0].name}\n${rooms[0].description}`;
        roomChoice2Elem.textContent = `${rooms[1].name}\n${rooms[1].description}`;

        roomChoice1Elem.onclick = () => enterRoom(rooms[0]);
        roomChoice2Elem.onclick = () => enterRoom(rooms[1]);
    } else {
        // For boss level show boss info and a single "enter" choice
        roomChoice1Elem.textContent = `Boss : ${rooms[0].name}\n${rooms[0].description}`;
        roomChoice1Elem.onclick = () => enterRoom(rooms[0]);
        roomChoice2Elem.textContent = '';
        roomChoice2Elem.onclick = null;
    }
}

function updateCraftingInterface() {
    materialsListElem.innerHTML = 'Matériaux :<br>';
    for (let mat in state.inventory) {
        materialsListElem.innerHTML += `${mat}: ${state.inventory[mat]}<br>`;
    }

    craftingRecipesElem.innerHTML = '';
    state.recipes.forEach(recipe => {
        // Check craftability
        const canCraft = canCraft(recipe);
        const btn = document.createElement('button');
        btn.textContent = `${recipe.name} (${recipe.craft_clicks} clics)`;
        btn.disabled = !canCraft;
        btn.onclick = () => craftEquipment(recipe);
        craftingRecipesElem.appendChild(btn);
    });
}

function canCraft(recipe) {
    // Check materials
    for (const material in recipe.materials) {
        if (!state.inventory[material] || state.inventory[material] < recipe.materials[material]) {
            return false;
        }
    }
    // Check craft clicks
    if (state.clicks.craft < recipe.craft_clicks) {
        return false;
    }
    return true;
}

function craftEquipment(recipe) {
    if(!canCraft(recipe)){
        showMessage("Pas assez de ressources ou clics pour cet équipement.");
        return;
    }
    // Deduct materials
    for (const material in recipe.materials) {
        state.inventory[material] -= recipe.materials[material];
    }
    state.clicks.craft -= recipe.craft_clicks;

    // Equip item
    state.equipment[recipe.slot] = recipe;

    // Update hero stats accordingly
    recalcHeroStats();

    showMessage(`Vous avez fabriqué ${recipe.name} !`);
    updateClicks();
    updateHeroStats();
    updateCraftingInterface();
}

// Calculate hero stats based on equipment
function recalcHeroStats() {
    let base = {
        max_hp: 50,
        attack: 10,
        defense: 5,
        speed: 8,
    };
    let eqStats = { hp: 0, attack: 0, defense: 0, speed: 0 };
    for (const slot in state.equipment) {
        const item = state.equipment[slot];
        if (item != null) {
            for (const stat in item.stats) {
                eqStats[stat] += item.stats[stat];
            }
        }
    }
    state.hero.max_hp = base.max_hp + (eqStats.hp || 0);
    if(state.hero.hp > state.hero.max_hp) state.hero.hp = state.hero.max_hp;
    state.hero.attack = base.attack + (eqStats.attack || 0);
    state.hero.defense = base.defense + (eqStats.defense || 0);
    state.hero.speed = base.speed + (eqStats.speed || 0);
}

// Expedition logic
function enterRoom(room) {
    if (state.clicks.adventure <= 0) {
        finishExpedition('death', 'Clics d\'aventure épuisés');
        return;
    }
    state.clicks.adventure -= 1;
    state.clicks.craft = Math.min(state.clicks.craft + 1, 999);
    updateClicks();

    showMessage(`Exploration de la salle: ${room.name}`);

    if(room.type === 'enemy' || room.type === 'boss') {
        startCombat(room);
    } else if(room.type === 'treasure_trap') {
        handleTreasureTrap(room);
    } else if(room.type === 'special' || room.type === 'treasure') {
        handleSpecialRoom(room);
    } else {
        // Empty or unknown room - just advance
        advanceExpedition();
    }
}

function startCombat(room) {
    currentEnemy = cloneEnemy(room.content);
    showCombat(currentEnemy);
}

function cloneEnemy(name) {
    let enemyTemplate = state.enemies.find(en => en.name === name);
    if(!enemyTemplate) return null;
    return JSON.parse(JSON.stringify(enemyTemplate));
}

let currentEnemy = null;

attackButton.onclick = function() { performAttack(false); };
powerAttackButton.onclick = function() { performAttack(true); };

function performAttack(power) {
    let cost = power ? 3 : 1;
    if(state.clicks.adventure < cost) {
        showMessage('Pas assez de clics d\'aventure pour cette attaque.');
        return;
    }
    state.clicks.adventure -= cost;
    updateClicks();

    let heroAttack = state.hero.attack * (power ? 1.5 : 1);
    let damage = Math.max(0, heroAttack - currentEnemy.defense);
    currentEnemy.hp -= damage;
    combatInfoElem.textContent = `Vous infligez ${damage} dégâts à ${currentEnemy.name}. PV restants: ${Math.max(0, currentEnemy.hp)}`;

    if(currentEnemy.hp <= 0) {
        winCombat();
        return;
    }
    enemyAttack();
}

function enemyAttack() {
    let damage = Math.max(0, currentEnemy.attack - state.hero.defense);
    state.hero.hp -= damage;
    updateHeroStats();
    showMessage(`Le ${currentEnemy.name} vous attaque et inflige ${damage} dégâts. PV restants: ${Math.max(0, state.hero.hp)}`);

    if(state.hero.hp <= 0 || state.clicks.adventure <= 0) {
        finishExpedition('death', 'Vous êtes mort ou plus aucun clic disponible.');
    }
}

function winCombat() {
    showMessage(`Vous avez vaincu ${currentEnemy.name} !`);

    gainXP(currentEnemy.xp);
    gainMaterials(currentEnemy.materials);

    updateHeroStats();
    updateClicks();

    currentEnemy = null;
    showCombat(null);
    advanceExpedition();
}

function gainXP(xp) {
    state.hero.experience += xp;
    if(state.hero.experience >= state.hero.experience_to_next) {
        state.hero.experience -= state.hero.experience_to_next;
        state.hero.level++;
        state.hero.experience_to_next = Math.floor(state.hero.experience_to_next * 1.3);
        showMessage(`Félicitations, vous êtes passé au niveau ${state.hero.level} !`);
    }
}

function gainMaterials(materials) {
    for (let key in materials) {
        if(state.inventory[key] === undefined) state.inventory[key] = 0;
        state.inventory[key] += materials[key];
    }
}

function handleTreasureTrap(room) {
    let success = Math.random() < 0.7;
    if(success) {
        gainMaterials(room.content.success);
        showMessage(`Vous avez désamorcé le piège et trouvé un trésor !`);
    } else {
        state.hero.hp -= room.content.failure.damage;
        updateHeroStats();
        showMessage(`Le piège vous a blessé ! Perte de PV.`);
        if(state.hero.hp <= 0) {
            finishExpedition('death', 'Vous avez succombé au piège.');
            return;
        }
    }
    updateClicks();
    advanceExpedition();
}

function handleSpecialRoom(room) {
    if(room.content.craft_clicks !== undefined) {
        state.clicks.craft = Math.min(state.clicks.craft + room.content.craft_clicks, 999);
        showMessage(`Vous gagnez ${room.content.craft_clicks} clic(s) d'artisanat !`);
    }
    for(let mat in room.content) {
        if(mat !== 'craft_clicks'){
            if(state.inventory[mat] === undefined) state.inventory[mat] = 0;
            state.inventory[mat] += room.content[mat];
        }
    }
    updateClicks();
    advanceExpedition();
}

function advanceExpedition() {
    if(state.expedition_level >= 3) {
        finishExpedition('boss_defeated', 'Vous avez défait le Boss ! +20 clics d\'aventure.');
    } else {
        state.expedition_level++;
        updateExplorationChoices();
    }
}

function finishExpedition(result, message) {
    if(result === 'death') {
        state.clicks.adventure += 10;
    } else if(result === 'boss_defeated') {
        state.clicks.adventure += 20;
    }
    state.expedition_count++;
    state.expedition_level = 0;
    state.expedition_path = [];
    state.hero.hp = state.hero.max_hp;
    updateHeroStats();
    updateClicks();
    updateExpeditionCount();
    showMessage(message);
    showExploration();
}

// Button event handlers
btnEnterDungeon.onclick = () => {
    showExploration();
    state.expedition_level = 0;
    updateExplorationChoices();
};
btnBackToBase.onclick = () => {
    showExploration();
};
btnOpenCrafting.onclick = () => {
    showCrafting();
};
btnBackToExploration.onclick = () => {
    showExploration();
};
btnReset.onclick = () => {
    window.location.reload();
};

// Initialization
updateClicks();
updateHeroStats();
updateExpeditionCount();
showMessage('Bienvenue dans le prototype Reverse Clicker RPG V2.');
