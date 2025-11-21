export function createPlayer(startX, startY) {
    return {
        x: startX,
        y: startY,

        // PLAYER STATS
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
        }
    };
}
