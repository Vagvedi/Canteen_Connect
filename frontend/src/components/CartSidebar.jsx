import { useCartStore } from "../state/cartStore";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="w-72 glass p-4 h-fit mt-6 mr-6 sticky top-6">
      <h3 className="font-bold text-lg mb-4 text-white">🛒 Your Cart</h3>

      {items.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-white/70">Your cart is empty</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 p-2 rounded-lg bg-white/5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-white/60">
                      ₹{item.price} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-lg font-bold ml-2"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.qty - 1)
                      }
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-white font-semibold text-sm w-8 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.qty + 1)
                      }
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-white font-bold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-3 opacity-30" />

          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-lg text-white">₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
