import { useEffect, useState } from 'react';
import { fetchMenu } from '../api/client';
import MenuCard from '../components/MenuCard';
import CartSidebar from '../components/CartSidebar';
import { useCartStore } from '../state/store';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const { items, addItem, updateQty, removeItem } = useCartStore();

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(menu.map((m) => m.category))];
  const filtered = category === 'all' ? menu : menu.filter((m) => m.category === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-6 rounded-xl shadow-sm space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Menu</p>
          <h1 className="text-3xl font-bold leading-tight">Fresh, fast, and student-priced.</h1>
          <p className="text-gray-600">
            Browse by category, add items quickly, and checkout in a few taps. Everything stays in
            sync with your cart.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="card p-3">
              <p className="text-xs text-gray-500">Categories</p>
              <p className="font-semibold text-primary">{categories.length - 1 || 0}</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-gray-500">Menu items</p>
              <p className="font-semibold text-primary">{menu.length}</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-gray-500">Cart items</p>
              <p className="font-semibold text-primary">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition border ${
                category === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white/80 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} onAdd={addItem} />
            ))}
            {filtered.length === 0 && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">No items in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <CartSidebar items={items} onUpdateQty={updateQty} onRemove={removeItem} />
    </div>
  );
};

export default Menu;

