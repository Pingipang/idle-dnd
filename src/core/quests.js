export const questTypes = {
    KILL: "kill",
    COLLECT: "collect",
    EXPLORE: "explore",
    SURVIVE: "survive",
    BOSS: "boss"
};

export const questDefinitions = [
    // KILL QUESTS
    {
        id: "wifi_kobold",
        type: questTypes.KILL,
        title: "WiFi segítség",
        description: "Segíts 5 koboldnak megtalálni a WiFi jelszót... örökre.",
        target: "Kobold",
        targetCount: 5,
        rewards: {
            xp: 100,
            gold: 50,
            item: { name: "Régi Router", quantity: 1, type: "misc" }
        }
    },
    {
        id: "skeleton_therapy",
        type: questTypes.KILL,
        title: "Csontvázak terápiája",
        description: "Hallgasd meg 3 csontváz panaszát... végleg.",
        target: "Csontváz",
        targetCount: 3,
        rewards: {
            xp: 80,
            gold: 40
        }
    },
    {
        id: "goblin_energy",
        type: questTypes.KILL,
        title: "Energital Hadművelet",
        description: "Adj energiatalt 10 goblinnak. Vagy csak győzd le őket.",
        target: "Goblin",
        targetCount: 10,
        rewards: {
            xp: 150,
            gold: 75,
            item: { name: "Monster Energy", quantity: 3, type: "buff", amount: 3 }
        }
    },
    {
        id: "troll_nft",
        type: questTypes.KILL,
        title: "NFT Zúzó",
        description: "Állítsd meg a trollokat, mielőtt eladják az NFT-jüket!",
        target: "Mini Troll",
        targetCount: 5,
        rewards: {
            xp: 200,
            gold: 100
        }
    },

    // COLLECT QUESTS
    {
        id: "valuable_rocks",
        type: questTypes.COLLECT,
        title: "Értékes Kavicsok",
        description: "Gyűjts 15 'értékes' kavicsot. A troll NFT-nek kell.",
        target: "Kavics",
        targetCount: 15,
        rewards: {
            xp: 120,
            gold: 60
        }
    },
    {
        id: "gold_grind",
        type: questTypes.COLLECT,
        title: "Gold Farming",
        description: "Farmolj 100 aranyat. Mint egy igazi MMO-ban.",
        target: "Arany",
        targetCount: 100,
        rewards: {
            xp: 150,
            item: { name: "Gyógyital", quantity: 5, type: "heal", amount: 10 }
        }
    },
    {
        id: "mana_crystals",
        type: questTypes.COLLECT,
        title: "Kristály Gyűjtés",
        description: "Szerezz 10 Mana Kristályt. P2W style.",
        target: "Kis Mana Kristály",
        targetCount: 10,
        rewards: {
            xp: 200,
            gold: 150
        }
    },

    // EXPLORE QUESTS
    {
        id: "room_explorer",
        type: questTypes.EXPLORE,
        title: "Dungeon Turista",
        description: "Látogass meg 20 különböző szobát. Készíts szelfit!",
        targetCount: 20,
        rewards: {
            xp: 100,
            gold: 80
        }
    },
    {
        id: "biome_explorer",
        type: questTypes.EXPLORE,
        title: "Biome Hopper",
        description: "Fedezz fel minden biome típust legalább egyszer.",
        targetCount: 6, // Number of biome types
        rewards: {
            xp: 250,
            gold: 150,
            item: { name: "Térkép", quantity: 1, type: "misc" }
        }
    },

    // SURVIVE QUESTS
    {
        id: "no_damage",
        type: questTypes.SURVIVE,
        title: "Sérülés Mentes",
        description: "Nyerj meg 3 csatát sebzés nélkül. Git gud.",
        targetCount: 3,
        rewards: {
            xp: 180,
            gold: 100
        }
    },
    {
        id: "low_hp_victory",
        type: questTypes.SURVIVE,
        title: "Clutch King",
        description: "Nyerj meg 1 csatát 10 HP alatt. Szívdobogtató!",
        targetCount: 1,
        rewards: {
            xp: 150,
            gold: 80,
            item: { name: "Lucky Charm", quantity: 1, type: "misc" }
        }
    },

    // BOSS QUESTS
    {
        id: "boss_slayer",
        type: questTypes.BOSS,
        title: "Boss Killer",
        description: "Győzd le az első bosst. Ez nem tutorial boss!",
        targetCount: 1,
        rewards: {
            xp: 500,
            gold: 300
        }
    }
];

// Random quest picker
export function getRandomQuests(count = 3) {
    const shuffled = [...questDefinitions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}