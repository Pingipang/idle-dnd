export function createDungeon(width, height) {
  const grid = document.getElementById("dungeon");
  grid.style.gridTemplateColumns = `repeat(${width}, 40px)`;

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.id = `cell-${x}-${y}`;
      grid.appendChild(div);
      cells.push(div);
    }
  }

  function draw(player) {
    cells.forEach((c) => {
      c.classList.remove("player");
      c.textContent = "";
    });
    
    const cell = document.getElementById(`cell-${player.x}-${player.y}`);
    if (cell) {
      cell.classList.add("player");
      cell.textContent = "🧙";
    }
  }

  return { width, height, draw };
}