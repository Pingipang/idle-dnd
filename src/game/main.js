import { createDungeon } from "../core/dungeon.js"
import { createPlayer } from "../core/player.js";
import { randomEvent } from "../core/events.js";
import { updateUI, updateInventoryUI, setEventText, updateLevelUI, updateSkillUI, updateQuestUI, updateEquipmentUI, updateBiomeUI } from "../ui/ui.js";
import { createInventory } from "../core/inventory.js"
import { getLoot, getEquipmentLoot } from "../core/loot.js";
import { spawnEnemy, spawnEnemyFromBiome } from "../core/enemy.js";
import { createCombatSystem } from "../combat/combat.js";
import { createCombatUI } from "../ui/ui-combat.js";
import { createLevelSystem } from "../core/level-system.js";
import { createSkillSystem } from "../core/skill-system.js";
import { createQuestSystem } from "../core/quest-system.js";
import { createEquipmentSystem } from "../core/equipment.js";
import { getRandomEventFromBiome } from "../core/biomes.js";
import { getBossByLevel, spawnBoss } from "../core/bosses.js";

// === INITIALIZATION ===
const GRID_WIDTH = 12;
const GRID_HEIGHT = 10;

const dungeon = createDungeon(GRID_WIDTH, GRID_HEIGHT);
const player = createPlayer(0, 0);
const inventory = createInventory();
const levelSystem = createLevelSystem();
const skillSystem = createSkillSystem();
const questSystem = createQuestSystem();
const equipmentSystem = createEquipmentSystem();

let autoMoveEnabled = true;
let autoMoveInterval = null;
let isInCombat = false;
let currentBiome = null;
let stepCount = 0;
let combatDamageTaken = 0;

// Temporary combat buffs (reset after combat)
let tempCombatBuffs = {
    dmg: 0,
    def: 0
};

// Initialize quest system
questSystem.initialize();

// Update player stats with equipment
function updatePlayerWithEquipment() {
    const equipStats = equipmentSystem.getTotalStats();
    player.updateStats(equipStats);
    updateUI(player);
}

// === EQUIPMENT FUNCTIONS ===
function equipItem(item) {
    const oldItem = equipmentSystem.equip(item);
    
    if (oldItem) {
        // Put old item back to inventory
        inventory.addItem(oldItem.name, 1, "equipment", 0, oldItem);
    }
    
    // Remove new item from inventory
    inventory.removeItem(item.name, 1);
    
    updatePlayerWithEquipment();
    updateEquipmentUI(equipmentSystem);
    updateInventoryUI(inventory);
    setEventText(`Felszereltél: ${item.name}!`);
}

function unequipSlot(slot) {
    const item = equipmentSystem.unequip(slot);
    
    if (item) {
        inventory.addItem(item.name, 1, "equipment", 0, item);
        updatePlayerWithEquipment();
        updateEquipmentUI(equipmentSystem);
        updateInventoryUI(inventory);
        setEventText(`Levetted: ${item.name}`);
    }
}

// Make unequip available globally for HTML onclick
window.unequipSlot = unequipSlot;

// === ITEM USE FUNCTION ===
function useItemInCombat(item) {
    if (item.type === "heal") {
        player.hp = Math.min(player.maxHP, player.hp + item.amount);
        inventory.removeItem(item.name, 1);
        combatUI.update(`Használtál egy ${item.name}-t! +${item.amount} HP`, combat.currentEnemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        updateUI(player);
        updateInventoryUI(inventory);
    } else if (item.type === "buff") {
        tempCombatBuffs.dmg += item.amount;
        player.dmg += item.amount;
        
        inventory.removeItem(item.name, 1);
        combatUI.update(`Használtál egy ${item.name}-t! +${item.amount} DMG (harc végéig)`, combat.currentEnemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        updateUI(player);
        updateInventoryUI(inventory);
    }
}

// === RESET COMBAT BUFFS ===
function resetCombatBuffs() {
    player.dmg -= tempCombatBuffs.dmg;
    player.def -= tempCombatBuffs.def;
    
    tempCombatBuffs = {
        dmg: 0,
        def: 0
    };
    
    updateUI(player);
}

// === SKILL USE FUNCTION ===
function useSkillInCombat(skillId) {
    combat.useSkill(skillId);
    combatUI.updateSkills(skillSystem, useSkillInCombat);
}

// === LEARN SKILL FUNCTION ===
function learnSkill(skillId) {
    if (skillSystem.learnSkill(skillId, player, levelSystem)) {
        updatePlayerWithEquipment();
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        setEventText(`Skill megtanulva: ${skillId}`);
    } else {
        setEventText(`Nem sikerült megtanulni a skillt!`);
    }
}

// === QUEST REWARD HANDLER ===
function handleQuestRewards(completedQuests) {
    completedQuests.forEach(({ quest, rewards }) => {
        let message = `✅ Quest befejezve: ${quest.title}!`;
        
        if (rewards.xp) {
            const leveledUp = levelSystem.addXP(rewards.xp);
            message += `\n+${rewards.xp} XP`;
            
            if (leveledUp) {
                message += `\n🎉 LEVEL UP!`;
                updateLevelUI(levelSystem);
                updateSkillUI(skillSystem, learnSkill);
            }
        }
        
        if (rewards.gold) {
            message += `\n+${rewards.gold} Arany`;
            inventory.addItem("Arany", rewards.gold, "misc", 0);
        }
        
        if (rewards.item) {
            inventory.addItem(rewards.item.name, rewards.item.quantity, rewards.item.type, rewards.item.amount);
            message += `\n+${rewards.item.quantity}× ${rewards.item.name}`;
        }
        
        alert(message);
        updateInventoryUI(inventory);
        updateQuestUI(questSystem);
    });
}

// === COMBAT SYSTEM SETUP ===
const combatUI = createCombatUI(player);

const combat = createCombatSystem(
    player,
    inventory,
    levelSystem,
    skillSystem,
    (enemy) => {
        isInCombat = true;
        combatDamageTaken = 0;
        stopAutoMove();
        combatUI.show(enemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    },
    (message, loot, leveledUp) => {
        isInCombat = false;
        
        // Check survive quests
        const surviveQuests = questSystem.checkSurvive(player.hp, player.maxHP, combatDamageTaken);
        
        // Check boss quest if enemy was boss
        let bossQuests = [];
        if (combat.currentEnemy && combat.currentEnemy.isBoss) {
            bossQuests = questSystem.checkBoss();
        }
        
        // Check kill quest
        let killQuests = [];
        if (combat.currentEnemy) {
            killQuests = questSystem.checkKill(combat.currentEnemy.name);
        }
        
        resetCombatBuffs();
        
        combatUI.hide(message, loot);
        
        if (loot) {
            if (loot.isEquipment) {
                inventory.addItem(loot.name, 1, "equipment", 0, loot);
                alert(`⚔️ Equipment szerzés: ${loot.name} [${loot.rarity}]`);
            } else {
                inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
            }
        }
        
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        updateQuestUI(questSystem);
        
        // Handle quest rewards
        handleQuestRewards([...surviveQuests, ...bossQuests, ...killQuests]);
        
        if (autoMoveEnabled) startAutoMove();
    },
    (message, enemy) => {
        combatUI.update(message, enemy);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    }
);

// Track damage taken for quest
const originalPlayerHP = player.hp;
setInterval(() => {
    if (isInCombat && player.hp < originalPlayerHP) {
        combatDamageTaken += (originalPlayerHP - player.hp);
    }
}, 100);

// Add starting items
inventory.addItem("Gyógyital", 2, "heal", 10);

// === DRAW INITIAL STATE ===
currentBiome = dungeon.getCurrentBiome(player.x, player.y);
dungeon.draw(player);
updateUI(player);
updateInventoryUI(inventory);
updateLevelUI(levelSystem);
updateSkillUI(skillSystem, learnSkill);
updateQuestUI(questSystem);
updateEquipmentUI(equipmentSystem);
updateBiomeUI(currentBiome);

// === HANDLE STEP ===
function handleStep() {
    stepCount++;
    
    // Update current biome
    currentBiome = dungeon.getCurrentBiome(player.x, player.y);
    updateBiomeUI(currentBiome);
    
    dungeon.draw(player);
    updateUI(player);
    
    // Check explore quest
    const exploreQuests = questSystem.checkExplore();
    handleQuestRewards(exploreQuests);

    // Boss chance every 50 steps or at level milestones
    if (stepCount % 50 === 0 || (levelSystem.level % 5 === 0 && Math.random() < 0.1)) {
        const bossData = getBossByLevel(levelSystem.level);
        const boss = spawnBoss(bossData);
        combat.startCombat(boss);
        setEventText(`🐉 BOSS MEGJELENT: ${boss.name}!`);
        return;
    }

    // Combat spawn chance (biome affects spawn rate)
    const spawnChance = currentBiome ? 0.25 : 0.2;
    if (!isInCombat && Math.random() < spawnChance) {
        const enemy = currentBiome ? spawnEnemyFromBiome(currentBiome) : spawnEnemy();
        combat.startCombat(enemy);
        return;
    }

    // Biome-specific event or random event
    const eventText = currentBiome ? getRandomEventFromBiome(currentBiome) : randomEvent();
    setEventText(eventText);

    // Loot chance (biome affects loot bonus)
    const lootChance = currentBiome ? 0.25 * currentBiome.lootBonus : 0.25;
    if (!isInCombat && Math.random() < lootChance) {
        const loot = getLoot(levelSystem.level);
        if (loot) {
            if (loot.isEquipment) {
                inventory.addItem(loot.name, 1, "equipment", 0, loot);
                setEventText(`⚔️ Találtál equipment-et: ${loot.name} [${loot.rarity}]!`);
            } else {
                inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
                setEventText(`Találtál: ${loot.quantity}× ${loot.name}!`);
                
                // Check collect quest
                const collectQuests = questSystem.checkCollect(loot.name, loot.quantity);
                handleQuestRewards(collectQuests);
            }
            updateInventoryUI(inventory);
        }
    }
}

// === AUTO MOVE ===
function autoStep() {
    if (isInCombat) return;
    player.moveRandom(dungeon.width, dungeon.height);
    handleStep();
}

function startAutoMove() {
    if (autoMoveInterval) clearInterval(autoMoveInterval);
    autoMoveInterval = setInterval(autoStep, 2000);
}

function stopAutoMove() {
    if (autoMoveInterval) {
        clearInterval(autoMoveInterval);
        autoMoveInterval = null;
    }
}

// === MANUAL MOVE ===
function movePlayer(dx, dy) {
    if (isInCombat) return;

    const moved = player.move(dx, dy, dungeon.width, dungeon.height);
    if (moved) {
        handleStep();
    }
}

// === EXTRA ACTIONS ===
function toggleAuto() {
    autoMoveEnabled = !autoMoveEnabled;
    const text = document.getElementById("autoText");

    if (autoMoveEnabled) {
        text.textContent = "⏸️ Auto: BE";
        startAutoMove();
    } else {
        text.textContent = "▶️ Auto: KI";
        stopAutoMove();
    }
}

function searchForLoot() {
    if (isInCombat) return;

    const loot = getLoot(levelSystem.level);
    if (loot) {
        if (loot.isEquipment) {
            inventory.addItem(loot.name, 1, "equipment", 0, loot);
            setEventText(`⚔️ Keresés sikeres! Találtál: ${loot.name} [${loot.rarity}]!`);
        } else {
            inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
            setEventText(`Keresés sikeres! Találtál: ${loot.quantity}× ${loot.name}!`);
            
            const collectQuests = questSystem.checkCollect(loot.name, loot.quantity);
            handleQuestRewards(collectQuests);
        }
        updateInventoryUI(inventory);
    } else {
        setEventText("Nem találtál semmit...");
    }
}

function teleportRandom() {
    if (isInCombat) return;

    player.teleport(dungeon.width, dungeon.height);
    currentBiome = dungeon.getCurrentBiome(player.x, player.y);
    dungeon.draw(player);
    updateUI(player);
    updateBiomeUI(currentBiome);
    setEventText("⚡ Teleportáltál egy új helyre!");
}

function resetGame() {
    if (confirm("Biztosan újrakezded a játékot?")) {
        player.reset(0, 0);
        inventory.clear();
        levelSystem.reset();
        equipmentSystem.clear();
        resetCombatBuffs();
        stepCount = 0;

        dungeon.regenerateBiomes();
        currentBiome = dungeon.getCurrentBiome(player.x, player.y);
        
        updatePlayerWithEquipment();
        dungeon.draw(player);
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        updateQuestUI(questSystem);
        updateEquipmentUI(equipmentSystem);
        updateBiomeUI(currentBiome);
        setEventText("Új kaland kezdődik!");
    }
}

// === STAT SPENDING ===
function spendStat(stat) {
    if (levelSystem.spendStatPoint(stat, player)) {
        updatePlayerWithEquipment();
        updateLevelUI(levelSystem);
        setEventText(`Stat növelve: ${stat.toUpperCase()}`);
    }
}

// === INVENTORY CLICK (EQUIP) ===
document.getElementById("inventoryPanel").addEventListener("click", (e) => {
    if (e.target.tagName === "P" && e.target.textContent.includes("[")) {
        const items = inventory.getItems();
        const clickedText = e.target.textContent;
        
        const equipmentItem = items.find(item => 
            item.isEquipment && clickedText.includes(item.name)
        );
        
        if (equipmentItem && confirm(`Felszereled: ${equipmentItem.name}?`)) {
            equipItem(equipmentItem);
        }
    }
});

// === BUTTON EVENTS ===
document.getElementById("btnUp").addEventListener("click", () => movePlayer(0, -1));
document.getElementById("btnDown").addEventListener("click", () => movePlayer(0, 1));
document.getElementById("btnLeft").addEventListener("click", () => movePlayer(-1, 0));
document.getElementById("btnRight").addEventListener("click", () => movePlayer(1, 0));
document.getElementById("btnStay").addEventListener("click", () => movePlayer(0, 0));

document.getElementById("btnToggleAuto").addEventListener("click", toggleAuto);
document.getElementById("btnSearch").addEventListener("click", searchForLoot);
document.getElementById("btnTeleport").addEventListener("click", teleportRandom);
document.getElementById("btnReset").addEventListener("click", resetGame);

// === STAT BUTTONS ===
document.getElementById("btnStatHP").addEventListener("click", () => spendStat("hp"));
document.getElementById("btnStatDMG").addEventListener("click", () => spendStat("dmg"));
document.getElementById("btnStatDEF").addEventListener("click", () => spendStat("def"));
document.getElementById("btnStatLuck").addEventListener("click", () => spendStat("luck"));

// === COMBAT BUTTONS ===
document.getElementById("btnCombatAttack").addEventListener("click", () => {
    if (isInCombat) combat.attack();
});

document.getElementById("btnCombatDefend").addEventListener("click", () => {
    if (isInCombat) combat.defend();
});

document.getElementById("btnCombatFlee").addEventListener("click", () => {
    if (isInCombat) combat.flee();
});

// === KEYBOARD ===
document.addEventListener("keydown", (e) => {
    if (isInCombat) return;

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") movePlayer(0, -1);
    else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") movePlayer(0, 1);
    else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") movePlayer(-1, 0);
    else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") movePlayer(1, 0);
    else if (e.key === " ") {
        e.preventDefault();
        searchForLoot();
    }
});

// === START AUTO ===
startAutoMove();