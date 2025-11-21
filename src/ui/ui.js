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
    ? items.map((i) => `<p>• ${i.name}: ${i.quantity}</p>`).join("")
    : '<p class="text-gray-500">Üres</p>';
}

export function setEventText(text) {
  document.getElementById("eventText").textContent = text;
}