// src/state/store.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,

  initialize: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ user: null, initialized: true });
      return;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("id, name, email, role, register_number")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      set({ user: null, initialized: true });
      return;
    }

    set({
      user: profile,
      initialized: true,
    });
  },

  logout: async () => {
    await supabase.auth.signOut();

    // 🔑 IMPORTANT FIX
    set({
      user: null,
      initialized: true,
    });
  },
}));
