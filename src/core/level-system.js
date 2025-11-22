export function createLevelSystem() {
    let level = 1;
    let xp = 0;
    let statPoints = 0;
    let skillPoints = 0;

    function getXPForNextLevel(currentLevel) {
        return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
    }

    function addXP(amount) {
        xp += amount;
        
        const xpNeeded = getXPForNextLevel(level);
        
        // Level up check
        if (xp >= xpNeeded) {
            xp -= xpNeeded;
            level++;
            statPoints += 3; 
            
            if (level % 2 === 0) {
                skillPoints++;
            }
            
            return true; 
        }
        
        return false; 
    }

    function spendStatPoint(stat, player) {
        if (statPoints <= 0) return false;

        switch(stat) {
            case "hp":
                player.baseMaxHP += 5;
                player.maxHP += 5;
                player.hp += 5; 
                break;
            case "dmg":
                player.baseDmg += 2;
                player.dmg += 2; 
                break;
            case "def":
                player.baseDef += 1;
                player.def += 1; 
                break;
            case "luck":
                player.baseLuck += 1;
                player.luck += 1; 
                break;
            default:
                return false;
        }

        statPoints--;
        return true;
    }

    function spendSkillPoint() {
        if (skillPoints <= 0) return false;
        skillPoints--;
        return true;
    }

    function getXPProgress() {
        const needed = getXPForNextLevel(level);
        return {
            current: xp,
            needed: needed,
            percent: (xp / needed) * 100
        };
    }

    function reset() {
        level = 1;
        xp = 0;
        statPoints = 0;
        skillPoints = 0;
    }

    return {
        addXP,
        spendStatPoint,
        spendSkillPoint,
        getXPProgress,
        reset,
        get level() { return level; },
        get xp() { return xp; },
        get statPoints() { return statPoints; },
        get skillPoints() { return skillPoints; }
    };
}