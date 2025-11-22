export const biomeTypes = {
    CORPORATE: "corporate",
    CAFE: "cafe",
    GAMING: "gaming",
    SOCIAL: "social",
    RETAIL: "retail",
    DUNGEON: "dungeon" // Classic
};

export const biomes = {
    corporate: {
        id: "corporate",
        name: "🏢 Corporate Dungeon",
        color: "#475569", // slate-600
        bgColor: "#1e293b", // slate-800
        emoji: "💼",
        enemies: ["Manager Mimic", "Junior Kobold", "Senior Troll", "Intern Goblin"],
        events: [
            "Egy meeting room mindörökké tart...",
            "A klíma túl hideg. -1 DEF.",
            "Free pizza a konyhában! +5 HP.",
            "Mandatory team building event.",
            "A WiFi lassú. Mindenki ideges."
        ],
        lootBonus: 1.2
    },
    
    cafe: {
        id: "cafe",
        name: "☕ Kávézó Kripta",
        color: "#78350f", // amber-900
        bgColor: "#451a03", // amber-950
        emoji: "☕",
        enemies: ["Barista Skeleton", "Latte Goblin", "Espresso Elemental", "Karen"],
        events: [
            "Kapsz egy ingyenes lattét! +10 HP.",
            "A kávé túl forró. Megégsz. -5 HP.",
            "Valaki elcserélte a rendelésedet.",
            "A WiFi jelszó megváltozott megint.",
            "Hipster beszélgetést hallasz. Cringe damage."
        ],
        lootBonus: 1.0
    },
    
    gaming: {
        id: "gaming",
        name: "🎮 Gaming Lair",
        color: "#7c2d12", // red-900
        bgColor: "#450a0a", // red-950
        emoji: "🎮",
        enemies: ["Ragequit Warrior", "AFK Golem", "Toxic Troll", "Noob Slayer"],
        events: [
            "Találsz egy legendary lootboxot!",
            "Lag spike! Elveszítesz egy turn-t.",
            "Someone called you 'ez'. -10 HP damage.",
            "Team-ed rage quitel. Most egyedül vagy.",
            "GG WP - Buffot kapsz!"
        ],
        lootBonus: 1.5
    },
    
    social: {
        id: "social",
        name: "📱 Social Media Alagút",
        color: "#1e40af", // blue-800
        bgColor: "#1e3a8a", // blue-900
        emoji: "📱",
        enemies: ["Influencer Troll", "Comment Section Demon", "Algorithm Beast", "Cancel Mob"],
        events: [
            "Virális mentél! +50 XP.",
            "Cancel culture triggered. -20 HP.",
            "Rossz meme posztoltál. Everybody attacks.",
            "10k követőt szereztél! +Luck.",
            "Shadowbanned voltál."
        ],
        lootBonus: 1.3
    },
    
    retail: {
        id: "retail",
        name: "🛒 Retail Pokol",
        color: "#be123c", // rose-700
        bgColor: "#881337", // rose-900
        emoji: "🛒",
        enemies: ["Sale Hunter", "Black Friday Horde", "Karen Boss", "Coupon Collector"],
        events: [
            "SALE! 50% off minden lootodon... várj mi?",
            "Egy Karen managert akar hívni.",
            "Valaki az utolsó terméket vette meg előtted.",
            "Loyalty points! +25 Gold.",
            "Return policy nightmare."
        ],
        lootBonus: 1.1
    },
    
    dungeon: {
        id: "dungeon",
        name: "🗿 Klasszikus Dungeon",
        color: "#374151", // gray-700
        bgColor: "#1f2937", // gray-800
        emoji: "🗿",
        enemies: ["Kobold", "Csontváz", "Goblin", "Mini Troll"],
        events: [
            "Egy rejtélyes hang suttog...",
            "Hideg szél fúj. Kellemetlen.",
            "Cseppkövek. Régimódi.",
            "Egy csapda! Szerencsére rozsda fogta.",
            "Klasszikus dungeon feeling."
        ],
        lootBonus: 1.0
    }
};

// Get random biome
export function getRandomBiome() {
    const biomeKeys = Object.keys(biomes);
    const randomKey = biomeKeys[Math.floor(Math.random() * biomeKeys.length)];
    return biomes[randomKey];
}

// Get biome by id
export function getBiomeById(id) {
    return biomes[id] || biomes.dungeon;
}

// Get random enemy from biome
export function getRandomEnemyFromBiome(biome) {
    if (!biome || !biome.enemies || biome.enemies.length === 0) {
        return "Kobold"; // fallback
    }
    return biome.enemies[Math.floor(Math.random() * biome.enemies.length)];
}

// Get random event from biome
export function getRandomEventFromBiome(biome) {
    if (!biome || !biome.events || biome.events.length === 0) {
        return "Semmi különös nem történik.";
    }
    return biome.events[Math.floor(Math.random() * biome.events.length)];
}