export const rarities = {
    COMMON: { name: "Common", color: "#9ca3af", dropChance: 0.6, statMultiplier: 1.0 },
    UNCOMMON: { name: "Uncommon", color: "#22c55e", dropChance: 0.25, statMultiplier: 1.3 },
    RARE: { name: "Rare", color: "#3b82f6", dropChance: 0.1, statMultiplier: 1.6 },
    EPIC: { name: "Epic", color: "#a855f7", dropChance: 0.04, statMultiplier: 2.0 },
    LEGENDARY: { name: "Legendary", color: "#f97316", dropChance: 0.01, statMultiplier: 2.5 }
};

// Equipment slots
export const slots = {
    WEAPON: "weapon",
    ARMOR: "armor",
    ACCESSORY: "accessory"
};

// Equipment name parts (for random generation)
const weaponPrefixes = ["Bug Report", "Keyboard", "Mouse", "Cringe", "Meme", "Toxic", "Legendary"];
const weaponSuffixes = ["Sword", "Hammer", "Staff", "Blade", "Axe", "Mace", "Dagger"];

const armorPrefixes = ["Plot", "Firewall", "Admin", "Mod", "Script", "Firewall", "Legacy"];
const armorSuffixes = ["Armor", "Shield", "Plate", "Mail", "Robe", "Guard", "Protection"];

const accessoryPrefixes = ["Ring of", "Amulet of", "Charm of", "Token of", "Badge of"];
const accessorySuffixes = ["Unread Emails", "Spam Filter", "Dark Mode", "Notifications", "Updates", "Cringe", "Clout"];

// Equipment base stats
const equipmentBases = {
    weapon: {
        statType: "dmg",
        baseMin: 2,
        baseMax: 5
    },
    armor: {
        statType: "def",
        baseMin: 1,
        baseMax: 3
    },
    accessory: {
        statType: "luck",
        baseMin: 1,
        baseMax: 2
    }
};

// Generate random equipment
export function generateEquipment(slot, playerLevel = 1) {
    const rarity = rollRarity();
    const base = equipmentBases[slot];
    
    // Generate name based on slot
    let name = "";
    if (slot === slots.WEAPON) {
        const prefix = weaponPrefixes[Math.floor(Math.random() * weaponPrefixes.length)];
        const suffix = weaponSuffixes[Math.floor(Math.random() * weaponSuffixes.length)];
        name = `${prefix} ${suffix}`;
    } else if (slot === slots.ARMOR) {
        const prefix = armorPrefixes[Math.floor(Math.random() * armorPrefixes.length)];
        const suffix = armorSuffixes[Math.floor(Math.random() * armorSuffixes.length)];
        name = `${prefix} ${suffix}`;
    } else if (slot === slots.ACCESSORY) {
        const prefix = accessoryPrefixes[Math.floor(Math.random() * accessoryPrefixes.length)];
        const suffix = accessorySuffixes[Math.floor(Math.random() * accessorySuffixes.length)];
        name = `${prefix} ${suffix}`;
    }
    
    // Calculate stats
    const levelBonus = Math.floor(playerLevel / 5);
    const baseStat = Math.floor(Math.random() * (base.baseMax - base.baseMin + 1)) + base.baseMin;
    const finalStat = Math.floor((baseStat + levelBonus) * rarity.statMultiplier);
    
    return {
        name,
        slot,
        rarity: rarity.name,
        rarityColor: rarity.color,
        statType: base.statType,
        statValue: finalStat,
        level: playerLevel
    };
}

// Roll rarity based on drop chances
function rollRarity() {
    const roll = Math.random();
    let cumulative = 0;
    
    // Check in order: Legendary, Epic, Rare, Uncommon, Common
    const orderedRarities = [
        rarities.LEGENDARY,
        rarities.EPIC,
        rarities.RARE,
        rarities.UNCOMMON,
        rarities.COMMON
    ];
    
    for (const rarity of orderedRarities) {
        cumulative += rarity.dropChance;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    
    return rarities.COMMON; 
}

// Get random equipment slot
export function getRandomSlot() {
    const slotKeys = Object.values(slots);
    return slotKeys[Math.floor(Math.random() * slotKeys.length)];
}

// Equipment system for player
export function createEquipmentSystem() {
    const equipped = {
        weapon: null,
        armor: null,
        accessory: null
    };
    
    function equip(item) {
        if (!item || !item.slot) return false;
        
        const oldItem = equipped[item.slot];
        equipped[item.slot] = item;
        
        return oldItem; // Return old item if there was one
    }
    
    function unequip(slot) {
        const item = equipped[slot];
        equipped[slot] = null;
        return item;
    }
    
    function getEquipped() {
        return { ...equipped };
    }
    
    function getTotalStats() {
        const stats = {
            dmg: 0,
            def: 0,
            luck: 0
        };
        
        Object.values(equipped).forEach(item => {
            if (item && item.statType && item.statValue) {
                stats[item.statType] += item.statValue;
            }
        });
        
        return stats;
    }
    
    function clear() {
        equipped.weapon = null;
        equipped.armor = null;
        equipped.accessory = null;
    }
    
    return {
        equip,
        unequip,
        getEquipped,
        getTotalStats,
        clear
    };
}