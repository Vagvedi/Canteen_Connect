import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getAllOrders, updateOrderStatus, getMenu } from "../api/client";
import { useAuthStore } from "../state/store";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import OrderStatusBadge from "../components/OrderStatusBadge";
import Bill from "../components/Bill";
import SideNav from "../components/SideNav";
import { useOrderTimer } from "../hooks/useOrderTimer";
import {
  Trash2, Eye, Package, IndianRupee, UtensilsCrossed, Plus, User, Clock,
  TrendingUp, AlertCircle, ChefHat, Search
} from "lucide-react";

const STATUS_OPTIONS = ["placed", "preparing", "ready", "cancelled"];
const ACTIVE_STATUSES = ["placed", "preparing", "ready"];
const CATEGORIES = ["Beverages", "Snacks", "Meals", "Desserts", "Combos"];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: CATEGORIES[0] });
  const [selectedBill, setSelectedBill] = useState(null);
  const [menuFilter, setMenuFilter] = useState("All");

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  useEffect(() => {
    let m = true;
    const load = async () => {
      try {
        setLoading(true);
        const [o, me] = await Promise.all([getAllOrders(), getMenu()]);
        if (m) { setOrders(o || []); setMenu(me || []); }
      } catch {} finally { if (m) setLoading(false); }
    };
    load();
    const i = setInterval(load, 30000);
    return () => { m = false; clearInterval(i); };
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders(p => p.map(o => o.id === id ? updated : o));
    } catch { alert("Failed to update status"); }
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || Number(newItem.price) <= 0) return alert("Fill in all fields.");
    try {
      const { data, error } = await supabase.from("menu").insert({ ...newItem, price: Number(newItem.price), available: true }).select().single();
      if (error) throw error;
      setMenu(p => [...p, data]);
      setNewItem({ name: "", price: "", category: CATEGORIES[0] });
    } catch { alert("Failed to add item."); }
  };

  const toggleAvailability = async (id, available) => {
    try {
      const { data, error } = await supabase.from("menu").update({ available }).eq("id", id).select().single();
      if (error) throw error;
      setMenu(p => p.map(i => i.id === id ? data : i));
    } catch { alert("Toggle failed."); }
  };

  const deleteMenuItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try { await supabase.from("menu").delete().eq("id", id); setMenu(p => p.filter(i => i.id !== id)); }
    catch { alert("Delete failed."); }
  };

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
  const archivedOrders = orders.filter(o => !ACTIVE_STATUSES.includes(o.status));
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(o => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  // Menu filtering
  const menuCategories = ["All", ...new Set(menu.map(m => m.category).filter(Boolean))];
  const filteredMenu = menuFilter === "All" ? menu : menu.filter(m => m.category === menuFilter);
  const availableCount = menu.filter(m => m.available).length;

  const OrderRow = ({ order }) => {
    const { formattedTime, isExpired } = useOrderTimer(order, handleStatusChange);
    return (
      <div className="card-neu-sm p-4 sm:p-5 group hover:shadow-neu hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs shrink-0">
              <User className="w-4 h-4 text-teal" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-charcoal truncate">{order.customer_name}</span>
                <span className="font-mono text-[11px] text-charcoal-40 bg-cream px-1.5 py-0.5 rounded">#{order.id.slice(0,6)}</span>
                {order.order_code && (
                  <span className="font-mono text-[11px] text-teal font-bold">
                    {order.order_code}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display font-bold text-teal text-sm">₹{order.total}</span>
                <span className="text-[11px] text-charcoal-40">
                  {new Date(order.created_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <span className={`font-mono text-[11px] flex items-center gap-1 ${isExpired ? 'text-rose font-bold' : 'text-charcoal-40'}`}>
                    <Clock className="w-3 h-3" />
                    {isExpired ? 'Expired!' : formattedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setSelectedBill(order)}
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-neu-xs text-charcoal-40 hover:text-teal hover:shadow-neu-sm transition-all"
              title="View receipt"
            >
              <Eye className="w-4 h-4" />
            </button>
            <OrderStatusBadge status={order.status} />
            <select
              value={order.status}
              onChange={e => handleStatusChange(order.id, e.target.value)}
              className="select-neu text-xs py-1.5 px-2.5"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SideNav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-display-lg text-charcoal mb-1">Admin Dashboard</h1>
            <p className="text-charcoal-60 text-sm">Manage orders, menu, and track performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="pill-neu text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-soft" />
              Live
            </span>
            <span className="text-[11px] text-charcoal-40">Auto-refreshes every 30s</span>
          </div>
        </div>

        {/* Stats row — 2 rows on mobile, single on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 stagger-children">
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
              <Package className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider">Active</p>
              <p className="text-xl font-bold text-charcoal">{activeOrders.length}</p>
            </div>
          </div>
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-11 h-11 rounded-xl bg-amber-light flex items-center justify-center shadow-neu-xs">
              <TrendingUp className="w-5 h-5 text-amber" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider">Today</p>
              <p className="text-xl font-bold text-charcoal">{todayOrders.length} <span className="text-xs font-normal text-charcoal-40">orders</span></p>
            </div>
          </div>
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-light flex items-center justify-center shadow-neu-xs">
              <IndianRupee className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider">Revenue</p>
              <p className="text-xl font-bold text-charcoal">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-11 h-11 rounded-xl bg-rose-light flex items-center justify-center shadow-neu-xs">
              <IndianRupee className="w-5 h-5 text-rose" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider">Today Rev.</p>
              <p className="text-xl font-bold text-charcoal">₹{todayRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="card-neu-sm flex items-center gap-3 p-4 col-span-2 lg:col-span-1">
            <div className="w-11 h-11 rounded-xl bg-amber-light flex items-center justify-center shadow-neu-xs">
              <ChefHat className="w-5 h-5 text-amber" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider">Menu</p>
              <p className="text-xl font-bold text-charcoal">
                {availableCount}<span className="text-xs font-normal text-charcoal-40">/{menu.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex items-center rounded-xl p-1 shadow-neu-inset mb-8">
          {[
            { key: "orders", label: "Orders", count: activeOrders.length },
            { key: "menu", label: "Menu", count: menu.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === t.key
                  ? "bg-teal text-white shadow-neu-xs"
                  : "text-charcoal-60 hover:text-charcoal"
              }`}
            >
              {t.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === t.key ? "bg-white/20" : "bg-cream"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ══════ ORDERS TAB ══════ */}
        {activeTab === "orders" ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Active orders */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse-soft" />
                  <h2 className="text-xs font-bold text-charcoal-60 uppercase tracking-wider">
                    Active Orders
                  </h2>
                </div>
                <span className="text-[11px] text-charcoal-40">{activeOrders.length} pending</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton-neu h-24 rounded-xl" />)}
                </div>
              ) : activeOrders.length ? (
                <div className="space-y-3 stagger-children">
                  {activeOrders.map(o => <OrderRow key={o.id} order={o} />)}
                </div>
              ) : (
                <div className="card-neu p-10 text-center rounded-xl">
                  <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4 shadow-neu-inset text-2xl">
                    ✅
                  </div>
                  <p className="text-charcoal-60 text-sm font-medium mb-1">All caught up!</p>
                  <p className="text-charcoal-40 text-xs">No active orders right now.</p>
                </div>
              )}
            </div>

            {/* Archived */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-charcoal-40" />
                  <h2 className="text-xs font-bold text-charcoal-40 uppercase tracking-wider">
                    Completed & Cancelled
                  </h2>
                </div>
                <span className="text-[11px] text-charcoal-40">{archivedOrders.length} total</span>
              </div>
              <div className="card-neu p-4">
                {archivedOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-charcoal-40 text-xs">No completed orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[480px] overflow-y-auto">
                    {archivedOrders.slice(0, 15).map(o => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedBill(o)}
                        className="w-full flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-cream/70 transition-colors text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-charcoal truncate group-hover:text-teal transition-colors">{o.customer_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] text-charcoal-40 font-mono">#{o.id.slice(0,6)}</p>
                            <p className="text-[11px] text-charcoal-40">
                              {new Date(o.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="text-sm font-bold text-charcoal tabular-nums">₹{o.total}</span>
                          <OrderStatusBadge status={o.status} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ══════ MENU TAB ══════ */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Add form */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
              <div className="card-neu p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
                    <Plus className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <h3 className="font-display text-display-sm text-charcoal">Add item</h3>
                    <p className="text-[11px] text-charcoal-40">Add a new item to the menu</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2 block">Item Name</label>
                    <input
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                      className="inp-neu"
                      placeholder="e.g. Masala Dosa"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2 block">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40 pointer-events-none" />
                      <input
                        type="number"
                        min="0"
                        value={newItem.price}
                        onChange={e => setNewItem({...newItem, price: e.target.value})}
                        className="inp-neu pl-12"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2 block">Category</label>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                      className="select-neu w-full"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={addMenuItem} className="btn-neu-accent w-full h-11 text-sm mt-1">
                    <Plus className="w-4 h-4" /> Add to menu
                  </button>
                </div>
              </div>

              {/* Quick stats card */}
              <div className="card-neu-sm p-4">
                <h4 className="text-[10px] font-bold text-charcoal-40 uppercase tracking-wider mb-3">Menu Overview</h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-charcoal-60">Total items</span>
                    <span className="font-bold text-charcoal">{menu.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-charcoal-60">Available</span>
                    <span className="font-bold text-emerald">{availableCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-charcoal-60">Unavailable</span>
                    <span className="font-bold text-rose">{menu.length - availableCount}</span>
                  </div>
                  <hr className="rule-neu" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-charcoal-60">Categories</span>
                    <span className="font-bold text-charcoal">{new Set(menu.map(m => m.category).filter(Boolean)).size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-display-sm text-charcoal">Menu items</h3>
                  <span className="pill-neu text-xs">{filteredMenu.length}</span>
                </div>
                {/* Category filter */}
                <div className="flex flex-wrap gap-1.5">
                  {menuCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMenuFilter(cat)}
                      className={`pill-neu cursor-pointer text-[11px] ${menuFilter === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="grid gap-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton-neu h-20 rounded-xl" />)}
                </div>
              ) : filteredMenu.length === 0 ? (
                <div className="card-neu-inset p-10 text-center rounded-xl">
                  <p className="text-charcoal-40 text-sm">No items in this category.</p>
                </div>
              ) : (
                <div className="grid gap-3 stagger-children">
                  {filteredMenu.map(item => (
                    <div key={item.id} className="card-neu-sm p-4 flex items-center gap-4 group hover:shadow-neu transition-shadow duration-300">
                      {/* Item info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-charcoal truncate">{item.name}</p>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${item.available ? 'bg-emerald' : 'bg-rose'}`} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-charcoal-40">
                          <span className="bg-cream px-1.5 py-0.5 rounded text-[11px] font-medium">{item.category}</span>
                          <span>·</span>
                          <span className="font-display font-bold text-charcoal">₹{item.price}</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <button
                        onClick={() => toggleAvailability(item.id, !item.available)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-neu-xs ${
                          item.available
                            ? 'bg-emerald-light text-emerald hover:bg-emerald hover:text-white'
                            : 'bg-rose-light text-rose hover:bg-rose hover:text-white'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-neu-xs text-charcoal-40 hover:text-rose hover:bg-rose-light transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedBill && <Bill bill={selectedBill} onClose={() => setSelectedBill(null)} />}
      </AnimatePresence>
    </div>
  );
}
