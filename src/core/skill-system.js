// skill-system.js
import { skills } from "./skills.js";

export function createSkillSystem() {
    let skillPoints = 0;
    const learned = new Set();

    // Cooldownok (skillID: körök)
    const cooldowns = {};

    function addSkillPoint() {
        skillPoints++;
    }

    function learnSkill(id, player) {
        if (skillPoints <= 0) return false;
        if (learned.has(id)) return false;

        const skill = skills.find(s => s.id === id);
        if (!skill) return false;

        learned.add(id);
        skillPoints--;

        if (skill.type === "passive" && skill.apply) {
            skill.apply(player);
        }

        return true;
    }

    function getLearnableSkills() {
        return skills.filter(s => !learned.has(s.id));
    }

    function getActiveSkills() {
        return skills.filter(s => 
            learned.has(s.id) && s.type === "active"
        );
    }

    function tickCooldowns() {
        for (const key in cooldowns) {
            if (cooldowns[key] > 0) cooldowns[key]--;
        }
    }

    function isOnCooldown(id) {
        return cooldowns[id] > 0;
    }

    function triggerCooldown(id) {
        const skill = skills.find(s => s.id === id);
        if (skill && skill.cooldown) {
            cooldowns[id] = skill.cooldown;
        }
    }

    function getCooldown(id) {
        return cooldowns[id] || 0;
    }

    return {
        get skillPoints() { return skillPoints; },
        addSkillPoint,
        learnSkill,
        getLearnableSkills,
        getActiveSkills,
        tickCooldowns,
        isOnCooldown,
        triggerCooldown,
        getCooldown
    };
}
