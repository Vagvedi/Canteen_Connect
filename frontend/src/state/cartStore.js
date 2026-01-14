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
}));
