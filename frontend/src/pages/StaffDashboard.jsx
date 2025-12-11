import { useEffect, useState } from 'react';
import { fetchMenu, updateOrderStatus, getAllOrders } from '../api/client';
import StaffOrderCard from '../components/StaffOrderCard';
import { useAuthStore } from '../state/store';

const StaffDashboard = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    getAllOrders().then(setOrders);
    fetchMenu().then(setMenu);
  }, []);

  if (!user || user.role !== 'staff') {
    return <div className="p-4">Staff login required.</div>;
  }

  const handleStatus = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="glass p-5 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Staff Dashboard</h1>
        <p className="text-sm text-gray-600">
          See all incoming orders with student names, tokens, and items. Menu is visible for quick
          reference.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Orders</h2>
          <span className="text-sm text-gray-500">Live updates enabled</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <StaffOrderCard key={order.id} order={order} onStatusChange={handleStatus} />
          ))}
        </div>
        {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Menu (read-only)</h2>
          <span className="text-sm text-gray-500">Reference for pricing & availability</span>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {menu.map((item) => (
            <div key={item.id} className="card p-3">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-gray-500">{item.category}</p>
              <p className="text-sm font-semibold text-primary">₹{item.price}</p>
              {!item.available && (
                <span className="text-xs text-red-500 font-medium">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StaffDashboard;

