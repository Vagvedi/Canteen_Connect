// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllOrders,
  updateOrderStatus,
  getMenu,
} from "../api/client";
import { useAuthStore } from "../state/store";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import OrderStatusBadge from "../components/OrderStatusBadge";
import Bill from "../components/Bill";
import { useOrderTimer } from "../hooks/useOrderTimer";

const STATUS_OPTIONS = [
  "placed",
  "preparing",
  "ready",
  "cancelled",
];

const ACTIVE_STATUSES = ["placed", "preparing", "ready"];

const CATEGORIES = [
  "Beverages",
  "Snacks",
  "Meals",
  "Desserts",
  "Combos",
];

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState("active"); // active, cancelled, completed

  /* ---------------- ORDERS ---------------- */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBill, setShowBill] = useState(false);

  /* ---------------- MENU ---------------- */
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

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
    await logout();
    navigate("/login");
  };

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");
        const data = await getAllOrders();
        if (isMounted) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Orders fetch error:", err);
        if (isMounted) {
          setOrdersError("Failed to load orders. Please try again.");
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    // Refresh orders every 30 seconds to catch auto-completed orders
    const refreshInterval = setInterval(fetchOrders, 30000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    let isMounted = true;

    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        setMenuError("");
        const data = await getMenu();
        if (isMounted) {
          setMenu(data || []);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        if (isMounted) {
          setMenuError("Failed to load menu. Please try again.");
        }
      } finally {
        if (isMounted) {
          setMenuLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- FILTER ORDERS ---------------- */
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "active") {
      return ACTIVE_STATUSES.includes(order.status);
    } else if (orderFilter === "cancelled") {
      return order.status === "cancelled";
    } else if (orderFilter === "completed") {
      return order.status === "completed";
    }
    return true;
  });

  /* ---------------- ORDER STATUS ---------------- */
  const handleStatusChange = async (id, status, e) => {
    e?.stopPropagation();
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? updated : o))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleViewBill = (order) => {
    setSelectedBill(order);
    setShowBill(true);
  };

  const handleCloseBill = () => {
    setShowBill(false);
    setSelectedBill(null);
  };

  /* ---------------- MENU ACTIONS ---------------- */
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert("Please fill in both name and price.");
      return;
    }

    if (Number(newItem.price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("menu")
        .insert({
          name: newItem.name.trim(),
          price: Number(newItem.price),
          category: newItem.category,
          available: true,
        })
        .select()
        .single();

      if (error) throw error;

      setMenu((prev) => [...prev, data]);
      setNewItem({
        name: "",
        price: "",
        category: CATEGORIES[0],
      });
    } catch (err) {
      console.error("Add menu item error:", err);
      alert("Failed to add menu item. Please try again.");
    }
  };

  const toggleAvailability = async (id, available, e) => {
    e?.stopPropagation();
    try {
      const { data, error } = await supabase
        .from("menu")
        .update({ available })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setMenu((prev) =>
        prev.map((i) => (i.id === id ? data : i))
      );
    } catch (err) {
      console.error("Toggle availability error:", err);
      alert("Failed to update item availability. Please try again.");
    }
  };

  const deleteMenuItem = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to delete this menu item? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("menu")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMenu((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete menu item error:", err);
      alert("Failed to delete menu item. Please try again.");
    }
  };

  /* ---------------- CLICKABLE ORDER CARD COMPONENT ---------------- */
  const ClickableOrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);
    const canEdit = ACTIVE_STATUSES.includes(order.status);
    const { formattedTime, isExpired } = useOrderTimer(order, handleStatusChange);

    return (
      <motion.div
        onClick={() => setExpanded((p) => !p)}
        className="glass p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* SUMMARY */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1">
              {order.order_code ? (
                <span className="font-bold text-purple-300">Code: {order.order_code}</span>
              ) : (
                `Order #${order.id.slice(0, 8)}`
              )}
            </p>
            <p className="font-bold text-xl text-white mb-1">₹{order.total}</p>
            <p className="text-sm text-white/70 mb-1">
              {order.customer_name}
            </p>
            {order.register_number && (
              <p className="text-xs text-purple-300 mb-1">
                Roll: {order.register_number}
              </p>
            )}
            <p className="text-xs text-white/50 mb-2">
              {new Date(order.created_at).toLocaleString()}
            </p>
            
            {/* Timer Display */}
            {order.expires_at && order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="mt-2">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                  isExpired 
                    ? 'bg-red-500/30 text-red-300 border border-red-400/50' 
                    : 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                }`}>
                  <span>⏱️</span>
                  <span className="font-mono font-semibold">
                    {isExpired ? 'EXPIRED' : formattedTime}
                  </span>
                </div>
                {isExpired && (
                  <p className="text-xs text-red-400 mt-1">Auto-completing...</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <OrderStatusBadge status={order.status} />
            {canEdit && (
              <select
                value={order.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleStatusChange(order.id, e.target.value, e)}
                className="bg-[#1b1035] text-white px-3 py-2 rounded-lg border border-white/10 text-sm"
              >
                {STATUS_OPTIONS.filter((s) => ACTIVE_STATUSES.includes(s) || s === "cancelled").map((s) => (
                  <option key={s} value={s} className="bg-[#1b1035]">
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
            {!canEdit && (
              <p className="text-xs text-white/50 italic">
                {order.status === "completed" ? "Completed" : "Cancelled"}
              </p>
            )}
          </div>
        </div>

        {/* EXPANDED VIEW */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10 space-y-3"
            >
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-white/80"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBill(order);
                }}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition"
              >
                View Full Bill
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b145e] to-[#14082f]">
      <motion.div
        className="max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* ===== TOP BAR ===== */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-white/70 text-lg">
              Manage orders & menu items
            </p>
          </div>

          {/* USER + ROLE + LOGOUT */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-white">{user.name || "Admin"}</p>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-600 text-white font-bold">
                ADMIN
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-xl font-semibold text-white"
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
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ---------------- ORDERS TAB ---------------- */}
        {activeTab === "orders" && (
          <>
            {/* Order Filter Tabs */}
            <div className="flex gap-3 mb-6">
              {[
                { key: "active", label: "Active Orders", count: orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length },
                { key: "completed", label: "Completed", count: orders.filter((o) => o.status === "completed").length },
                { key: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setOrderFilter(filter.key)}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${
                    orderFilter === filter.key
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-white/70 text-lg">Loading orders…</p>
              </div>
            ) : ordersError ? (
              <div className="glass p-6 rounded-2xl">
                <p className="text-red-400 mb-4">{ordersError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass p-8 rounded-2xl text-center">
                <p className="text-white/60 text-lg">
                  {orderFilter === "active"
                    ? "No active orders at the moment."
                    : orderFilter === "completed"
                    ? "No completed orders yet."
                    : "No cancelled orders yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <ClickableOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ---------------- MENU TAB ---------------- */}
        {activeTab === "menu" && (
          <>
            <div className="glass p-6 rounded-2xl mb-6 space-y-4">
              <h2 className="font-bold text-xl text-white mb-4">Add New Menu Item</h2>

              <input
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-purple-500 focus:outline-none"
              />

              <input
                placeholder="Price (₹)"
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-purple-500 focus:outline-none"
              />

              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#1b1035] text-white border border-white/20 focus:border-purple-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1b1035]">
                    {c}
                  </option>
                ))}
              </select>

              <button
                onClick={addMenuItem}
                className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold text-white transition shadow-lg shadow-purple-500/50"
              >
                Add Item
              </button>
            </div>

            {menuLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-white/70 text-lg">Loading menu…</p>
              </div>
            ) : menuError ? (
              <div className="glass p-6 rounded-2xl">
                <p className="text-red-400 mb-4">{menuError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : menu.length === 0 ? (
              <div className="glass p-8 rounded-2xl text-center">
                <p className="text-white/60 text-lg">No menu items yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <div
                    key={item.id}
                    className="glass p-5 rounded-xl hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white mb-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-white/60 mb-2">{item.category}</p>
                        <p className="text-xl font-bold gradient-text">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => toggleAvailability(item.id, !item.available, e)}
                        className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition ${
                          item.available
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {item.available ? "AVAILABLE" : "HIDDEN"}
                      </button>
                      <button
                        onClick={(e) => deleteMenuItem(item.id, e)}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
                        title="Delete item"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Bill Modal */}
      <AnimatePresence>
        {showBill && selectedBill && (
          <Bill bill={selectedBill} onClose={handleCloseBill} />
        )}
      </AnimatePresence>
    </div>
  );
}
