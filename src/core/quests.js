export const questTypes = {
    KILL: "kill",
    COLLECT: "collect",
    EXPLORE: "explore",
    SURVIVE: "survive",
    BOSS: "boss"
};

// Quests organized by region
export const regionalQuests = {
    corporate: [
        {
            id: "corporate_wifi",
            type: questTypes.KILL,
            title: "WiFi Segítség",
            description: "Segíts 5 Junior Koboldnak 'megtalálni' a WiFi jelszót.",
            target: "Junior Kobold",
            targetCount: 5,
            rewards: { xp: 80, gold: 40 }
        },
        {
            id: "corporate_meeting",
            type: questTypes.SURVIVE,
            title: "Meeting Survivor",
            description: "Élj túl 3 csatát a Corporate Campus-on.",
            targetCount: 3,
            rewards: { xp: 100, gold: 50 }
        },
        {
            id: "corporate_boss",
            type: questTypes.BOSS,
            title: "Manager Please!",
            description: "Hívd meg Karen-t beszélgetésre... végleg.",
            targetCount: 1,
            rewards: { xp: 200, gold: 100 }
        }
    ],
    
    startup: [
        {
            id: "startup_coffee",
            type: questTypes.KILL,
            title: "Kávé Krízis",
            description: "Állítsd meg 8 Barista Skeleton-t mielőtt túladagolják magukat.",
            target: "Barista Skeleton",
            targetCount: 8,
            rewards: { xp: 120, gold: 60 }
        },
        {
            id: "startup_hipster",
            type: questTypes.KILL,
            title: "Hipster Hunter",
            description: "Győzd le 5 Hipster Troll-t. Unironically.",
            target: "Hipster Troll",
            targetCount: 5,
            rewards: { xp: 150, gold: 80 }
        },
        {
            id: "startup_boss",
            type: questTypes.BOSS,
            title: "Founder Shutdown",
            description: "Küldj The Founder-t early retirement-be.",
            targetCount: 1,
            rewards: { xp: 300, gold: 150 }
        }
    ],
    
    gaming: [
        {
            id: "gaming_noob",
            type: questTypes.KILL,
            title: "Git Gud",
            description: "Mutasd meg ki a boss 10 Noob Slayer-nek.",
            target: "Noob Slayer",
            targetCount: 10,
            rewards: { xp: 200, gold: 100 }
        },
        {
            id: "gaming_toxic",
            type: questTypes.KILL,
            title: "Toxicity Cleanup",
            description: "Ban-olj 7 Toxic Troll-t a szerverről.",
            target: "Toxic Troll",
            targetCount: 7,
            rewards: { xp: 180, gold: 90 }
        },
        {
            id: "gaming_boss",
            type: questTypes.BOSS,
            title: "Chad Challenge",
            description: "Bizonyítsd be hogy te vagy az alpha. Győzd le Chad-et.",
            targetCount: 1,
            rewards: { xp: 400, gold: 200 }
        }
    ],
    
    social: [
        {
            id: "social_influencer",
            type: questTypes.KILL,
            title: "Unfollow Spree",
            description: "Unfollow-olj 12 Influencer Troll-t.",
            target: "Influencer Troll",
            targetCount: 12,
            rewards: { xp: 250, gold: 120 }
        },
        {
            id: "social_algorithm",
            type: questTypes.KILL,
            title: "Algorithm Fighter",
            description: "Harcolj az algoritmussal. Ölj meg 4 Algorithm Beast-et.",
            target: "Algorithm Beast",
            targetCount: 4,
            rewards: { xp: 300, gold: 150 }
        },
        {
            id: "social_boss",
            type: questTypes.BOSS,
            title: "Dragon Slayer",
            description: "Unsubscribe Influencer Dragon-tól. Permanently.",
            targetCount: 1,
            rewards: { xp: 500, gold: 250 }
        }
    ],
    
    retail: [
        {
            id: "retail_sale",
            type: questTypes.KILL,
            title: "Sale Prevention",
            description: "Állítsd meg 15 Sale Hunter-t Black Friday előtt.",
            target: "Sale Hunter",
            targetCount: 15,
            rewards: { xp: 300, gold: 150 }
        },
        {
            id: "retail_horde",
            type: questTypes.KILL,
            title: "Black Friday Defense",
            description: "Tartsd vissza a Black Friday Horde-ot. 10 kill kell.",
            target: "Black Friday Horde",
            targetCount: 10,
            rewards: { xp: 350, gold: 180 }
        },
        {
            id: "retail_boss",
            type: questTypes.BOSS,
            title: "Ultimate Manager Call",
            description: "Légy te a manager akit Ultimate Karen hívni akar.",
            targetCount: 1,
            rewards: { xp: 600, gold: 300 }
        }
    ],
    
    techsupport: [
        {
            id: "tech_zombie",
            type: questTypes.KILL,
            title: "IT Cleanup",
            description: "Restart-old újra 12 IT Zombie-t.",
            target: "IT Zombie",
            targetCount: 12,
            rewards: { xp: 400, gold: 200 }
        },
        {
            id: "tech_ticket",
            type: questTypes.KILL,
            title: "Ticket Hell",
            description: "Close-old 8 Ticket Demon-t. WONTFIX.",
            target: "Ticket Demon",
            targetCount: 8,
            rewards: { xp: 380, gold: 190 }
        },
        {
            id: "tech_boss",
            type: questTypes.BOSS,
            title: "Lich Reboot",
            description: "Turn off Tech Support Lich. Ne turn on újra.",
            targetCount: 1,
            rewards: { xp: 700, gold: 350 }
        }
    ],
    
    crypto: [
        {
            id: "crypto_nft",
            type: questTypes.KILL,
            title: "Right Click Saver",
            description: "Screenshot-old 15 NFT Troll collection-jét.",
            target: "NFT Troll",
            targetCount: 15,
            rewards: { xp: 500, gold: 250 }
        },
        {
            id: "crypto_rug",
            type: questTypes.KILL,
            title: "Rug Pull Prevention",
            description: "Állítsd meg 6 Rug Pull Demon-t.",
            target: "Rug Pull Demon",
            targetCount: 6,
            rewards: { xp: 480, gold: 240 }
        },
        {
            id: "crypto_boss",
            type: questTypes.BOSS,
            title: "Algorithm Override",
            description: "Hack-eld meg az Algorithm Beast-et.",
            targetCount: 1,
            rewards: { xp: 800, gold: 400 }
        }
    ],
    
    ceotower: [
        {
            id: "ceo_elite",
            type: questTypes.KILL,
            title: "Executive Elimination",
            description: "Downsize 20 Executive Elite-et.",
            target: "Executive Elite",
            targetCount: 20,
            rewards: { xp: 600, gold: 300 }
        },
        {
            id: "ceo_board",
            type: questTypes.KILL,
            title: "Board Room Brawl",
            description: "Verd szét 10 Board Member Beast-et.",
            target: "Board Member Beast",
            targetCount: 10,
            rewards: { xp: 650, gold: 320 }
        },
        {
            id: "ceo_final",
            type: questTypes.BOSS,
            title: "CEO Takedown",
            description: "THE FINAL BOSS. Defeat The CEO.",
            targetCount: 1,
            rewards: { xp: 1000, gold: 500 }
        }
    ]
};

// Get quests for specific region
export function getQuestsForRegion(regionId) {
    return regionalQuests[regionId] || [];
}

// Get random quests from current region
export function getRandomRegionalQuests(regionId, count = 3) {
    const quests = getQuestsForRegion(regionId);
    if (quests.length === 0) return [];
    
    const shuffled = [...quests].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, quests.length));
}