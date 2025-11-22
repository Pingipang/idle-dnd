export function updateUI(player) {
    document.getElementById("playerX").textContent = player.x;
    document.getElementById("playerY").textContent = player.y;

    // HP TEXT
    document.getElementById("playerHPText").textContent = `${player.hp} / ${player.maxHP}`;

    // HP BAR
    const percent = (player.hp / player.maxHP) * 100;
    document.getElementById("playerHPBar").style.width = percent + "%";

    // STATS
    document.getElementById("playerDMG").textContent = player.dmg;
    document.getElementById("playerDEF").textContent = player.def;
    document.getElementById("playerLuck").textContent = player.luck;
}

export function updateLevelUI(levelSystem) {
    const progress = levelSystem.getXPProgress();
    
    // Level
    document.getElementById("playerLevel").textContent = levelSystem.level;
    
    // XP text
    document.getElementById("playerXPText").textContent = `${progress.current} / ${progress.needed}`;
    
    // XP bar
    document.getElementById("playerXPBar").style.width = progress.percent + "%";
    
    // Stat points
    const statPointsEl = document.getElementById("statPoints");
    statPointsEl.textContent = levelSystem.statPoints;
    
    // Stat buttons visibility
    const statButtonsEl = document.getElementById("statButtons");
    if (levelSystem.statPoints > 0) {
        statButtonsEl.classList.remove("hidden");
    } else {
        statButtonsEl.classList.add("hidden");
    }

    // Skill points
    const skillPointsEl = document.getElementById("skillPoints");
    if (skillPointsEl) {
        skillPointsEl.textContent = levelSystem.skillPoints;
    }

    // Skill panel visibility
    const skillPanelEl = document.getElementById("skillPanel");
    if (skillPanelEl && levelSystem.skillPoints > 0) {
        skillPanelEl.classList.remove("hidden");
    } else if (skillPanelEl) {
        skillPanelEl.classList.add("hidden");
    }
}

export function updateSkillUI(skillSystem, onLearnSkill) {
    const learnableEl = document.getElementById("learnableSkills");
    if (!learnableEl) return;

    const learnable = skillSystem.getLearnableSkills();
    
    if (learnable.length === 0) {
        learnableEl.innerHTML = '<p class="text-gray-500 text-xs">Minden skill megtanulva</p>';
        return;
    }

    learnableEl.innerHTML = learnable.map(skill => `
        <div class="bg-slate-700 p-2 rounded">
            <p class="font-bold text-sm text-blue-300">${skill.name}</p>
            <p class="text-xs text-gray-400">${skill.desc}</p>
            <button class="skill-learn-btn mt-1" data-skill-id="${skill.id}">
                Tanulás
            </button>
        </div>
    `).join('');

    // Event listeners
    learnableEl.querySelectorAll('.skill-learn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skillId = btn.getAttribute('data-skill-id');
            onLearnSkill(skillId);
        });
    });
}

export function updateCombatSkillUI(skillSystem, onUseSkill) {
    const combatSkillsEl = document.getElementById("combatSkills");
    if (!combatSkillsEl) return;

    const activeSkills = skillSystem.getActiveSkills();
    
    if (activeSkills.length === 0) {
        combatSkillsEl.innerHTML = '<p class="text-gray-500 text-xs">Nincs aktív skill</p>';
        return;
    }

    combatSkillsEl.innerHTML = activeSkills.map(skill => {
        const cooldown = skillSystem.getCooldown(skill.id);
        const isOnCD = cooldown > 0;
        
        return `
            <button 
                class="combat-skill-btn ${isOnCD ? 'opacity-50 cursor-not-allowed' : ''}" 
                data-skill-id="${skill.id}"
                ${isOnCD ? 'disabled' : ''}
            >
                ${skill.name}
                ${isOnCD ? `(${cooldown})` : ''}
            </button>
        `;
    }).join('');

    // Event listeners
    combatSkillsEl.querySelectorAll('.combat-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skillId = btn.getAttribute('data-skill-id');
            onUseSkill(skillId);
        });
    });
}

export function updateInventoryUI(inventory) {
  const panel = document.getElementById("inventoryPanel");
  const items = inventory.getItems();

  panel.innerHTML = items.length
    ? items.map((i) => {
        if (i.isEquipment) {
            return `<p style="color: ${i.rarityColor}">• ${i.name} [${i.rarity}]</p>`;
        }
        return `<p>• ${i.name}: ${i.quantity}</p>`;
    }).join("")
    : '<p class="text-gray-500">Üres</p>';
}

export function setEventText(text) {
  document.getElementById("eventText").textContent = text;
}

// Quest UI
export function updateQuestUI(questSystem, onAcceptQuest) {
    const questPanel = document.getElementById("questPanel");
    if (!questPanel) return;

    const activeQuests = questSystem.getActiveQuests();
    
    if (activeQuests.length === 0) {
        questPanel.innerHTML = '<p class="text-gray-500 text-xs">Nincs aktív quest</p>';
        return;
    }

    questPanel.innerHTML = activeQuests.map(quest => {
        const progressPercent = (quest.progress / quest.targetCount) * 100;
        
        return `
            <div class="bg-slate-700 p-2 rounded mb-2">
                <p class="font-bold text-sm text-yellow-300">${quest.title}</p>
                <p class="text-xs text-gray-400 mb-1">${quest.description}</p>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-600 h-2 rounded">
                        <div class="bg-yellow-500 h-2 rounded transition-all" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="text-xs text-gray-300">${quest.progress}/${quest.targetCount}</span>
                </div>
                ${quest.progress >= quest.targetCount ? '<p class="text-green-400 text-xs mt-1">✓ Kész!</p>' : ''}
            </div>
        `;
    }).join('');
}

// Equipment UI
export function updateEquipmentUI(equipmentSystem, onEquip, onUnequip) {
    const equipmentPanel = document.getElementById("equipmentPanel");
    if (!equipmentPanel) return;

    const equipped = equipmentSystem.getEquipped();
    const stats = equipmentSystem.getTotalStats();

    let html = '<div class="text-xs text-gray-400 mb-2">';
    html += `Bonus: +${stats.dmg} DMG, +${stats.def} DEF, +${stats.luck} Luck`;
    html += '</div>';

    // Weapon slot
    html += '<div class="mb-2">';
    html += '<p class="text-xs font-bold text-gray-300">⚔️ Fegyver:</p>';
    if (equipped.weapon) {
        html += `<p class="text-xs" style="color: ${equipped.weapon.rarityColor}">${equipped.weapon.name} (+${equipped.weapon.statValue} DMG)</p>`;
        html += `<button class="text-xs text-red-400 hover:text-red-300" onclick="window.unequipSlot('weapon')">Levesz</button>`;
    } else {
        html += '<p class="text-xs text-gray-500">Üres</p>';
    }
    html += '</div>';

    // Armor slot
    html += '<div class="mb-2">';
    html += '<p class="text-xs font-bold text-gray-300">🛡️ Páncél:</p>';
    if (equipped.armor) {
        html += `<p class="text-xs" style="color: ${equipped.armor.rarityColor}">${equipped.armor.name} (+${equipped.armor.statValue} DEF)</p>`;
        html += `<button class="text-xs text-red-400 hover:text-red-300" onclick="window.unequipSlot('armor')">Levesz</button>`;
    } else {
        html += '<p class="text-xs text-gray-500">Üres</p>';
    }
    html += '</div>';

    // Accessory slot
    html += '<div class="mb-2">';
    html += '<p class="text-xs font-bold text-gray-300">💍 Kiegészítő:</p>';
    if (equipped.accessory) {
        html += `<p class="text-xs" style="color: ${equipped.accessory.rarityColor}">${equipped.accessory.name} (+${equipped.accessory.statValue} Luck)</p>`;
        html += `<button class="text-xs text-red-400 hover:text-red-300" onclick="window.unequipSlot('accessory')">Levesz</button>`;
    } else {
        html += '<p class="text-xs text-gray-500">Üres</p>';
    }
    html += '</div>';

    equipmentPanel.innerHTML = html;
}

// Biome info UI
export function updateBiomeUI(biome) {
    const biomePanel = document.getElementById("biomeInfo");
    if (!biomePanel) return;

    if (!biome) {
        biomePanel.innerHTML = '<p class="text-gray-500 text-xs">Ismeretlen terület</p>';
        return;
    }

    biomePanel.innerHTML = `
        <p class="text-sm font-bold" style="color: ${biome.color}">
            ${biome.emoji} ${biome.name}
        </p>
    `;
}