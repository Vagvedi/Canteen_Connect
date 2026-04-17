import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (item) => {
    const items = [...get().items];
    const existing = items.find((i) => i.id === item.id);

    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }

    const total = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    set({ items, total });
  },

  removeItem: (itemId) => {
    const items = get().items.filter((i) => i.id !== itemId);
    const total = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    set({ items, total });
  },

  updateQuantity: (itemId, qty) => {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }

    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, qty } : i
    );
    const total = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    set({ items, total });
  },

  clear: () => {
    set({ items: [], total: 0 });
  },
}));
