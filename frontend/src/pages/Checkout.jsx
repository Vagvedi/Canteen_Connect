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
  const { items, total, clear } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);

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
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
     AFTER SUCCESS (BILL VIEW)
  -------------------------------------------- */
  if (bill) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <Bill bill={bill} />

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------
     CHECKOUT SCREEN
  -------------------------------------------- */
  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-10 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-bold gradient-text">
        Checkout
      </h1>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="glass p-6 rounded-2xl space-y-4">
        {items.length === 0 ? (
          <p className="text-white/70">
            Your cart is empty.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>
                ₹{item.price * item.qty}
              </span>
            </div>
          ))
        )}

        <div className="pt-4 border-t border-white/20 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/menu")}
          className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white"
        >
          Cancel
        </button>

        <button
          disabled={loading || items.length === 0}
          onClick={handleCheckout}
          className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </motion.div>
  );
}
