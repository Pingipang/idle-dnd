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

// NEW: World Map UI
export function updateWorldMapUI(regionSystem, dungeonSystem, playerLevel, onSelectRegion) {
    const worldMapGrid = document.getElementById("worldMapGrid");
    if (!worldMapGrid) return;

    const allRegions = regionSystem.getAllRegionsStatus(playerLevel, dungeonSystem);
    
    worldMapGrid.innerHTML = allRegions.map(region => {
        const lockIcon = region.isLocked ? '🔒' : '';
        const currentIcon = region.isCurrent ? '📍' : '';
        const completedIcon = region.completion >= 100 ? '✅' : '';
        
        let statusClass = 'bg-slate-700';
        if (region.isCurrent) statusClass = 'bg-blue-900 border-2 border-blue-400';
        else if (region.completion >= 100) statusClass = 'bg-green-900';
        else if (region.isLocked) statusClass = 'bg-slate-800 opacity-50';
        
        return `
            <div class="region-card ${statusClass} p-4 rounded-lg ${region.isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'} transition-all"
                 data-region-id="${region.id}"
                 ${region.isLocked ? 'title="Locked"' : ''}>
                <div class="text-2xl mb-2">${region.emoji} ${lockIcon}${currentIcon}${completedIcon}</div>
                <h3 class="text-sm font-bold text-white mb-1">${region.name}</h3>
                <p class="text-xs text-gray-400 mb-2">${region.description}</p>
                
                ${!region.isLocked ? `
                    <div class="mb-2">
                        <div class="flex justify-between text-xs text-gray-300 mb-1">
                            <span>Progress</span>
                            <span>${region.completion}%</span>
                        </div>
                        <div class="w-full bg-slate-600 h-2 rounded">
                            <div class="bg-yellow-500 h-2 rounded transition-all" style="width: ${region.completion}%"></div>
                        </div>
                    </div>
                    
                    <div class="text-xs text-gray-400">
                        <p>Enemies: ${region.enemyKills}/${region.enemyRequirement}</p>
                        <p>Boss: ${region.bossDefeated ? '✅' : '❌'}</p>
                    </div>
                ` : `
                    <p class="text-xs text-red-400">Level ${region.level} required</p>
                `}
            </div>
        `;
    }).join('');

    // Add click listeners
    worldMapGrid.querySelectorAll('.region-card').forEach(card => {
        const regionId = card.getAttribute('data-region-id');
        const region = allRegions.find(r => r.id === regionId);
        
        if (!region.isLocked) {
            card.addEventListener('click', () => onSelectRegion(regionId));
        }
    });
}

// NEW: Current Region Info UI
export function updateCurrentRegionUI(regionSystem, dungeonSystem) {
    const regionInfoEl = document.getElementById("currentRegionInfo");
    if (!regionInfoEl) return;

    const region = regionSystem.getCurrentRegion();
    const progress = regionSystem.getCurrentProgress(dungeonSystem);
    
    regionInfoEl.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <div>
                <h3 class="text-lg font-bold" style="color: ${region.color}">
                    ${region.emoji} ${region.name}
                </h3>
                <p class="text-xs text-gray-400">${region.description}</p>
            </div>
            <button id="btnBackToMap" class="action-btn text-sm">
                🗺️ World Map
            </button>
        </div>
        
        <div class="mt-3">
            <div class="flex justify-between text-xs text-gray-300 mb-1">
                <span>Region Progress</span>
                <span>${progress.completion}%</span>
            </div>
            <div class="w-full bg-slate-600 h-3 rounded mb-2">
                <div class="bg-yellow-500 h-3 rounded transition-all" style="width: ${progress.completion}%"></div>
            </div>
            
            <div class="flex justify-between text-xs text-gray-400">
                <span>Enemies: ${progress.enemyKills}/${progress.enemyRequired}</span>
                <span>Boss: ${progress.bossDefeated ? '✅ Defeated' : '❌ Not defeated'}</span>
            </div>
        </div>
    `;
}

// NEW: Region Dungeon List UI
export function updateRegionDungeonsUI(regionSystem, dungeonSystem, onSelectDungeon) {
    const dungeonListEl = document.getElementById("regionDungeonList");
    if (!dungeonListEl) return;

    const currentRegion = regionSystem.getCurrentRegion();
    const dungeons = dungeonSystem.getDungeonsStatus(currentRegion.id);
    
    dungeonListEl.innerHTML = dungeons.map((dungeon, index) => {
        const statusIcon = dungeon.completed ? '✅' : (dungeon.isCurrent ? '📍' : '');
        const bossIcon = dungeon.hasBoss ? '👑' : '';
        
        let difficultyStars = '';
        for (let i = 0; i < Math.ceil(dungeon.difficulty); i++) {
            difficultyStars += '⭐';
        }
        
        return `
            <div class="dungeon-card bg-slate-700 p-4 rounded-lg cursor-pointer hover:bg-slate-600 transition-all ${dungeon.completed ? 'opacity-75' : ''}"
                 data-dungeon-id="${dungeon.id}">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <h4 class="text-md font-bold text-white mb-1">
                            ${dungeon.name} ${statusIcon} ${bossIcon}
                        </h4>
                        <p class="text-xs text-gray-400">${dungeon.description}</p>
                    </div>
                    <div class="text-right ml-2">
                        <p class="text-xs text-yellow-400">${difficultyStars}</p>
                        <p class="text-xs text-gray-500">Diff: ${dungeon.difficulty}x</p>
                    </div>
                </div>
                
                <div class="mt-2 text-xs text-gray-400">
                    <div class="flex justify-between">
                        <span>Enemies: ${dungeon.enemyCount}</span>
                        <span>Attempts: ${dungeon.attempts}</span>
                    </div>
                    ${dungeon.hasBoss ? `<p class="text-red-400 mt-1">⚔️ Boss: ${dungeon.bossName}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Add click listeners
    dungeonListEl.querySelectorAll('.dungeon-card').forEach(card => {
        const dungeonId = card.getAttribute('data-dungeon-id');
        card.addEventListener('click', () => onSelectDungeon(dungeonId));
    });
}

// NEW: Current Dungeon Info UI
export function updateCurrentDungeonUI(dungeonSystem) {
    const dungeonInfoEl = document.getElementById("currentDungeonInfo");
    if (!dungeonInfoEl) return;

    const dungeon = dungeonSystem.getCurrentDungeon();
    const progress = dungeonSystem.getCurrentProgress();
    
    if (!dungeon || !progress) {
        dungeonInfoEl.innerHTML = '<p class="text-gray-500">No dungeon active</p>';
        return;
    }
    
    let difficultyStars = '';
    for (let i = 0; i < Math.ceil(dungeon.difficulty); i++) {
        difficultyStars += '⭐';
    }
    
    dungeonInfoEl.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <div>
                <h3 class="text-lg font-bold text-purple-400">
                    ${dungeon.name}
                </h3>
                <p class="text-xs text-gray-400">${dungeon.description}</p>
                <p class="text-xs text-yellow-400 mt-1">${difficultyStars} Difficulty: ${dungeon.difficulty}x</p>
            </div>
            <button id="btnBackToRegion" class="action-btn text-sm bg-red-700 hover:bg-red-800">
                🚪 Exit Dungeon
            </button>
        </div>
        
        <div class="mt-3">
            <div class="flex justify-between text-xs text-gray-300 mb-1">
                <span>Dungeon Progress</span>
                <span>${Math.floor(progress.completion)}%</span>
            </div>
            <div class="w-full bg-slate-600 h-3 rounded mb-2">
                <div class="bg-purple-500 h-3 rounded transition-all" style="width: ${progress.completion}%"></div>
            </div>
            
            <div class="text-xs text-gray-400">
                <span>Enemies Killed: ${progress.enemiesKilled}/${progress.enemiesRequired}</span>
                ${dungeon.hasBoss ? `<p class="text-red-400 mt-1">⚔️ Boss: ${dungeon.bossName}</p>` : ''}
            </div>
        </div>
    `;
}