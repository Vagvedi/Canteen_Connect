import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, ShoppingBag, UtensilsCrossed, ClipboardList, ShoppingCart } from "lucide-react";
import SideNav from "../components/SideNav";
import Menu from "./Menu";
import CartSidebar from "../components/CartSidebar";
import { useAuthStore } from "../state/store";
import { useCartStore } from "../state/cartStore";

export default function Dashboard() {
  const { user, initialized } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (!initialized) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="card-neu w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-soft">
        <Loader2 className="w-5 h-5 animate-spin text-teal" />
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  // Both students and staff use this dashboard
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SideNav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-display-lg text-charcoal mb-2">Menu</h1>
          <p className="text-charcoal-60 text-sm">What would you like today?</p>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 stagger-children">
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
              <UtensilsCrossed className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="text-xs text-charcoal-40 font-medium">Browse</p>
              <p className="text-sm font-bold text-charcoal">Fresh items</p>
            </div>
          </div>
          <div className="card-neu-sm flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center shadow-neu-xs">
              <ClipboardList className="w-5 h-5 text-amber" />
            </div>
            <div>
              <p className="text-xs text-charcoal-40 font-medium">Orders</p>
              <p className="text-sm font-bold text-charcoal">Track status</p>
            </div>
          </div>
          <div className="hidden sm:flex card-neu-sm items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-light flex items-center justify-center shadow-neu-xs">
              <ShoppingCart className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <p className="text-xs text-charcoal-40 font-medium">Cart</p>
              <p className="text-sm font-bold text-charcoal">{itemCount} items</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <Menu />
      </main>

      {/* Floating cart button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 btn-neu-accent h-14 px-6 rounded-2xl text-sm shadow-neu-deep hover:shadow-neu-hover transition-all"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 ? (
          <span>{itemCount} items · ₹{cartTotal}</span>
        ) : (
          <span>Cart</span>
        )}
      </button>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
