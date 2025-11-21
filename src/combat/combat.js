import { getLoot } from "../core/loot.js";
import { updateUI } from "../ui/ui.js";

export function createCombatSystem(player, inventory, levelSystem, skillSystem, showPopup, hidePopup, updatePopupUI) {

    let currentEnemy = null;
    let defending = false;
    let stunTurns = 0;
    const stunDef = 0.3;

    function startCombat(enemy) {
        currentEnemy = enemy;
        defending = false;
        stunTurns = 0;
        showPopup(enemy);
    }

    function endPlayerTurn() {
        if (stunTurns > 0) {
            stunTurns--;
        }
        // Skill cooldownok csökkentése
        skillSystem.tickCooldowns();
    }

    function attack() {
        if (!currentEnemy) return;

        currentEnemy.hp -= player.dmg;

        if (currentEnemy.hp <= 0) {
            const loot = Math.random() < currentEnemy.lootChance ? getLoot() : null;
            const xpGained = currentEnemy.xp || 0;

            const leveledUp = levelSystem.addXP(xpGained);

            let message = `Legyőzted a(z) ${currentEnemy.name}-t! +${xpGained} XP`;
            if (leveledUp) {
                message += `\n🎉 LEVEL UP! Most ${levelSystem.level}. szint vagy!`;
                if (levelSystem.skillPoints > 0) {
                    message += ` +1 Skill pont!`;
                }
            }

            hidePopup(message, loot, leveledUp);
            currentEnemy = null;
            return;
        }

        updatePopupUI(
            `Megütötted a(z) ${currentEnemy.name}-t ${player.dmg} sebzéssel.`,
            currentEnemy
        );

        enemyAttack();
        endPlayerTurn();
    }

    function useSkill(skillId) {
        if (!currentEnemy) return;
        if (skillSystem.isOnCooldown(skillId)) {
            updatePopupUI(`A skill még cooldownon van! (${skillSystem.getCooldown(skillId)} kör)`, currentEnemy);
            return;
        }

        const skill = skillSystem.getActiveSkills().find(s => s.id === skillId);
        if (!skill) return;

        const message = skill.use(player, currentEnemy);
        skillSystem.triggerCooldown(skillId);

        if (currentEnemy.hp <= 0) {
            const loot = Math.random() < currentEnemy.lootChance ? getLoot() : null;
            const xpGained = currentEnemy.xp || 0;
            const leveledUp = levelSystem.addXP(xpGained);

            let msg = `Legyőzted a(z) ${currentEnemy.name}-t! +${xpGained} XP`;
            if (leveledUp) {
                msg += `\n🎉 LEVEL UP! Most ${levelSystem.level}. szint vagy!`;
                if (levelSystem.skillPoints > 0) {
                    msg += ` +1 Skill pont!`;
                }
            }

            hidePopup(msg, loot, leveledUp);
            currentEnemy = null;
            return;
        }

        updatePopupUI(message, currentEnemy);
        enemyAttack();
        endPlayerTurn();
    }

    function defend() {
        if (!currentEnemy) return;

        defending = true;
        const stunChance = Math.random();

        if (stunChance < stunDef) {
            stunTurns = Math.floor(Math.random() * 3) + 1;
            updatePopupUI(`Sikeres védekezés! Az ${currentEnemy.name} lebénult ${stunTurns} körre!`, currentEnemy);
            endPlayerTurn();
            return;
        }

        updatePopupUI("Védekezelsz...", currentEnemy);
        enemyAttack();
        endPlayerTurn();
    }

    function flee() {
        if (!currentEnemy) return;

        if (Math.random() < 0.5) {
            hidePopup("Sikerült elfutnod!", null, false);
            currentEnemy = null;
        } else {
            updatePopupUI("Sikertelen futás!", currentEnemy);
            enemyAttack();
        }

        endPlayerTurn();
    }

    function enemyAttack() {
        if (!currentEnemy) return;

        if (stunTurns > 0) {
            updatePopupUI(
                `A(z) ${currentEnemy.name} lebénult! (${stunTurns} kör maradt)`,
                currentEnemy
            );
            return;
        }

        // Quick Reflex passive skill check
        const quickReflexSkill = skillSystem.getActiveSkills().find(s => s.id === "quick_reflex");
        if (quickReflexSkill && Math.random() < quickReflexSkill.dodgeChance) {
            updatePopupUI(`Elkerülted a támadást! (Quick Reflex)`, currentEnemy);
            return;
        }

        const dmg = defending ? Math.floor(currentEnemy.dmg / 2) : currentEnemy.dmg;
        player.hp -= dmg;
        defending = false;

        updateUI(player);

        if (player.hp <= 0) {
            hidePopup("☠️ Meghaltál! Visszakerülsz a kezdőpontra.", null, false);
            player.hp = player.maxHP;
            updateUI(player);
            player.reset(0, 0);
            currentEnemy = null;
            return;
        }

        updatePopupUI(
            `A(z) ${currentEnemy.name} megsebezett: ${dmg}!`,
            currentEnemy
        );
    }

    return {
        startCombat,
        attack,
        useSkill,
        defend,
        flee,
        get currentEnemy() {
            return currentEnemy;
        }
    };
}