import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (menuItem) => {
    const existing = get().items.find((i) => i.menuId === menuItem.id);
    if (existing) {
      return set({
        items: get().items.map((i) =>
          i.menuId === menuItem.id ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    }
    return set({ items: [...get().items, { menuId: menuItem.id, qty: 1, menuItem }] });
  },
  updateQty: (menuId, qty) =>
    set({
      items: get().items.map((i) => (i.menuId === menuId ? { ...i, qty: Math.max(1, qty) } : i)),
    }),
  removeItem: (menuId) => set({ items: get().items.filter((i) => i.menuId !== menuId) }),
  clear: () => set({ items: [] }),
}));

