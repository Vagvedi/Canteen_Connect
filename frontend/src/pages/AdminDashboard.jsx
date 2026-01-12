import { useState } from "react";
import NavBar from "../components/NavBar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0627] via-[#1a0b3d] to-[#0b021a] text-white">
      
      {/* TOP NAV */}
      <NavBar />

      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <h1 className="text-4xl font-bold">
          Admin <span className="text-purple-400">Dashboard</span>
        </h1>
        <p className="text-gray-300 mt-1">
          Manage menu items and monitor orders
        </p>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-3 mb-6">
          <TabButton
            label="Add Menu Item"
            active={activeTab === "add"}
            onClick={() => setActiveTab("add")}
          />
          <TabButton
            label="Menu Items"
            active={activeTab === "menu"}
            onClick={() => setActiveTab("menu")}
          />
          <TabButton
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
          {activeTab === "add" && <AddMenuPlaceholder />}
          {activeTab === "menu" && <MenuPlaceholder />}
          {activeTab === "orders" && <OrdersPlaceholder />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* --------------------------- SUB COMPONENTS ------------------------ */
/* ------------------------------------------------------------------ */

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl font-semibold transition ${
        active
          ? "bg-purple-600 text-white"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );
}

function AddMenuPlaceholder() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Add Menu Item</h2>
      <p className="text-gray-300">
        Yahan se admin naye food items add karega.
      </p>

      <div className="mt-6 p-4 rounded-xl bg-black/30 text-gray-400 text-sm">
        🚧 Form logic next step me add hoga (price, category, availability).
      </div>
    </div>
  );
}

function MenuPlaceholder() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Menu Items</h2>
      <p className="text-gray-300">
        Existing menu items yahan list honge.
      </p>

      <div className="mt-6 p-4 rounded-xl bg-black/30 text-gray-400 text-sm">
        📦 Supabase se menu fetch + edit yahan aayega.
      </div>
    </div>
  );
}

function OrdersPlaceholder() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Orders</h2>
      <p className="text-gray-300">
        Saare incoming orders aur unka status yahan dikhega.
      </p>

      <div className="mt-6 p-4 rounded-xl bg-black/30 text-gray-400 text-sm">
        🔄 Realtime orders + status update (admin only).
      </div>
    </div>
  );
}
