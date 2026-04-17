import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/store";
import { useCartStore } from "../state/cartStore";
import { checkout } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle, ShoppingBag, Receipt, IndianRupee } from "lucide-react";
import SideNav from "../components/SideNav";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleCheckout = async () => {
    if (!items.length) return;
    setLoading(true); setError("");
    try {
      const result = await checkout(items, user);
      setOrderData(result); setSuccess(true); clearCart();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SideNav />
      <main className="flex-1 max-w-lg w-full mx-auto px-6 py-8">
        {/* Back */}
        <Link to="/dashboard" className="btn-neu-ghost text-sm mb-8 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to menu
        </Link>

        <AnimatePresence mode="wait">
          {success && orderData ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <div className="card-neu p-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-light flex items-center justify-center mx-auto mb-6 shadow-neu">
                  <CheckCircle className="w-8 h-8 text-emerald" />
                </div>
                <h2 className="font-display text-display-md text-charcoal mb-2">Order placed!</h2>
                <p className="text-charcoal-60 text-sm mb-8">Show this code when you pick up your order.</p>

                <div className="card-neu-inset rounded-xl p-6 inline-block mb-8">
                  <p className="text-[10px] text-charcoal-40 uppercase tracking-[0.15em] font-bold mb-1">Order code</p>
                  <p className="font-mono text-3xl font-bold text-charcoal tracking-widest">{orderData.order.order_code}</p>
                </div>

                <div>
                  <button onClick={() => navigate("/orders")} className="btn-neu-accent h-11 px-8 text-sm">
                    View orders
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
                  <Receipt className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h1 className="font-display text-display-lg text-charcoal">Checkout</h1>
                  <p className="text-charcoal-60 text-xs">Review your order before placing.</p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 py-3 px-4 rounded-xl bg-rose-light/60 border border-rose/20 mb-5">
                  <span className="text-rose text-sm mt-0.5">⚠</span>
                  <p className="text-rose text-sm font-medium">{error}</p>
                </div>
              )}

              {items.length === 0 ? (
                <div className="card-neu p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4 shadow-neu-inset text-3xl">
                    🛒
                  </div>
                  <p className="text-charcoal-60 text-sm font-medium mb-3">Your cart is empty.</p>
                  <button onClick={() => navigate("/dashboard")} className="btn-neu text-sm">Browse menu</button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Items — receipt style */}
                  <div className="card-neu p-5">
                    <h3 className="text-[10px] font-bold text-charcoal-40 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Order summary · {items.length} {items.length === 1 ? 'item' : 'items'}
                    </h3>

                    {/* Table header */}
                    <div className="flex text-[10px] uppercase tracking-wider font-bold text-charcoal-40 pb-2 border-b border-cream-dark/40">
                      <span className="flex-1">Item</span>
                      <span className="w-12 text-center">Qty</span>
                      <span className="w-16 text-right">Amount</span>
                    </div>

                    <div className="py-1">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center py-2.5 border-b border-cream-dark/20 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-charcoal truncate">{item.name}</p>
                            <p className="text-[11px] text-charcoal-40 mt-0.5">₹{item.price} each</p>
                          </div>
                          <span className="w-12 text-center text-sm text-charcoal-60 font-mono">{item.qty}</span>
                          <span className="w-16 text-right font-display font-bold text-charcoal tabular-nums">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total — inset panel */}
                  <div className="card-neu-inset p-5 rounded-xl">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="text-charcoal-60">Subtotal</span>
                      <span className="text-charcoal font-mono tabular-nums">₹{total}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-charcoal-60">Tax</span>
                      <span className="text-charcoal font-mono tabular-nums">₹0.00</span>
                    </div>
                    <div className="border-t border-charcoal-40/20 pt-2.5 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-charcoal uppercase tracking-wide">Total</span>
                      <span className="font-display text-xl font-bold text-teal tabular-nums">₹{total}</span>
                    </div>
                  </div>

                  {/* Place order */}
                  <button
                    disabled={loading}
                    onClick={handleCheckout}
                    className="btn-neu-accent w-full h-13 text-[15px] py-3.5"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <IndianRupee className="w-4 h-4" />
                        Pay ₹{total} · Place order
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
