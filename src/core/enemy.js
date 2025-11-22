const enemyTypes = [
    // Classic enemies
    { name: "Kobold", hp: 10, dmg: 3, lootChance: 0.4, xp: 15 },
    { name: "Csontváz", hp: 15, dmg: 4, lootChance: 0.5, xp: 25 },
    { name: "Goblin", hp: 12, dmg: 5, lootChance: 0.3, xp: 20 },
    { name: "Mini Troll", hp: 20, dmg: 6, lootChance: 0.2, xp: 35 },
    
    // Corporate enemies
    { name: "Manager Mimic", hp: 18, dmg: 5, lootChance: 0.6, xp: 30 },
    { name: "Junior Kobold", hp: 8, dmg: 2, lootChance: 0.5, xp: 12 },
    { name: "Senior Troll", hp: 25, dmg: 7, lootChance: 0.4, xp: 40 },
    { name: "Intern Goblin", hp: 10, dmg: 3, lootChance: 0.3, xp: 15 },
    
    // Cafe enemies
    { name: "Barista Skeleton", hp: 14, dmg: 4, lootChance: 0.5, xp: 22 },
    { name: "Latte Goblin", hp: 11, dmg: 4, lootChance: 0.4, xp: 18 },
    { name: "Espresso Elemental", hp: 13, dmg: 6, lootChance: 0.3, xp: 25 },
    { name: "Karen", hp: 30, dmg: 8, lootChance: 0.7, xp: 50 },
    
    // Gaming enemies
    { name: "Ragequit Warrior", hp: 22, dmg: 8, lootChance: 0.5, xp: 38 },
    { name: "AFK Golem", hp: 35, dmg: 3, lootChance: 0.2, xp: 30 },
    { name: "Toxic Troll", hp: 18, dmg: 9, lootChance: 0.4, xp: 35 },
    { name: "Noob Slayer", hp: 20, dmg: 7, lootChance: 0.5, xp: 32 },
    
    // Social Media enemies
    { name: "Influencer Troll", hp: 16, dmg: 5, lootChance: 0.6, xp: 28 },
    { name: "Comment Section Demon", hp: 19, dmg: 6, lootChance: 0.4, xp: 33 },
    { name: "Algorithm Beast", hp: 28, dmg: 8, lootChance: 0.3, xp: 45 },
    { name: "Cancel Mob", hp: 15, dmg: 10, lootChance: 0.5, xp: 35 },
    
    // Retail enemies
    { name: "Sale Hunter", hp: 14, dmg: 5, lootChance: 0.6, xp: 24 },
    { name: "Black Friday Horde", hp: 20, dmg: 7, lootChance: 0.5, xp: 36 },
    { name: "Karen Boss", hp: 32, dmg: 9, lootChance: 0.8, xp: 55 },
    { name: "Coupon Collector", hp: 12, dmg: 4, lootChance: 0.5, xp: 20 }
];

export function spawnEnemy(specificName = null) {
    let enemy;
    
    if (specificName) {
        enemy = enemyTypes.find(e => e.name === specificName);
        if (!enemy) {
            enemy = enemyTypes[0]; 
        }
    } else {
        enemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    }

    return {
        name: enemy.name,
        maxHP: enemy.hp,
        hp: enemy.hp,
        dmg: enemy.dmg,
        lootChance: enemy.lootChance,
        xp: enemy.xp
    };
}

// Spawn enemy from specific biome
export function spawnEnemyFromBiome(biome) {
    if (!biome || !biome.enemies || biome.enemies.length === 0) {
        return spawnEnemy(); // Random enemy
    }
    
    const enemyName = biome.enemies[Math.floor(Math.random() * biome.enemies.length)];
    return spawnEnemy(enemyName);
}