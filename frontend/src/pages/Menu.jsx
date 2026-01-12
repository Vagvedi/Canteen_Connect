import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import MenuCard from "../components/MenuCard";
import CartSidebar from "../components/CartSidebar";
import { useCartStore, useAuthStore } from "../state/store";
import { supabase } from "../lib/supabase";

export default function Menu() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const { items, addItem, updateQty, removeItem } = useCartStore();

  // 🔒 ADMIN BLOCK
  useEffect(() => {
    if (profile?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [profile, navigate]);

  // 🔄 FETCH MENU FROM SUPABASE
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setMenu(data || []);
      }

      setLoading(false);
    };

    fetchMenu();
  }, []);

  // 🔄 REALTIME MENU UPDATES
  useEffect(() => {
    const channel = supabase
      .channel("menu-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu" },
        (payload) => {
          setMenu((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((i) =>
                i.id === payload.new.id ? payload.new : i
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((i) => i.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const categories = ["all", ...new Set(menu.map((m) => m.category))];
  const visibleMenu = menu.filter((m) => m.available);

  const filtered =
    category === "all"
      ? visibleMenu
      : visibleMenu.filter((m) => m.category === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          className="glass p-8 rounded-2xl shadow-xl space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text">
            Fresh, fast, and student-priced.
          </h1>
          <p className="text-gray-300">
            Browse by category, add items quickly, and checkout in a few taps.
          </p>

          {/* STATS */}
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            <div className="card p-4">
              <p className="text-xs text-gray-400">Categories</p>
              <p className="text-2xl font-bold">
                {categories.length - 1}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-400">Menu items</p>
              <p className="text-2xl font-bold">{visibleMenu.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-400">Cart items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
          </div>
        </motion.div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                category === cat
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU LIST */}
        {loading ? (
          <p className="text-gray-400">Loading menu...</p>
        ) : (
          <AnimatePresence>
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.length === 0 && (
                <div className="card p-6 col-span-2 text-center text-gray-400">
                  No items in this category yet.
                </div>
              )}

              {filtered.map((item, index) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  index={index}
                  onAdd={addItem}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* RIGHT */}
      <CartSidebar
        items={items}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
    </div>
  );
}
