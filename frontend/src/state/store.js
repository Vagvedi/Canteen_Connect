import { create } from "zustand";
import { supabase } from "../lib/supabase";

/* =====================================================
   AUTH STORE
   ===================================================== */

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  session: null,
  initialized: false,

  /* ---------------- INIT ---------------- */
  initialize: async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // ❌ No session or error
      if (!session?.user || sessionError) {
        set({
          user: null,
          profile: null,
          session: null,
          initialized: true,
        });
        return;
      }

      // ✅ Session exists → fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // 🔴 Profile missing / deleted
      if (profileError || !profile) {
        console.warn(
          "Auth user exists but profile missing. Forcing logout."
        );

        await supabase.auth.signOut();

        set({
          user: null,
          profile: null,
          session: null,
          initialized: true,
        });
        return;
      }

      // ✅ Everything valid
      set({
        user: session.user,
        profile,
        session,
        initialized: true,
      });
    } catch (err) {
      console.error("Auth init failed:", err);

      await supabase.auth.signOut();

      set({
        user: null,
        profile: null,
        session: null,
        initialized: true,
      });
    }
  },

  /* ---------------- LOGOUT ---------------- */
  logout: async () => {
    await supabase.auth.signOut();

    set({
      user: null,
      profile: null,
      session: null,
      initialized: true,
    });
  },
}));

/* =====================================================
   CART STORE
   ===================================================== */

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (menuItem) => {
    const existing = get().items.find(
      (i) => i.menuId === menuItem.id
    );

    if (existing) {
      set({
        items: get().items.map((i) =>
          i.menuId === menuItem.id
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      });
      return;
    }

    set({
      items: [
        ...get().items,
        {
          menuId: menuItem.id,
          qty: 1,
          menuItem,
        },
      ],
    });
  },

  updateQty: (menuId, qty) =>
    set({
      items: get().items.map((i) =>
        i.menuId === menuId
          ? { ...i, qty: Math.max(1, qty) }
          : i
      ),
    }),

  removeItem: (menuId) =>
    set({
      items: get().items.filter(
        (i) => i.menuId !== menuId
      ),
    }),

  clear: () => set({ items: [] }),
}));
