// Dungeon definitions for each region
export const dungeonsByRegion = {
    corporate: [
        {
            id: "corp_d1",
            name: "📧 The Inbox Abyss",
            description: "Unread emails as far as the eye can see...",
            difficulty: 1.0,
            enemyCount: 15,
            hasBoss: false
        },
        {
            id: "corp_d2",
            name: "🖨️ Printer Graveyard",
            description: "Where printers go to die. PC LOAD LETTER.",
            difficulty: 1.2,
            enemyCount: 18,
            hasBoss: false
        },
        {
            id: "corp_d3",
            name: "☕ Break Room Chaos",
            description: "Someone drank the last coffee. War has begun.",
            difficulty: 1.4,
            enemyCount: 20,
            hasBoss: false
        },
        {
            id: "corp_d4",
            name: "📊 Meeting Room of Eternal Suffering",
            description: "This meeting could have been an email.",
            difficulty: 1.6,
            enemyCount: 22,
            hasBoss: false
        },
        {
            id: "corp_d5",
            name: "👔 Karen's Office (BOSS)",
            description: "The manager she wants to speak to... is you.",
            difficulty: 2.0,
            enemyCount: 25,
            hasBoss: true,
            bossName: "Karen, Manager Hívó"
        }
    ],
    
    startup: [
        {
            id: "start_d1",
            name: "💡 Brainstorming Hell",
            description: "No bad ideas... except all of them.",
            difficulty: 1.0,
            enemyCount: 18,
            hasBoss: false
        },
        {
            id: "start_d2",
            name: "🍕 Pizza Box Fortress",
            description: "The smell is... interesting.",
            difficulty: 1.2,
            enemyCount: 20,
            hasBoss: false
        },
        {
            id: "start_d3",
            name: "📈 Growth Hacking Chamber",
            description: "Disrupting the disruption.",
            difficulty: 1.4,
            enemyCount: 22,
            hasBoss: false
        },
        {
            id: "start_d4",
            name: "🎯 Pivot Room",
            description: "We're pivoting... again.",
            difficulty: 1.6,
            enemyCount: 25,
            hasBoss: false
        },
        {
            id: "start_d5",
            name: "☕ Founder's Corner Office (BOSS)",
            description: "Time to disrupt the disruptor.",
            difficulty: 2.0,
            enemyCount: 28,
            hasBoss: true,
            bossName: "The Founder"
        }
    ],
    
    gaming: [
        {
            id: "game_d1",
            name: "🎮 Tutorial Hell",
            description: "Press any key to continue...",
            difficulty: 1.0,
            enemyCount: 20,
            hasBoss: false
        },
        {
            id: "game_d2",
            name: "💬 Toxic Chat Realm",
            description: "Your mom jokes everywhere.",
            difficulty: 1.2,
            enemyCount: 23,
            hasBoss: false
        },
        {
            id: "game_d3",
            name: "⚡ Lag Spike Arena",
            description: "Connection interrupted...",
            difficulty: 1.4,
            enemyCount: 25,
            hasBoss: false
        },
        {
            id: "game_d4",
            name: "🏆 Ranked Anxiety Zone",
            description: "One more game before sleep...",
            difficulty: 1.6,
            enemyCount: 28,
            hasBoss: false
        },
        {
            id: "game_d5",
            name: "💪 Chad's Gym (BOSS)",
            description: "Do you even lift, bro?",
            difficulty: 2.0,
            enemyCount: 30,
            hasBoss: true,
            bossName: "Chad Thunderfist"
        }
    ],
    
    social: [
        {
            id: "social_d1",
            name: "📱 Notification Nightmare",
            description: "*ding* *ding* *ding* *ding*",
            difficulty: 1.0,
            enemyCount: 22,
            hasBoss: false
        },
        {
            id: "social_d2",
            name: "💬 Comment Section Sewers",
            description: "Never read the comments.",
            difficulty: 1.2,
            enemyCount: 25,
            hasBoss: false
        },
        {
            id: "social_d3",
            name: "📸 Selfie Chamber",
            description: "No filter can save you here.",
            difficulty: 1.4,
            enemyCount: 28,
            hasBoss: false
        },
        {
            id: "social_d4",
            name: "👁️ Algorithm Labyrinth",
            description: "Your data is being harvested.",
            difficulty: 1.6,
            enemyCount: 30,
            hasBoss: false
        },
        {
            id: "social_d5",
            name: "🐉 Dragon's Content Studio (BOSS)",
            description: "Like and subscribe... or else.",
            difficulty: 2.0,
            enemyCount: 35,
            hasBoss: true,
            bossName: "Influencer Dragon"
        }
    ],
    
    retail: [
        {
            id: "retail_d1",
            name: "🛒 Cart Collision Course",
            description: "Shopping cart traffic jam.",
            difficulty: 1.0,
            enemyCount: 25,
            hasBoss: false
        },
        {
            id: "retail_d2",
            name: "💳 Checkout Line of Despair",
            description: "Card declined. Again.",
            difficulty: 1.2,
            enemyCount: 28,
            hasBoss: false
        },
        {
            id: "retail_d3",
            name: "🏷️ Clearance Bin Battlefield",
            description: "50% off violence.",
            difficulty: 1.4,
            enemyCount: 30,
            hasBoss: false
        },
        {
            id: "retail_d4",
            name: "📦 Black Friday Arena",
            description: "Survival of the fastest.",
            difficulty: 1.6,
            enemyCount: 35,
            hasBoss: false
        },
        {
            id: "retail_d5",
            name: "👹 Manager's Office (ULTIMATE KAREN)",
            description: "The final complaint.",
            difficulty: 2.0,
            enemyCount: 40,
            hasBoss: true,
            bossName: "Ultimate Karen"
        }
    ],
    
    techsupport: [
        {
            id: "tech_d1",
            name: "🎫 Ticket Queue Purgatory",
            description: "Priority: Low. Forever.",
            difficulty: 1.0,
            enemyCount: 28,
            hasBoss: false
        },
        {
            id: "tech_d2",
            name: "🔌 Cable Management Nightmare",
            description: "Which cable does what?",
            difficulty: 1.2,
            enemyCount: 30,
            hasBoss: false
        },
        {
            id: "tech_d3",
            name: "💾 Legacy Code Catacombs",
            description: "Written in COBOL. God help us.",
            difficulty: 1.4,
            enemyCount: 35,
            hasBoss: false
        },
        {
            id: "tech_d4",
            name: "🔥 Server Room Inferno",
            description: "It's not supposed to be on fire.",
            difficulty: 1.6,
            enemyCount: 38,
            hasBoss: false
        },
        {
            id: "tech_d5",
            name: "🧙‍♂️ Lich's Terminal (BOSS)",
            description: "sudo rm -rf /boss",
            difficulty: 2.0,
            enemyCount: 45,
            hasBoss: true,
            bossName: "Tech Support Lich"
        }
    ],
    
    crypto: [
        {
            id: "crypto_d1",
            name: "💎 Diamond Hands District",
            description: "HODL or die trying.",
            difficulty: 1.0,
            enemyCount: 30,
            hasBoss: false
        },
        {
            id: "crypto_d2",
            name: "🚀 To The Moon Launch Pad",
            description: "Wen lambo?",
            difficulty: 1.2,
            enemyCount: 35,
            hasBoss: false
        },
        {
            id: "crypto_d3",
            name: "🎨 NFT Gallery of Shame",
            description: "Right-click save as...",
            difficulty: 1.4,
            enemyCount: 38,
            hasBoss: false
        },
        {
            id: "crypto_d4",
            name: "📉 Rug Pull Ruins",
            description: "The founders have left the chat.",
            difficulty: 1.6,
            enemyCount: 40,
            hasBoss: false
        },
        {
            id: "crypto_d5",
            name: "🤖 Algorithm's Data Center (BOSS)",
            description: "You've been demonetized.",
            difficulty: 2.0,
            enemyCount: 50,
            hasBoss: true,
            bossName: "Algorithm Beast"
        }
    ],
    
    ceotower: [
        {
            id: "ceo_d1",
            name: "💼 Junior Executive Floor",
            description: "Climbing the corporate ladder.",
            difficulty: 1.0,
            enemyCount: 35,
            hasBoss: false
        },
        {
            id: "ceo_d2",
            name: "📊 Quarterly Earnings War Room",
            description: "The numbers, Mason!",
            difficulty: 1.2,
            enemyCount: 40,
            hasBoss: false
        },
        {
            id: "ceo_d3",
            name: "🎤 Board Meeting Chamber",
            description: "Synergy. Leverage. Paradigm shift.",
            difficulty: 1.4,
            enemyCount: 45,
            hasBoss: false
        },
        {
            id: "ceo_d4",
            name: "💰 Shareholder Summit",
            description: "Maximize that value!",
            difficulty: 1.6,
            enemyCount: 50,
            hasBoss: false
        },
        {
            id: "ceo_d5",
            name: "👑 The CEO's Penthouse (FINAL BOSS)",
            description: "The ultimate corporate showdown.",
            difficulty: 2.5,
            enemyCount: 60,
            hasBoss: true,
            bossName: "The CEO"
        }
    ]
};

// Get dungeons for a region
export function getDungeonsForRegion(regionId) {
    return dungeonsByRegion[regionId] || [];
}

// Get specific dungeon
export function getDungeonById(dungeonId) {
    for (const regionDungeons of Object.values(dungeonsByRegion)) {
        const dungeon = regionDungeons.find(d => d.id === dungeonId);
        if (dungeon) return dungeon;
    }
    return null;
}