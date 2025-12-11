import { useState } from 'react';
import { checkout } from '../api/client';
import { useCartStore, useAuthStore } from '../state/store';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, clear } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user || !token) {
      setMessage('Please login as student to checkout.');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await checkout(items.map(({ menuId, qty }) => ({ menuId, qty })));
      clear();
      setMessage('Order placed! Check Orders page for status.');
      navigate('/orders');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.qty, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {message && <div className="p-3 bg-yellow-50 border border-yellow-200">{message}</div>}
      <div className="card p-4 space-y-3">
        <h2 className="font-semibold">Order Summary</h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items in cart.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.menuId} className="flex justify-between">
                <span>
                  {item.menuItem.name} x {item.qty}
                </span>
                <span>₹{item.menuItem.price * item.qty}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={items.length === 0 || loading}
        >
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

