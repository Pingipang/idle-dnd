import { updateUI } from "./ui.js";

export function createCombatUI(player) {

    const popup = document.getElementById("combatPopup");

    const pName = document.getElementById("combatPlayerName");
    const pHPText = document.getElementById("combatPlayerHPText");
    const pHPBar = document.getElementById("combatPlayerHPBar");
    const pDMG = document.getElementById("combatPlayerDMG");
    const pDEF = document.getElementById("combatPlayerDEF");

    const eName = document.getElementById("combatEnemyName");
    const eHPText = document.getElementById("combatEnemyHPText");
    const eHPBar = document.getElementById("combatEnemyHPBar");
    const eDMG = document.getElementById("combatEnemyDMG");

    const logEl = document.getElementById("combatLog");
    const itemsEl = document.getElementById("combatItems");
    const skillsEl = document.getElementById("combatSkills");

    // Show popup
    function show(enemy) {
        popup.classList.remove("hidden");

        // Player
        pName.textContent = player.name || "Játékos";
        pHPText.textContent = `${player.hp} / ${player.maxHP}`;
        pHPBar.style.width = (player.hp / player.maxHP) * 100 + "%";
        pDMG.textContent = player.dmg;
        pDEF.textContent = player.def;

        // Enemy
        eName.textContent = enemy.name;
        eHPText.textContent = `${enemy.hp} / ${enemy.maxHP}`;
        eHPBar.style.width = "100%";
        eDMG.textContent = enemy.dmg;

        logEl.textContent = "Csata indul…";
    }

    // Update during combat
    function update(message, enemy) {
        logEl.textContent = message;

        // Player update
        pHPText.textContent = `${player.hp} / ${player.maxHP}`;
        pHPBar.style.width = (player.hp / player.maxHP) * 100 + "%";
        pDMG.textContent = player.dmg;

        // Enemy update
        if (enemy) {
            eHPText.textContent = `${enemy.hp} / ${enemy.maxHP}`;
            eHPBar.style.width = (enemy.hp / enemy.maxHP) * 100 + "%";
        }
    }

    // Show usable items
    function updateItems(items, onUseItem) {
        itemsEl.innerHTML = "";

        if (items.length === 0) {
            itemsEl.innerHTML = '<p class="text-gray-500 text-xs">Nincs használható tárgy</p>';
            return;
        }

        items.forEach(item => {
            const btn = document.createElement("button");
            btn.className = "px-2 py-1 bg-green-700 rounded hover:bg-green-800 transition-all";
            btn.textContent = `${item.name} (${item.quantity})`;

            btn.addEventListener("click", () => onUseItem(item));

            itemsEl.appendChild(btn);
        });
    }

    // Show active skills
    function updateSkills(skillSystem, onUseSkill) {
        skillsEl.innerHTML = "";

        const activeSkills = skillSystem.getActiveSkills();

        if (activeSkills.length === 0) {
            skillsEl.innerHTML = '<p class="text-gray-500 text-xs">Nincs aktív skill</p>';
            return;
        }

        activeSkills.forEach(skill => {
            const cooldown = skillSystem.getCooldown(skill.id);
            const isOnCD = cooldown > 0;

            const btn = document.createElement("button");
            btn.className = `px-2 py-1 bg-purple-700 rounded hover:bg-purple-800 transition-all ${isOnCD ? 'opacity-50 cursor-not-allowed' : ''}`;
            btn.textContent = `${skill.name} ${isOnCD ? `(${cooldown})` : ''}`;
            btn.disabled = isOnCD;

            btn.addEventListener("click", () => onUseSkill(skill.id));

            skillsEl.appendChild(btn);
        });
    }

    function hide(message, loot) {
        popup.classList.add("hidden");

        setTimeout(() => {
            alert(message);
            if (loot) {
                alert(`Loot: ${loot.quantity}× ${loot.name}`);
            }
        }, 50);
    }

    return {
        show,
        update,
        updateItems,
        updateSkills,
        hide
    };
}