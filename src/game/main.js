import { createDungeon } from "../core/dungeon.js"
import { createPlayer } from "../core/player.js";
import { randomEvent } from "../core/events.js";
import { updateUI, updateInventoryUI, setEventText, updateLevelUI, updateSkillUI } from "../ui/ui.js";
import { createInventory } from "../core/inventory.js"
import { getLoot } from "../core/loot.js";
import { spawnEnemy } from "../core/enemy.js";
import { createCombatSystem } from "../combat/combat.js";
import { createCombatUI } from "../ui/ui-combat.js";
import { createLevelSystem } from "../core/level-system.js";
import { createSkillSystem } from "../core/skill-system.js";

// === INITIALIZATION ===
const GRID_WIDTH = 12;
const GRID_HEIGHT = 10;

const dungeon = createDungeon(GRID_WIDTH, GRID_HEIGHT);
const player = createPlayer(0, 0);
const inventory = createInventory();
const levelSystem = createLevelSystem();
const skillSystem = createSkillSystem();

let autoMoveEnabled = true;
let autoMoveInterval = null;
let isInCombat = false;

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
        player.dmg += item.amount;
        inventory.removeItem(item.name, 1);
        combatUI.update(`Használtál egy ${item.name}-t! +${item.amount} DMG`, combat.currentEnemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        updateUI(player);
        updateInventoryUI(inventory);
    }
}

// === SKILL USE FUNCTION ===
function useSkillInCombat(skillId) {
    combat.useSkill(skillId);
    combatUI.updateSkills(skillSystem, useSkillInCombat);
}

// === LEARN SKILL FUNCTION ===
function learnSkill(skillId) {
    if (levelSystem.spendSkillPoint()) {
        if (skillSystem.learnSkill(skillId, player)) {
            updateUI(player);
            updateLevelUI(levelSystem);
            updateSkillUI(skillSystem, learnSkill);
            setEventText(`Skill megtanulva: ${skillId}`);
        }
    }
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
        stopAutoMove();
        combatUI.show(enemy);
        combatUI.updateItems(inventory.getUsableItems(), useItemInCombat);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    },
    (message, loot, leveledUp) => {
        isInCombat = false;
        combatUI.hide(message, loot);
        if (loot) {
            inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
        }
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        if (autoMoveEnabled) startAutoMove();
    },
    (message, enemy) => {
        combatUI.update(message, enemy);
        combatUI.updateSkills(skillSystem, useSkillInCombat);
    }
);

// Add starting items
inventory.addItem("Gyógyital", 2, "heal", 10);

// === DRAW INITIAL STATE ===
dungeon.draw(player);
updateUI(player);
updateInventoryUI(inventory);
updateLevelUI(levelSystem);
updateSkillUI(skillSystem, learnSkill);

// === HANDLE STEP ===
function handleStep() {
    dungeon.draw(player);
    updateUI(player);

    // Combat spawn chance
    if (!isInCombat && Math.random() < 0.2) {
        const enemy = spawnEnemy();
        combat.startCombat(enemy);
        return;
    }

    setEventText(randomEvent());

    // Loot chance
    if (!isInCombat && Math.random() < 0.25) {
        const loot = getLoot();
        if (loot) {
            inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
            setEventText(`Találtál: ${loot.quantity}× ${loot.name}!`);
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

    const loot = getLoot();
    if (loot) {
        inventory.addItem(loot.name, loot.quantity, loot.type, loot.amount);
        setEventText(`Keresés sikeres! Találtál: ${loot.quantity}× ${loot.name}!`);
        updateInventoryUI(inventory);
    } else {
        setEventText("Nem találtál semmit...");
    }
}

function teleportRandom() {
    if (isInCombat) return;

    player.teleport(dungeon.width, dungeon.height);
    dungeon.draw(player);
    updateUI(player);
    setEventText("⚡ Teleportáltál egy új helyre!");
}

function resetGame() {
    if (confirm("Biztosan újrakezded a játékot?")) {
        player.reset(0, 0);
        inventory.clear();
        levelSystem.reset();

        dungeon.draw(player);
        updateUI(player);
        updateInventoryUI(inventory);
        updateLevelUI(levelSystem);
        updateSkillUI(skillSystem, learnSkill);
        setEventText("Új kaland kezdődik!");
    }
}

// === STAT SPENDING ===
function spendStat(stat) {
    if (levelSystem.spendStatPoint(stat, player)) {
        updateUI(player);
        updateLevelUI(levelSystem);
        setEventText(`Stat növelve: ${stat.toUpperCase()}`);
    }
}

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