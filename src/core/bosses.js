export const bosses = [
    {
        name: "Karen, Manager Hívó",
        hp: 100,
        dmg: 8,
        def: 2,
        xp: 500,
        level: 5,
        description: "I WANT TO SPEAK TO THE DUNGEON MANAGER!",
        emoji: "👩‍💼",
        lootChance: 1.0, 
        abilities: [
            {
                name: "Manager召喚",
                chance: 0.3,
                effect: "Karen hív egy managert! +5 HP neki.",
                action: (boss) => {
                    boss.hp = Math.min(boss.maxHP, boss.hp + 5);
                    return "Karen managert hívott! +5 HP!";
                }
            },
            {
                name: "Complaint Blast",
                chance: 0.2,
                effect: "Panaszáradat! 2x DMG!",
                action: (boss, player) => {
                    const dmg = boss.dmg * 2;
                    player.hp -= dmg;
                    return `Karen panaszkodik! ${dmg} sebzés!`;
                }
            }
        ]
    },
    
    {
        name: "Chad Thunderfist",
        hp: 120,
        dmg: 10,
        def: 3,
        xp: 600,
        level: 10,
        description: "Bro, do you even lift?",
        emoji: "💪",
        lootChance: 1.0,
        abilities: [
            {
                name: "Protein Shake",
                chance: 0.25,
                effect: "Protein shake! +10 HP és +2 DMG!",
                action: (boss) => {
                    boss.hp = Math.min(boss.maxHP, boss.hp + 10);
                    boss.dmg += 2;
                    return "Chad proteint ivott! +10 HP, +2 DMG!";
                }
            },
            {
                name: "Gym Bro Slam",
                chance: 0.3,
                effect: "GYM SLAM! Ignore defense!",
                action: (boss, player) => {
                    const dmg = boss.dmg + 5;
                    player.hp -= dmg;
                    return `Chad GYM SLAM! ${dmg} sebzés (DEF ignored)!`;
                }
            }
        ]
    },
    
    {
        name: "Tech Support Lich",
        hp: 90,
        dmg: 7,
        def: 4,
        xp: 550,
        level: 8,
        description: "Have you tried turning it off and on again?",
        emoji: "🧙‍♂️",
        lootChance: 1.0,
        abilities: [
            {
                name: "System Reboot",
                chance: 0.2,
                effect: "Reboot! Visszaáll full HP-ra!",
                action: (boss) => {
                    boss.hp = boss.maxHP;
                    return "Tech Support Lich rebootolt! Full HP!";
                }
            },
            {
                name: "Troubleshoot",
                chance: 0.25,
                effect: "Troubleshooting... Player debug mode!",
                action: (boss, player) => {
                    player.hp -= 5;
                    return "Troubleshooting... -5 HP és confuse!";
                }
            }
        ]
    },
    
    {
        name: "Influencer Dragon",
        hp: 150,
        dmg: 12,
        def: 2,
        xp: 800,
        level: 15,
        description: "#Blessed #NoFilter #DragonLife",
        emoji: "🐉",
        lootChance: 1.0,
        abilities: [
            {
                name: "Selfie Attack",
                chance: 0.3,
                effect: "Selfie! Vakú! -10 accuracy!",
                action: (boss, player) => {
                    const dmg = Math.floor(boss.dmg * 0.5);
                    player.hp -= dmg;
                    return `Influencer Dragon szelfit készít! Vak vagy! ${dmg} sebzés!`;
                }
            },
            {
                name: "Viral Post",
                chance: 0.2,
                effect: "Viral lett! +20 HP a dragonnak!",
                action: (boss) => {
                    boss.hp = Math.min(boss.maxHP, boss.hp + 20);
                    return "A poszta viral lett! +20 HP!";
                }
            }
        ]
    },
    
    {
        name: "Algorithm Beast",
        hp: 200,
        dmg: 15,
        def: 5,
        xp: 1000,
        level: 20,
        description: "Your content has been demonetized.",
        emoji: "🤖",
        lootChance: 1.0,
        abilities: [
            {
                name: "Shadowban",
                chance: 0.25,
                effect: "Shadowban! Kihagyod a következő turnod!",
                action: (boss, player) => {
                    player.hp -= 10;
                    return "Az Algorithm shadowbannolt! -10 HP és skip turn!";
                }
            },
            {
                name: "Demonetization",
                chance: 0.3,
                effect: "Demonetized! Elveszítesz pénzt!",
                action: (boss, player) => {
                    // Remove gold
                    player.hp -= boss.dmg;
                    return `Demonetizálva lettél! ${boss.dmg} sebzés és gold loss!`;
                }
            }
        ]
    }
];

// Get boss by level threshold
export function getBossByLevel(playerLevel) {
    const availableBosses = bosses.filter(b => b.level <= playerLevel);
    if (availableBosses.length === 0) return bosses[0]; // Return first boss
    
    return availableBosses[Math.floor(Math.random() * availableBosses.length)];
}

// Get random boss
export function getRandomBoss() {
    return bosses[Math.floor(Math.random() * bosses.length)];
}

// Create boss instance
export function spawnBoss(bossData) {
    return {
        ...bossData,
        maxHP: bossData.hp,
        isBoss: true,
        currentAbility: null
    };
}