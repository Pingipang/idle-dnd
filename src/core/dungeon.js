import { getRandomBiome } from "./biomes.js";

export function createDungeon(width, height) {
  const grid = document.getElementById("dungeon");
  grid.style.gridTemplateColumns = `repeat(${width}, 40px)`;

  const cells = [];
  const biomeMap = new Map(); // Track biome for each cell
  
  // Generate biomes for each cell
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.id = `cell-${x}-${y}`;
      
      // Assign random biome
      const biome = getRandomBiome();
      biomeMap.set(`${x}-${y}`, biome);
      
      div.style.backgroundColor = biome.bgColor;
      div.style.borderColor = biome.color;
      
      div.setAttribute("data-biome-emoji", biome.emoji);
      
      grid.appendChild(div);
      cells.push(div);
    }
  }

  function draw(player) {
    cells.forEach((c) => {
      c.classList.remove("player");
      c.textContent = c.getAttribute("data-biome-emoji") || "";
    });
    
    const cell = document.getElementById(`cell-${player.x}-${player.y}`);
    if (cell) {
      cell.classList.add("player");
      cell.textContent = "🧙";
    }
  }
  
  function getCurrentBiome(x, y) {
    return biomeMap.get(`${x}-${y}`) || null;
  }
  
  function regenerateBiomes() {
    biomeMap.clear();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        const biome = getRandomBiome();
        
        biomeMap.set(`${x}-${y}`, biome);
        
        if (cell) {
          cell.style.backgroundColor = biome.bgColor;
          cell.style.borderColor = biome.color;
          cell.setAttribute("data-biome-emoji", biome.emoji);
        }
      }
    }
  }

  return { 
    width, 
    height, 
    draw, 
    getCurrentBiome,
    regenerateBiomes 
  };
}