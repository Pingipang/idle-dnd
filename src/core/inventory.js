export function createInventory() {
  const items = new Map();

  return {
    addItem(name, quantity = 1, type = "misc", amount = 0) {
      const current = items.get(name);
      
      if (current) {
        current.quantity += quantity;
      } else {
        items.set(name, { 
          quantity, 
          type, 
          amount 
        });
      }
    },

    removeItem(name, quantity = 1) {
      if (!items.has(name)) return false;

      const current = items.get(name);
      const newQty = current.quantity - quantity;

      if (newQty > 0) {
        current.quantity = newQty;
      } else {
        items.delete(name);
      }

      return true;
    },

    hasItem(name) {
      return items.has(name);
    },

    getItems() {
      return Array.from(items.entries()).map(([name, data]) => ({
        name,
        quantity: data.quantity,
        type: data.type,
        amount: data.amount
      }));
    },

    getUsableItems() {
      return this.getItems().filter(i =>
        ["heal", "buff"].includes(i.type)
      );
    },

    clear() {
      items.clear();
    }
  };
}