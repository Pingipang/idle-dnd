const enemyTypes = [
    { name: "Kobold", hp: 10, dmg: 3, lootChance: 0.4, xp: 15 },
    { name: "Csontváz", hp: 15, dmg: 4, lootChance: 0.5, xp: 25 },
    { name: "Goblin", hp: 12, dmg: 5, lootChance: 0.3, xp: 20 },
    { name: "Mini Troll", hp: 20, dmg: 6, lootChance: 0.2, xp: 35 }
];

export function spawnEnemy() {
    const enemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    return {
        name: enemy.name,
        maxHP: enemy.hp,
        hp: enemy.hp,
        dmg: enemy.dmg,
        lootChance: enemy.lootChance,
        xp: enemy.xp
    };
}