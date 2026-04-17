import { Plus, Clock, Star } from "lucide-react";

const CATEGORY_EMOJI = {
  Beverages: "🥤",
  Snacks: "🍿",
  Meals: "🍱",
  Desserts: "🍰",
  Combos: "🍔",
};

export default function MenuCard({ item, onAdd, featured = false }) {
  const isAvailable = item.available;
  const emoji = CATEGORY_EMOJI[item.category] || "🍽️";

  // ── Featured card ──────────────────────
  if (featured) {
    return (
      <div className={`card-neu relative overflow-hidden p-6 md:p-8 border-l-4 border-teal ${!isAvailable ? 'opacity-50' : ''}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 pill-neu active mb-5">
          <Star className="w-3 h-3" /> Today's Pick
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs text-xl">
                {emoji}
              </div>
              <div>
                <h3 className="font-display text-display-md text-charcoal group-hover:text-teal transition-colors">
                  {item.name}
                </h3>
                <span className="pill-neu text-[11px] mt-1">{item.category}</span>
              </div>
            </div>
            <p className="text-charcoal-60 text-sm leading-relaxed ml-0 md:ml-15">
              {item.description || "A popular choice — freshly prepared."}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-display text-3xl font-bold text-charcoal">₹{item.price}</span>
            <button
              disabled={!isAvailable}
              onClick={() => onAdd(item)}
              className="btn-neu-accent h-11 px-6 text-sm"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {!isAvailable && (
          <div className="absolute top-4 right-4">
            <span className="badge-neu cancelled">Sold Out</span>
          </div>
        )}
      </div>
    );
  }

  // ── Standard card ──────────────────────
  return (
    <div
      className={`card-neu-sm group cursor-pointer hover:shadow-neu hover:-translate-y-0.5 transition-all duration-300 ${
        !isAvailable ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Emoji icon */}
        <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center shadow-neu-inset-sm text-lg shrink-0">
          {emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-charcoal group-hover:text-teal transition-colors truncate">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-charcoal-40 bg-cream px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                {item.preparationTime && (
                  <span className="text-[11px] text-charcoal-40 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {item.preparationTime}m
                  </span>
                )}
              </div>
            </div>
            <span className="font-display text-lg font-bold text-charcoal shrink-0">₹{item.price}</span>
          </div>

          {item.description && (
            <p className="text-sm text-charcoal-60 line-clamp-2 leading-relaxed mt-1.5">{item.description}</p>
          )}

          {!isAvailable && (
            <span className="inline-block mt-1.5 text-xs font-semibold text-rose bg-rose-light px-2 py-0.5 rounded-md">
              Sold out
            </span>
          )}
        </div>

        {/* Add button */}
        <button
          disabled={!isAvailable}
          onClick={(e) => { e.stopPropagation(); onAdd(item); }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
            isAvailable
              ? "shadow-neu-xs text-teal hover:bg-teal hover:text-white hover:shadow-neu-sm active:shadow-neu-inset-sm"
              : "bg-cream text-charcoal-40 cursor-not-allowed"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
