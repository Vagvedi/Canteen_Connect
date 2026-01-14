// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getAllOrders,
  updateOrderStatus,
  getMenu,
} from "../api/client";
import { useAuthStore } from "../state/store";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const STATUS_OPTIONS = [
  "placed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

const CATEGORIES = [
  "Beverages",
  "Snacks",
  "Meals",
  "Desserts",
  "Combos",
];

export default function AdminDashboard() {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");

  /* ---------------- ORDERS ---------------- */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  /* ---------------- MENU ---------------- */
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: CATEGORIES[0],
  });

  /* ---------------- ROLE GUARD ---------------- */
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin")
    return <Navigate to="/dashboard" />;

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    navigate("/login");
  };

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    (async () => {
      const data = await getAllOrders();
      setOrders(data || []);
      setOrdersLoading(false);
    })();
  }, []);

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    (async () => {
      const data = await getMenu();
      setMenu(data || []);
      setMenuLoading(false);
    })();
  }, []);

  /* ---------------- ORDER STATUS ---------------- */
  const handleStatusChange = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? updated : o))
    );
  };

  /* ---------------- MENU ACTIONS ---------------- */
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price) return;

    const { data } = await supabase
      .from("menu")
      .insert({
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category,
        available: true,
      })
      .select()
      .single();

    setMenu((prev) => [...prev, data]);
    setNewItem({
      name: "",
      price: "",
      category: CATEGORIES[0],
    });
  };

  const toggleAvailability = async (id, available) => {
    const { data } = await supabase
      .from("menu")
      .update({ available })
      .eq("id", id)
      .select()
      .single();

    setMenu((prev) =>
      prev.map((i) => (i.id === id ? data : i))
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ===== TOP BAR ===== */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-1">
            Admin Dashboard
          </h1>
          <p className="text-white/70">
            Manage system (orders & menu)
          </p>
        </div>

        {/* USER + ROLE + LOGOUT */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{user.name || "Admin"}</p>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-600">
              ADMIN
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8">
        {["orders", "menu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl font-semibold ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------------- ORDERS ---------------- */}
      {activeTab === "orders" && (
        <>
          {ordersLoading ? (
            <p>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-white/60">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="glass p-6 rounded-2xl">
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg">₹{o.total}</p>
                      <p className="text-sm text-white/60">
                        {o.customer_name}
                      </p>
                    </div>

                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value)
                      }
                      className="bg-[#1b1035] text-white px-3 py-2 rounded-lg border border-white/10"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#1b1035]">
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {o.items?.map((i, idx) => (
                    <p key={idx} className="text-sm text-white/80">
                      {i.name} × {i.qty}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------------- MENU ---------------- */}
      {activeTab === "menu" && (
        <>
          <div className="glass p-6 rounded-2xl mb-6 space-y-4">
            <h2 className="font-semibold text-lg">Add Menu Item</h2>

            <input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10"
            />

            <input
              placeholder="Price"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10"
            />

            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[#1b1035] text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#1b1035]">
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={addMenuItem}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {menu.map((i) => (
              <div
                key={i.id}
                className="glass p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {i.name} – ₹{i.price}
                  </p>
                  <p className="text-sm text-white/60">{i.category}</p>
                </div>

                <button
                  onClick={() => toggleAvailability(i.id, !i.available)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    i.available ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {i.available ? "AVAILABLE" : "HIDDEN"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
