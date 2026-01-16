// src/pages/Checkout.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkout } from "../api/client";
import { useCartStore } from "../state/cartStore";
import { useAuthStore } from "../state/store";
import { useNavigate } from "react-router-dom";
import Bill from "../components/Bill";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear, removeItem, updateQuantity } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);
  const [showBill, setShowBill] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await checkout(items, user);
      clear();
      setBill(result.order);
      setShowBill(true);
    } catch (err) {
      console.error("Checkout error:", err);
      // Show more detailed error message
      const errorMessage = err?.message || err?.error?.message || "Checkout failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBill = () => {
    setShowBill(false);
    navigate("/dashboard");
  };

  /* -------------------------------------------
     CHECKOUT SCREEN
  -------------------------------------------- */
  return (
    <>
      <motion.div
        className="max-w-4xl mx-auto px-6 py-10 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold gradient-text">
            Checkout
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold"
          >
            ← Back to Menu
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="glass p-4 rounded-xl bg-red-500/20 border border-red-500/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Order Summary
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg mb-4">
                Your cart is empty.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-white/60">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.qty - 1)
                          }
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-white font-semibold w-6 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.qty + 1)
                          }
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold text-white w-20 text-right">
                        ₹{item.price * item.qty}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 text-xl font-bold ml-2"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold gradient-text">
                  ₹{total}
                </span>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition"
            >
              Continue Shopping
            </button>

            <button
              disabled={loading || items.length === 0}
              onClick={handleCheckout}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Bill Modal */}
      <AnimatePresence>
        {showBill && bill && (
          <Bill bill={bill} onClose={handleCloseBill} />
        )}
      </AnimatePresence>
    </>
  );
}
