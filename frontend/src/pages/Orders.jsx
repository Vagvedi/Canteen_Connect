import { useEffect, useState } from 'react';
import { getOrders, getAllOrders, updateOrderStatus, getSocket } from '../api/client';
import OrderStatusBadge from '../components/OrderStatusBadge';
import StaffOrderCard from '../components/StaffOrderCard';
import { useAuthStore } from '../state/store';

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = user?.role === 'staff' ? getAllOrders : getOrders;
    fetch()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('order:update', (order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    });
    socket.on('order:new', (order) => setOrders((prev) => [order, ...prev]));
    return () => {
      socket.off('order:update');
      socket.off('order:new');
    };
  }, []);

  const handleStatus = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  if (!user) return <div className="p-4">Login to view orders.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-600">Live updates via sockets.</p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : user.role === 'staff' ? (
        <div className="grid md:grid-cols-2 gap-3">
          {orders.map((order) => (
            <StaffOrderCard key={order.id} order={order} onStatusChange={handleStatus} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(0, 6)} ·{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Token: {order.tokenNumber}</p>
                  <p className="text-sm text-gray-700">Total: ₹{order.total}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                {order.items.map((i) => (
                  <li key={i.menuId} className="flex justify-between">
                    <span>
                      {i.name || i.menuId} <span className="text-xs text-gray-500">x{i.qty}</span>
                    </span>
                    <span>₹{(i.price || 0) * i.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

