import { createDungeon } from "../core/dungeon-grid.js"
import { createPlayer } from "../core/player.js";
import { updateUI, updateInventoryUI, setEventText, updateLevelUI, updateSkillUI, updateQuestUI, updateEquipmentUI, updateWorldMapUI, updateRegionDungeonsUI, updateCurrentDungeonUI } from "../ui/ui.js";
import { createInventory } from "../core/inventory.js"
import { getLoot } from "../core/loot.js";
import { spawnEnemy } from "../core/enemy.js";
import { createCombatSystem } from "../combat/combat.js";
import { createCombatUI } from "../ui/ui-combat.js";
import { createLevelSystem } from "../core/level-system.js";
import { createSkillSystem } from "../core/skill-system.js";
import { createQuestSystem } from "../core/quest-system.js";
import { createEquipmentSystem } from "../core/equipment.js";
import { createRegionSystem } from "../core/region-system.js";
import { createDungeonSystem } from "../core/dungeon-system.js";
import { getRandomEnemyFromRegion, getRandomEventFromRegion } from "../core/regions.js";
import { getBossForRegion, spawnBoss, getBossByName } from "../core/bosses.js";
import { getRandomRegionalQuests } from "../core/quests.js";

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
const regionSystem = createRegionSystem();
const dungeonSystem = createDungeonSystem();

let autoMoveEnabled = true;
let autoMoveInterval = null;
let isInCombat = false;
let combatDamageTaken = 0;
let currentView = "worldmap"; // "worldmap" | "region" | "dungeon"
let tempCombatBuffs = { dmg: 0, def: 0 };

// Initialize regional quests
function initializeRegionalQuests() {
    const currentRegion = regionSystem.getCurrentRegion();
    const quests = getRandomRegionalQuests(currentRegion.id, 3);
    quests.forEach(quest => questSystem.addQuest(quest));
}

initializeRegionalQuests();

// Update player stats with equipment
function updatePlayerWithEquipment() {
    const equipStats = equipmentSystem.getTotalStats();
    player.updateStats(equipStats);
    updateUI(player);
}

// === 3-LEVEL NAVIGATION ===

// LEVEL 1: World Map
function showWorldMap() {
    currentView = "worldmap";
    stopAutoMove();
    
    document.getElementById("worldMapView").classList.remove("hidden");
    document.getElementById("regionView").classList.add("hidden");
    document.getElementById("dungeonView").classList.add("hidden");

    // DEBUG
    console.log("=== showWorldMap DEBUG ===");
    console.log("Calling updateWorldMapUI...");
    
    updateWorldMapUI(regionSystem, dungeonSystem, levelSystem.level, selectRegion);

     console.log("worldMapGrid innerHTML:", document.getElementById("worldMapGrid").innerHTML);
    // ... rest of code
    
    document.getElementById("worldMapPlayerLevel").textContent = levelSystem.level;
    document.getElementById("worldMapPlayerHP").textContent = `${player.hp} / ${player.maxHP}`;
    document.getElementById("worldMapPlayerDMG").textContent = player.dmg;
    
    const worldMapQuests = document.getElementById("worldMapQuests");
    const activeQuests = questSystem.getActiveQuests();
    
    if (activeQuests.length > 0) {
        worldMapQuests.innerHTML = activeQuests.map(q => `
            <p class="text-sm text-gray-300 mb-1">• ${q.title} (${q.progress}/${q.targetCount})</p>
        `).join('');
    } else {
        worldMapQuests.innerHTML = '<p class="text-gray-500 text-xs">Nincs aktív quest</p>';
    }
}

// LEVEL 2: Region View (Dungeon List)
function showRegionView() {
    currentView = "region";
    stopAutoMove();
    
    document.getElementById("worldMapView").classList.add("hidden");
    document.getElementById("regionView").classList.remove("hidden");
    document.getElementById("dungeonView").classList.add("hidden");
    
    const currentRegion = regionSystem.getCurrentRegion();
    const regionHeader = document.getElementById("regionViewHeader");
    
    regionHeader.innerHTML = `
        <div class="text-center">
            <h2 class="text-3xl font-bold mb-2" style="color: ${currentRegion.color}">
                ${currentRegion.emoji} ${currentRegion.name}
            </h2>
            <p class="text-gray-400">${currentRegion.description}</p>
        </div>
    `;
    
    updateRegionDungeonsUI(regionSystem, dungeonSystem, selectDungeon);
}

// LEVEL 3: Dungeon View (Grid Game)
function showDungeonView() {
    currentView = "dungeon";
    
    document.getElementById("worldMapView").classList.add("hidden");
    document.getElementById("regionView").classList.add("hidden");
    document.getElementById("dungeonView").classList.remove("hidden");
    
    updateCurrentDungeonUI(dungeonSystem);
    dungeon.draw(player);
    
    if (autoMoveEnabled) startAutoMove();
}

// Select Region (World Map → Region View)
function selectRegion(regionId) {
    const result = regionSystem.changeRegion(regionId, levelSystem.level, dungeonSystem);
    
    if (result.success) {
        questSystem.clearActiveQuests();
        const quests = getRandomRegionalQuests(regionId, 3);
        quests.forEach(q => questSystem.addQuest(q));
        
        updateQuestUI(questSystem);
        showRegionView();
    } else {
        alert(`Cannot enter region: ${result.reason}`);
    }
}

// Select Dungeon (Region View → Dungeon View)
function selectDungeon(dungeonId) {
    const result = dungeonSystem.enterDungeon(dungeonId);
    
    if (result.success) {
        player.x = 0;
        player.y = 0;
        player.hp = player.maxHP; // Full HP on dungeon enter
        
        updateUI(player);
        showDungeonView();
    } else {
        alert(`Cannot enter dungeon: ${result.reason}`);
    }
}

// Exit Dungeon → Region View
function exitDungeon(reason = "exited") {
    dungeonSystem.exitDungeon();
    
    if (reason === "death") {
        setEventText("💀 You died! Returning to region...");
    } else if (reason === "victory") {
        setEventText("🎉 Dungeon completed!");
    }
    
    showRegionView();
}

// === EQUIPMENT FUNCTIONS ===
function equipItem(item) {
    const oldItem = equipmentSystem.equip(item);
    
    if (oldItem) {
        inventory.addItem(oldItem.name, 1, "equipment", 0, oldItem);
    }
    
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
        combatUI.update(`Használtál egy ${item.name}-t! +${item.amount} DMG`, combat.currentEnemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        updateUI(player);
        updateInventoryUI(inventory);
    }
}

function resetCombatBuffs() {
    player.dmg -= tempCombatBuffs.dmg;
    player.def -= tempCombatBuffs.def;
    tempCombatBuffs = { dmg: 0, def: 0 };
    updateUI(player);
}

// === SKILL FUNCTIONS ===
function useSkillInCombat(skillId) {
    combat.useSkill(skillId);
    combatUI.updateSkills(skillSystem, useSkillInCombat);
}

function learnSkill(skillId) {
    if (skillSystem.learnSkill(skillId, player, levelSystem)) {
        updatePlayerWithEquipment();
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        setEventText(`Skill megtanulva: ${skillId}`);
    }
}

// === QUEST REWARDS ===
function handleQuestRewards(completedQuests) {
    completedQuests.forEach(({ quest, rewards }) => {
        let message = `✅ Quest: ${quest.title}!`;
        
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
            message += `\n+${rewards.gold} Gold`;
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

// === COMBAT SYSTEM ===
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
        
        // Apply dungeon difficulty multiplier
        const currentDungeon = dungeonSystem.getCurrentDungeon();
        if (currentDungeon) {
            enemy.hp = Math.floor(enemy.hp * currentDungeon.difficulty);
            enemy.maxHP = Math.floor(enemy.maxHP * currentDungeon.difficulty);
            enemy.dmg = Math.floor(enemy.dmg * currentDungeon.difficulty);
        }
        
        combatUI.show(enemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    },
    (message, loot, leveledUp) => {
        isInCombat = false;
        
        // Track progress
        if (combat.currentEnemy) {
            dungeonSystem.addEnemyKill();
            regionSystem.addEnemyKill(combat.currentEnemy.name);
            
            if (combat.currentEnemy.isBoss) {
                regionSystem.defeatBoss(combat.currentEnemy.name);
                dungeonSystem.completeDungeon(true);
                
                const bossQuests = questSystem.checkBoss();
                handleQuestRewards(bossQuests);
                
                setTimeout(() => {
                    alert("🎉 BOSS DEFEATED! Dungeon Completed!");
                    exitDungeon("victory");
                }, 500);
            }
            
            const killQuests = questSystem.checkKill(combat.currentEnemy.name);
            handleQuestRewards(killQuests);
        }
        
        const surviveQuests = questSystem.checkSurvive(player.hp, player.maxHP, combatDamageTaken);
        handleQuestRewards(surviveQuests);
        
        resetCombatBuffs();
        combatUI.hide(message, loot);
        
        if (loot) {
            if (loot.isEquipment) {
                inventory.addItem(loot.name, 1, "equipment", 0, loot);
                alert(`⚔️ Equipment: ${loot.name} [${loot.rarity}]`);
            } else {
                inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
            }
        }
        
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        updateQuestUI(questSystem);
        updateCurrentDungeonUI(dungeonSystem);
        
        if (autoMoveEnabled && currentView === "dungeon") startAutoMove();
    },
    (message, enemy) => {
        combatUI.update(message, enemy);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    }
);

// Override player death in combat
const originalHidePopup = combatUI.hide;
combatUI.hide = function(message, loot) {
    if (player.hp <= 0) {
        player.hp = player.maxHP;
        updateUI(player);
        dungeonSystem.completeDungeon(false);
        
        originalHidePopup.call(this, "💀 You died!", null);
        
        setTimeout(() => {
            exitDungeon("death");
        }, 100);
    } else {
        originalHidePopup.call(this, message, loot);
    }
};

// Starting items
inventory.addItem("Gyógyital", 2, "heal", 10);

// === INITIAL DRAW ===
dungeon.draw(player);
updateUI(player);
updateInventoryUI(inventory);
updateLevelUI(levelSystem);
updateSkillUI(skillSystem, learnSkill);
updateQuestUI(questSystem);
updateEquipmentUI(equipmentSystem);

// Start on World Map
showWorldMap();

// DEBUG
console.log("=== DEBUG ===");
console.log("worldMapView elem:", document.getElementById("worldMapView"));
console.log("worldMapGrid elem:", document.getElementById("worldMapGrid"));
console.log("currentView:", currentView);

// === GAME STEP (Dungeon only) ===
function handleStep() {
    const currentRegion = regionSystem.getCurrentRegion();
    const currentDungeon = dungeonSystem.getCurrentDungeon();
    
    dungeon.draw(player);
    updateUI(player);
    updateCurrentDungeonUI(dungeonSystem);
    
    const exploreQuests = questSystem.checkExplore();
    handleQuestRewards(exploreQuests);

    // Boss spawn in dungeon
    if (currentDungeon && currentDungeon.hasBoss) {
        const progress = dungeonSystem.getCurrentProgress();
        
        if (progress.enemiesKilled >= currentDungeon.enemyCount && Math.random() < 0.1) {
            const bossData = getBossByName(currentDungeon.bossName);
            const boss = spawnBoss(bossData);
            combat.startCombat(boss);
            setEventText(`👑 BOSS: ${boss.name}!`);
            return;
        }
    }

    // Normal enemy spawn
    if (!isInCombat && Math.random() < 0.25) {
        const enemyName = getRandomEnemyFromRegion(currentRegion);
        const enemy = spawnEnemy(enemyName);
        combat.startCombat(enemy);
        return;
    }

    const eventText = getRandomEventFromRegion(currentRegion);
    setEventText(eventText);

    // Loot
    const lootChance = 0.25 * (currentRegion.lootBonus || 1.0);
    if (!isInCombat && Math.random() < lootChance) {
        const loot = getLoot(levelSystem.level);
        if (loot) {
            if (loot.isEquipment) {
                inventory.addItem(loot.name, 1, "equipment", 0, loot);
                setEventText(`⚔️ ${loot.name} [${loot.rarity}]!`);
            } else {
                inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
                setEventText(`${loot.quantity}× ${loot.name}!`);
                
                const collectQuests = questSystem.checkCollect(loot.name, loot.quantity);
                handleQuestRewards(collectQuests);
            }
            updateInventoryUI(inventory);
        }
    }
}

// === AUTO MOVE ===
function autoStep() {
    if (isInCombat || currentView !== "dungeon") return;
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
    if (isInCombat || currentView !== "dungeon") return;

    const moved = player.move(dx, dy, dungeon.width, dungeon.height);
    if (moved) handleStep();
}

// === ACTIONS ===
function toggleAuto() {
    autoMoveEnabled = !autoMoveEnabled;
    const text = document.getElementById("autoText");

    if (autoMoveEnabled) {
        text.textContent = "⏸️ Auto: BE";
        if (currentView === "dungeon") startAutoMove();
    } else {
        text.textContent = "▶️ Auto: KI";
        stopAutoMove();
    }
}

function searchForLoot() {
    if (isInCombat || currentView !== "dungeon") return;

    const loot = getLoot(levelSystem.level);
    if (loot) {
        if (loot.isEquipment) {
            inventory.addItem(loot.name, 1, "equipment", 0, loot);
            setEventText(`⚔️ ${loot.name}!`);
        } else {
            inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
            setEventText(`${loot.quantity}× ${loot.name}!`);
            
            const collectQuests = questSystem.checkCollect(loot.name, loot.quantity);
            handleQuestRewards(collectQuests);
        }
        updateInventoryUI(inventory);
    } else {
        setEventText("Nem találtál semmit...");
    }
}

function teleportRandom() {
    if (isInCombat || currentView !== "dungeon") return;

    player.teleport(dungeon.width, dungeon.height);
    dungeon.draw(player);
    updateUI(player);
    setEventText("⚡ Teleport!");
}

function resetGame() {
    if (confirm("Reset game?")) {
        player.reset(0, 0);
        inventory.clear();
        levelSystem.reset();
        equipmentSystem.clear();
        regionSystem.reset();
        dungeonSystem.reset();
        resetCombatBuffs();

        updatePlayerWithEquipment();
        dungeon.draw(player);
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        updateQuestUI(questSystem);
        updateEquipmentUI(equipmentSystem);
        
        showWorldMap();
    }
}

function spendStat(stat) {
    if (levelSystem.spendStatPoint(stat, player)) {
        updatePlayerWithEquipment();
        updateLevelUI(levelSystem);
    }
}

// === INVENTORY CLICK ===
document.getElementById("inventoryPanel").addEventListener("click", (e) => {
    if (e.target.tagName === "P" && e.target.textContent.includes("[")) {
        const items = inventory.getItems();
        const clickedText = e.target.textContent;
        
        const equipmentItem = items.find(item => 
            item.isEquipment && clickedText.includes(item.name)
        );
        
        if (equipmentItem && confirm(`Equip: ${equipmentItem.name}?`)) {
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

document.getElementById("btnStatHP").addEventListener("click", () => spendStat("hp"));
document.getElementById("btnStatDMG").addEventListener("click", () => spendStat("dmg"));
document.getElementById("btnStatDEF").addEventListener("click", () => spendStat("def"));
document.getElementById("btnStatLuck").addEventListener("click", () => spendStat("luck"));

document.getElementById("btnCombatAttack").addEventListener("click", () => {
    if (isInCombat) combat.attack();
});

document.getElementById("btnCombatDefend").addEventListener("click", () => {
    if (isInCombat) combat.defend();
});

document.getElementById("btnCombatFlee").addEventListener("click", () => {
    if (isInCombat) combat.flee();
});

// === NAVIGATION BUTTONS ===
document.addEventListener("click", (e) => {
    if (e.target.id === "btnBackToWorldMap") showWorldMap();
    if (e.target.id === "btnBackToRegion") exitDungeon();
});

// === KEYBOARD ===
document.addEventListener("keydown", (e) => {
    if (isInCombat || currentView !== "dungeon") return;

    if (e.key === "ArrowUp" || e.key === "w") movePlayer(0, -1);
    else if (e.key === "ArrowDown" || e.key === "s") movePlayer(0, 1);
    else if (e.key === "ArrowLeft" || e.key === "a") movePlayer(-1, 0);
    else if (e.key === "ArrowRight" || e.key === "d") movePlayer(1, 0);
    else if (e.key === " ") {
        e.preventDefault();
        searchForLoot();
    } else if (e.key === "m" || e.key === "M") {
        if (currentView === "dungeon") exitDungeon();
        else if (currentView === "region") showWorldMap();
    }
});