// Region/Zone definitions
export const regions = [
    {
        id: "corporate",
        name: "🏢 Corporate Campus",
        description: "Ahol a meeting soha nem ér véget...",
        level: 1,
        emoji: "💼",
        color: "#475569",
        bgColor: "#1e293b",
        
        // Progress requirements
        enemyRequirement: 20, // 20 enemy kill = 80%
        bossRequirement: 1,   // 1 boss = 20%
        
        // Enemies
        enemies: [
            { name: "Junior Kobold", weight: 0.4 },
            { name: "Intern Goblin", weight: 0.3 },
            { name: "Manager Mimic", weight: 0.2 },
            { name: "Senior Troll", weight: 0.1 }
        ],
        
        boss: "Karen, Manager Hívó",
        
        // Loot bonus
        lootBonus: 1.0,
        
        // Events
        events: [
            "Egy meeting room mindörökké tart...",
            "A klíma túl hideg. Brrr.",
            "Free pizza a konyhában!",
            "Mandatory team building esemény.",
            "A WiFi lassú. Mindenki ideges."
        ]
    },
    
    {
        id: "startup",
        name: "☕ Startup Valley",
        description: "Move fast and break things... including yourself",
        level: 5,
        emoji: "☕",
        color: "#78350f",
        bgColor: "#451a03",
        
        enemyRequirement: 25,
        bossRequirement: 1,
        
        enemies: [
            { name: "Barista Skeleton", weight: 0.35 },
            { name: "Latte Goblin", weight: 0.35 },
            { name: "Hipster Troll", weight: 0.2 },
            { name: "Overworked Dev", weight: 0.1 }
        ],
        
        boss: "The Founder",
        
        lootBonus: 1.1,
        
        events: [
            "Kapsz egy flat white-ot. Fancy.",
            "Valaki pitch-el neked. Cringe.",
            "A WiFi jelszó 'innovation123'.",
            "Disruption happening...",
            "Találsz egy üres bean bag-et."
        ]
    },
    
    {
        id: "gaming",
        name: "🎮 Gamer's Basement",
        description: "Git gud or go home",
        level: 10,
        emoji: "🎮",
        color: "#7c2d12",
        bgColor: "#450a0a",
        
        enemyRequirement: 30,
        bossRequirement: 1,
        
        enemies: [
            { name: "Noob Slayer", weight: 0.3 },
            { name: "Ragequit Warrior", weight: 0.3 },
            { name: "AFK Golem", weight: 0.25 },
            { name: "Toxic Troll", weight: 0.15 }
        ],
        
        boss: "Chad Thunderfist",
        
        lootBonus: 1.3,
        
        events: [
            "Lag spike! Nem tudtál mozdulni.",
            "GG WP - Kapsz egy buffot!",
            "Someone called you 'ez'. Rage.",
            "Találtál egy legendary loot box!",
            "Your team ragequit. Classic."
        ]
    },
    
    {
        id: "social",
        name: "📱 Social Media Wasteland",
        description: "Like, share, and destroy",
        level: 15,
        emoji: "📱",
        color: "#1e40af",
        bgColor: "#1e3a8a",
        
        enemyRequirement: 35,
        bossRequirement: 1,
        
        enemies: [
            { name: "Influencer Troll", weight: 0.35 },
            { name: "Comment Section Demon", weight: 0.3 },
            { name: "Cancel Mob", weight: 0.25 },
            { name: "Algorithm Beast", weight: 0.1 }
        ],
        
        boss: "Influencer Dragon",
        
        lootBonus: 1.4,
        
        events: [
            "Virális mentél! +50 XP.",
            "Shadowbanned lettél. Sadge.",
            "Rossz meme posztoltál. Cringe.",
            "10k követőt szereztél!",
            "Ratio'd. F."
        ]
    },
    
    {
        id: "retail",
        name: "🛒 Mega Mall Madness",
        description: "Black Friday minden nap",
        level: 20,
        emoji: "🛒",
        color: "#be123c",
        bgColor: "#881337",
        
        enemyRequirement: 40,
        bossRequirement: 1,
        
        enemies: [
            { name: "Sale Hunter", weight: 0.35 },
            { name: "Black Friday Horde", weight: 0.3 },
            { name: "Coupon Collector", weight: 0.25 },
            { name: "Karen Boss", weight: 0.1 }
        ],
        
        boss: "Ultimate Karen",
        
        lootBonus: 1.5,
        
        events: [
            "SALE! 50% off... de mire?",
            "Manager hívás folyamatban.",
            "Az utolsó terméket megvették előled.",
            "Loyalty points! +Gold.",
            "Return policy nightmare."
        ]
    },
    
    {
        id: "techsupport",
        name: "🤖 Tech Support Hell",
        description: "Have you tried turning it off and on again?",
        level: 25,
        emoji: "🤖",
        color: "#065f46",
        bgColor: "#022c22",
        
        enemyRequirement: 45,
        bossRequirement: 1,
        
        enemies: [
            { name: "IT Zombie", weight: 0.35 },
            { name: "Ticket Demon", weight: 0.3 },
            { name: "Legacy Code Horror", weight: 0.25 },
            { name: "Database Nightmare", weight: 0.1 }
        ],
        
        boss: "Tech Support Lich",
        
        lootBonus: 1.6,
        
        events: [
            "Endless ticket queue...",
            "User error. Always user error.",
            "The server is on fire. Literally.",
            "Have you tried... reboot?",
            "Windows update in progress."
        ]
    },
    
    {
        id: "crypto",
        name: "💰 Crypto Casino",
        description: "WAGMI or NGMI?",
        level: 30,
        emoji: "💰",
        color: "#a16207",
        bgColor: "#713f12",
        
        enemyRequirement: 50,
        bossRequirement: 1,
        
        enemies: [
            { name: "NFT Troll", weight: 0.3 },
            { name: "Rug Pull Demon", weight: 0.3 },
            { name: "Whale Hunter", weight: 0.25 },
            { name: "Ponzi Scheme Spirit", weight: 0.15 }
        ],
        
        boss: "Algorithm Beast",
        
        lootBonus: 1.8,
        
        events: [
            "To the moon! 🚀 ...vagy sem.",
            "Rug pull detected!",
            "Diamond hands activated.",
            "FOMO kicks in hard.",
            "Buy high, sell low. Classic."
        ]
    },
    
    {
        id: "ceotower",
        name: "👑 CEO Tower",
        description: "The final boss awaits...",
        level: 35,
        emoji: "👑",
        color: "#7e22ce",
        bgColor: "#581c87",
        
        enemyRequirement: 60,
        bossRequirement: 1,
        
        enemies: [
            { name: "Executive Elite", weight: 0.4 },
            { name: "Board Member Beast", weight: 0.3 },
            { name: "C-Suite Demon", weight: 0.2 },
            { name: "Shareholder Horror", weight: 0.1 }
        ],
        
        boss: "The CEO",
        
        lootBonus: 2.0,
        
        events: [
            "Quarterly earnings call horror.",
            "Synergy buzzword overload.",
            "Pivot! Again!",
            "Layoffs announced. Yikes.",
            "IPO hype mánia."
        ]
    }
];

// Get region by ID
export function getRegionById(id) {
    return regions.find(r => r.id === id);
}

// Get available regions for player level
export function getAvailableRegions(playerLevel, regionProgress) {
    return regions.filter(region => {
        // First region is always available
        if (region.id === "corporate") return true;
        
        // Check level requirement
        if (playerLevel < region.level) return false;
        
        // Check previous region completion (80%)
        const regionIndex = regions.findIndex(r => r.id === region.id);
        if (regionIndex > 0) {
            const prevRegion = regions[regionIndex - 1];
            const prevProgress = regionProgress[prevRegion.id];
            
            if (!prevProgress || prevProgress.completion < 80) {
                return false;
            }
        }
        
        return true;
    });
}

// Get weighted random enemy from region
export function getRandomEnemyFromRegion(region) {
    if (!region || !region.enemies) return "Kobold";
    
    const totalWeight = region.enemies.reduce((sum, e) => sum + e.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const enemy of region.enemies) {
        random -= enemy.weight;
        if (random <= 0) {
            return enemy.name;
        }
    }
    
    return region.enemies[0].name;
}

// Get random event from region
export function getRandomEventFromRegion(region) {
    if (!region || !region.events) return "Semmi különös.";
    return region.events[Math.floor(Math.random() * region.events.length)];
}