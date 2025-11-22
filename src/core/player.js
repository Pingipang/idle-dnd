export function createPlayer(startX, startY) {
    return {
        x: startX,
        y: startY,
        name: "Borzbarát Bárd Béla",

        // BASE STATS (without equipment)
        baseMaxHP: 20,
        baseDmg: 4,
        baseDef: 1,
        baseLuck: 1,
        
        // CURRENT STATS (base + equipment)
        maxHP: 20,
        hp: 20,
        dmg: 4,
        def: 1,
        luck: 1,

        moveRandom(maxX, maxY) {
            const dirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];
            const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
            this.x = Math.max(0, Math.min(maxX - 1, this.x + dx));
            this.y = Math.max(0, Math.min(maxY - 1, this.y + dy));
        },

        move(dx, dy, maxX, maxY) {
            const newX = this.x + dx;
            const newY = this.y + dy;

            if (newX < 0 || newY < 0 || newX >= maxX || newY >= maxY) return false;

            this.x = newX;
            this.y = newY;
            return true;
        },

        teleport(maxX, maxY) {
            this.x = Math.floor(Math.random() * maxX);
            this.y = Math.floor(Math.random() * maxY);
        },

        reset(x, y) {
            this.x = x;
            this.y = y;
            this.hp = this.maxHP;
        },
        
        // Update stats with equipment bonuses
        updateStats(equipmentStats) {
            this.dmg = this.baseDmg + equipmentStats.dmg;
            this.def = this.baseDef + equipmentStats.def;
            this.luck = this.baseLuck + equipmentStats.luck;
            
            const hpRatio = this.maxHP > 0 ? (this.hp / this.maxHP) : 1;
            this.maxHP = this.baseMaxHP; 
            this.hp = Math.floor(this.maxHP * hpRatio);

            if (this.hp > this.maxHP) {
                this.hp = this.maxHP;
            }
        }
    };
}