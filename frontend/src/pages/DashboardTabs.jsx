import { motion } from "framer-motion";

export default function DashboardTabs({ active, setActive }) {
  const tabs = [
    { id: "orders", label: "Orders" },
    { id: "menu", label: "Menu" },
  ];

  return (
    <div className="flex items-center gap-0 border-b border-warmgray">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`relative pb-3 px-1 mr-6 text-sm font-medium transition-colors ${
            active === tab.id ? "text-ink" : "text-ink-muted hover:text-ink-light"
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <motion.div
              layoutId="adminTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-terra rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
