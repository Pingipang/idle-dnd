import { generateEquipment, getRandomSlot } from "./equipment.js";

const lootTable = [
  { name: "Kavics", chance: 0.3, min: 1, max: 3, type: "misc", amount: 0 },
  { name: "Gyógyital", chance: 0.25, min: 1, max: 1, type: "heal", amount: 10 },
  { name: "Arany", chance: 0.2, min: 5, max: 15, type: "misc", amount: 0 },
  { name: "Kis Mana Kristály", chance: 0.1, min: 1, max: 2, type: "buff", amount: 5 },
  { name: "EQUIPMENT", chance: 0.15, min: 1, max: 1, type: "equipment", amount: 0 } // New!
];

function pickLoot() {
  const r = Math.random();
  let sum = 0;

  for (const item of lootTable) {
    sum += item.chance;
    if (r <= sum) return item;
  }
  return null;
}

export function getLoot(playerLevel = 1) {
  const drop = pickLoot();

  if (!drop) return null;

  // Special handling for equipment
  if (drop.type === "equipment") {
    const slot = getRandomSlot();
    const equipment = generateEquipment(slot, playerLevel);
    
    return {
      ...equipment,
      quantity: 1,
      isEquipment: true
    };
  }

  const quantity =
    Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;

  return { 
    name: drop.name, 
    quantity,
    type: drop.type,
    amount: drop.amount,
    isEquipment: false
  };
}

// Get guaranteed equipment drop (for bosses)
export function getEquipmentLoot(playerLevel = 1, rarity = null) {
  const slot = getRandomSlot();
  const equipment = generateEquipment(slot, playerLevel);
  
  return {
    ...equipment,
    quantity: 1,
    isEquipment: true
  };
}