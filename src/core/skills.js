export const skills = [
    {
        id: "power_strike",
        name: "Power Strike",
        type: "active",
        desc: "+150% sebzés (CD: 3 kör)",
        cooldown: 3,
        use(player, enemy) {
            const damage = Math.floor(player.dmg * 1.5);
            enemy.hp -= damage;
            return `Power Strike ${damage} sebzés!`;
        }
    },

    {
        id: "fortify",
        name: "Fortify",
        type: "passive",
        desc: "+2 def",
        apply(player) {
            player.def += 2;
        }
    },

    {
        id: "quick_reflex",
        name: "Quick Reflex",
        type: "passive",
        desc: "10% esély elkerülni egy támadást",
        dodgeChance: 0.10
    }
]