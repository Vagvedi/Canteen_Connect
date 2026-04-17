import { useCartStore } from "../state/cartStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, X, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartSidebar({ isOpen, onClose }) {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-[2px] z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-50 flex flex-col shadow-neu-deep"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
                  <ShoppingBag className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h2 className="font-display text-display-sm text-charcoal">Cart</h2>
                  {itemCount > 0 && (
                    <p className="text-xs text-charcoal-40 font-medium">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-neu-xs text-charcoal-40 hover:text-charcoal hover:shadow-neu-sm transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="rule-neu mx-6" />

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="card-neu-inset w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mb-5">
                    🛒
                  </div>
                  <p className="text-charcoal-60 text-sm font-medium mb-1">Your cart is empty</p>
                  <p className="text-charcoal-40 text-xs">Add items from the menu to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        className="card-neu-sm p-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-charcoal truncate">{item.name}</p>
                            <p className="text-xs text-charcoal-40 mt-0.5">₹{item.price} each</p>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {/* Qty controls */}
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-neu-xs text-charcoal-60 hover:text-teal active:shadow-neu-inset-sm transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold text-charcoal w-7 text-center tabular-nums">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-neu-xs text-charcoal-60 hover:text-teal active:shadow-neu-inset-sm transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-sm font-bold text-charcoal w-14 text-right tabular-nums">₹{item.price * item.qty}</span>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-charcoal-40 hover:text-rose hover:bg-rose-light transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5">
                <div className="card-neu-inset p-4 rounded-xl flex items-baseline justify-between mb-4">
                  <span className="text-sm font-medium text-charcoal-60">Total</span>
                  <span className="font-display text-2xl font-bold text-charcoal tabular-nums">₹{total}</span>
                </div>
                <button
                  onClick={() => { onClose(); navigate("/checkout"); }}
                  className="btn-neu-accent w-full h-12 text-[15px]"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
