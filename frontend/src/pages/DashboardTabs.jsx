import { useState } from "react";
import Menu from "./Menu";
import Orders from "./Orders";

export default function DashboardTabs() {
  const [tab, setTab] = useState("menu");

  return (
    <div className="w-full">
      {/* TOP TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("menu")}
          className={`px-5 py-2 rounded-xl font-semibold transition ${
            tab === "menu"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Menu
        </button>

        <button
          onClick={() => setTab("orders")}
          className={`px-5 py-2 rounded-xl font-semibold transition ${
            tab === "orders"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Orders
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {tab === "menu" && <Menu />}
        {tab === "orders" && <Orders />}
      </div>
    </div>
  );
}
