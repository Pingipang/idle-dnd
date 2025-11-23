// Boss definitions matched to regions
export const bosses = {
    "Karen, Manager Hívó": {
        name: "Karen, Manager Hívó",
        hp: 100,
        dmg: 8,
        def: 2,
        xp: 500,
        level: 5,
        description: "I WANT TO SPEAK TO THE DUNGEON MANAGER!",
        emoji: "👩‍💼",
        lootChance: 1.0,
        region: "corporate"
    },
    
    "The Founder": {
        name: "The Founder",
        hp: 150,
        dmg: 10,
        def: 3,
        xp: 600,
        level: 10,
        description: "We're changing the world... with coffee!",
        emoji: "☕",
        lootChance: 1.0,
        region: "startup"
    },
    
    "Chad Thunderfist": {
        name: "Chad Thunderfist",
        hp: 200,
        dmg: 12,
        def: 4,
        xp: 700,
        level: 15,
        description: "Bro, do you even lift?",
        emoji: "💪",
        lootChance: 1.0,
        region: "gaming"
    },
    
    "Influencer Dragon": {
        name: "Influencer Dragon",
        hp: 250,
        dmg: 14,
        def: 4,
        xp: 800,
        level: 20,
        description: "#Blessed #NoFilter #DragonLife",
        emoji: "🐉",
        lootChance: 1.0,
        region: "social"
    },
    
    "Ultimate Karen": {
        name: "Ultimate Karen",
        hp: 300,
        dmg: 16,
        def: 5,
        xp: 900,
        level: 25,
        description: "The FINAL Karen. Manager won't save you.",
        emoji: "👹",
        lootChance: 1.0,
        region: "retail"
    },
    
    "Tech Support Lich": {
        name: "Tech Support Lich",
        hp: 350,
        dmg: 18,
        def: 6,
        xp: 1000,
        level: 30,
        description: "Have you tried turning it off and on again?",
        emoji: "🧙‍♂️",
        lootChance: 1.0,
        region: "techsupport"
    },
    
    "Algorithm Beast": {
        name: "Algorithm Beast",
        hp: 400,
        dmg: 20,
        def: 7,
        xp: 1200,
        level: 35,
        description: "Your content has been demonetized.",
        emoji: "🤖",
        lootChance: 1.0,
        region: "crypto"
    },
    
    "The CEO": {
        name: "The CEO",
        hp: 500,
        dmg: 25,
        def: 10,
        xp: 2000,
        level: 40,
        description: "FINAL BOSS. Maximizing shareholder value... your HP.",
        emoji: "👔",
        lootChance: 1.0,
        region: "ceotower"
    }
};

// Get boss by name
export function getBossByName(name) {
    return bosses[name];
}

// Get boss for specific region
export function getBossForRegion(regionId) {
    const bossEntry = Object.values(bosses).find(b => b.region === regionId);
    return bossEntry || bosses["Karen, Manager Hívó"]; // Fallback
}

// Create boss instance
export function spawnBoss(bossData) {
    return {
        ...bossData,
        maxHP: bossData.hp,
        isBoss: true
    };
}

// Legacy function for compatibility
export function getBossByLevel(playerLevel) {
    const availableBosses = Object.values(bosses).filter(b => b.level <= playerLevel + 5);
    if (availableBosses.length === 0) return bosses["Karen, Manager Hívó"];
    
    return availableBosses[availableBosses.length - 1];
}

export function getRandomBoss() {
    const bossArray = Object.values(bosses);
    return bossArray[Math.floor(Math.random() * bossArray.length)];
}