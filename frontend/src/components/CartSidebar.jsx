import { useCartStore } from "../state/cartStore";

export default function CartSidebar() {
  const { items, total } = useCartStore();

  return (
    <div className="w-72 glass p-4 h-fit mt-6 mr-6">
      <h3 className="font-bold text-lg mb-4">🛒 Your Cart</h3>

      {items.length === 0 ? (
        <p className="text-sm text-white/70">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm mb-2"
            >
              <span>{item.name} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-3 opacity-30" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </>
      )}
    </div>
  );
}
