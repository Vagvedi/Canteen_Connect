export default function DashboardTabs({ active, setActive }) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => setActive("menu")}
        className={`px-4 py-2 rounded-lg font-semibold ${
          active === "menu"
            ? "bg-purple-600 text-white"
            : "bg-white/10 text-white"
        }`}
      >
        Menu
      </button>

      <button
        onClick={() => setActive("orders")}
        className={`px-4 py-2 rounded-lg font-semibold ${
          active === "orders"
            ? "bg-purple-600 text-white"
            : "bg-white/10 text-white"
        }`}
      >
        Orders
      </button>
    </div>
  );
}
