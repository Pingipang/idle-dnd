const lootTable = [
  { name: "Kavics", chance: 0.4, min: 1, max: 3, type: "misc", amount: 0 },
  { name: "Gyógyital", chance: 0.3, min: 1, max: 1, type: "heal", amount: 10 },
  { name: "Arany", chance: 0.2, min: 5, max: 15, type: "misc", amount: 0 },
  { name: "Kis Mana Kristály", chance: 0.1, min: 1, max: 2, type: "buff", amount: 5 }
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

export function getLoot() {
  const drop = pickLoot();

  if (!drop) return null;

  const quantity =
    Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;

  return { 
    name: drop.name, 
    quantity,
    type: drop.type,
    amount: drop.amount
  };
}