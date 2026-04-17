import { useEffect, useState } from "react";
import MenuCard from "../components/MenuCard";
import { useCartStore } from "../state/cartStore";
import { getMenu } from "../api/client";
import { Loader2, Search } from "lucide-react";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        if (isMounted) setItems((data || []).filter(i => i.available === true));
      } catch (err) {
        if (isMounted) setError("Couldn't load the menu.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMenu();
    return () => { isMounted = false; };
  }, []);

  // Loading state — skeleton cards
  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-neu h-32 rounded-xl" />
      ))}
    </div>
  );

  if (error) return (
    <div className="card-neu-inset p-8 text-center rounded-xl">
      <p className="text-rose text-sm font-medium">{error}</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="card-neu p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4 shadow-neu-inset text-3xl">
        🍽️
      </div>
      <p className="text-charcoal-60 text-sm font-medium mb-1">The menu is empty right now</p>
      <p className="text-charcoal-40 text-xs">Check back soon for fresh items.</p>
    </div>
  );

  // Group by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  const categories = ["All", ...Object.keys(grouped)];

  // Filter
  const filteredItems = activeCategory === "All" ? items : (grouped[activeCategory] || []);

  return (
    <div className="space-y-8">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pill-neu cursor-pointer ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
            {cat !== "All" && (
              <span className="text-[10px] opacity-70">({grouped[cat]?.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Featured item */}
      {activeCategory === "All" && items.length > 0 && (
        <MenuCard item={items[0]} onAdd={addItem} featured />
      )}

      {/* Items grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {(activeCategory === "All" ? items.slice(1) : filteredItems).map(item => (
          <MenuCard key={item.id} item={item} onAdd={addItem} />
        ))}
      </div>
    </div>
  );
}
