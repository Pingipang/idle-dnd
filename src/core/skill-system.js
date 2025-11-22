import { skills } from "./skills.js";

export function createSkillSystem() {
    const learned = new Set();

    // CDs
    const cooldowns = {};

    function learnSkill(id, player, levelSystem) {
        console.log("=== LEARN SKILL DEBUG ===");
        console.log("Trying to learn skill:", id);
        console.log("Available skill points:", levelSystem.skillPoints);
        console.log("Already learned:", Array.from(learned));
        
        if (levelSystem.skillPoints <= 0) {
            console.log("❌ NO SKILL POINTS!");
            return false;
        }
        
        if (learned.has(id)) {
            console.log("❌ ALREADY LEARNED!");
            return false;
        }

        const skill = skills.find(s => s.id === id);
        if (!skill) {
            console.log("❌ SKILL NOT FOUND!");
            return false;
        }

        console.log("Found skill:", skill);

        const spent = levelSystem.spendSkillPoint();
        console.log("Skill point spent?", spent);
        
        if (!spent) {
            console.log("❌ FAILED TO SPEND SKILL POINT!");
            return false;
        }

        learned.add(id);
        console.log("✅ Skill learned!");
        console.log("Learned skills now:", Array.from(learned));

        if (skill.type === "passive" && skill.apply) {
            console.log("Applying passive skill effect...");
            skill.apply(player);
            console.log("Player stats after:", {
                dmg: player.dmg,
                def: player.def,
                luck: player.luck
            });
        }

        return true;
    }

    function getLearnableSkills() {
        const learnable = skills.filter(s => !learned.has(s.id));
        console.log("Learnable skills:", learnable.map(s => s.id));
        return learnable;
    }

    function getActiveSkills() {
        return skills.filter(s => 
            learned.has(s.id) && s.type === "active"
        );
    }

    function getPassiveSkills() {
        return skills.filter(s => 
            learned.has(s.id) && s.type === "passive"
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
        learnSkill,
        getLearnableSkills,
        getActiveSkills,
        getPassiveSkills,
        tickCooldowns,
        isOnCooldown,
        triggerCooldown,
        getCooldown
    };
}