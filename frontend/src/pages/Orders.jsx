import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrders, getAllOrders, updateOrderStatus, getSocket } from '../api/client';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { useAuthStore } from '../state/store';

// Clickable Order Card Component with Timer
const ClickableOrderCard = ({ order, onStatusChange, canEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!order.bill?.expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(order.bill.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.bill?.expiresAt]);

  const formatTime = (time) => {
    if (!time) return '00:00:00';
    const { hours, minutes, seconds } = time;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="glass p-5 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
      onClick={handleToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Summary View - Always visible */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">
              Order #{order.id.slice(0, 6)} · {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.bill?.billNumber && (
              <p className="text-sm font-semibold text-primary-600 mb-1">
                Bill: <span className="font-bold">{order.bill.billNumber}</span>
              </p>
            )}
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Token: <span className="text-primary-600">{order.tokenNumber}</span>
            </p>
            <p className="text-lg font-bold text-gray-800">Total: ₹{order.total}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <OrderStatusBadge status={order.status} />
            {order.bill && !isExpired && timeRemaining && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 rounded-full">
                <span className="text-xs">⏱️</span>
                <span className="font-mono font-bold text-primary-700 text-xs">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            {order.bill && isExpired && (
              <span className="text-xs text-red-600 font-semibold">EXPIRED</span>
            )}
          </div>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {order.items?.length || 0} item(s) · {isExpanded ? 'Click to collapse' : 'Click to view details'}
          </p>
        </div>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t-2 border-gray-200 space-y-3"
          >
            {order.bill && (
              <div className="bg-primary-50 p-3 rounded-lg mb-3">
                <div className="text-center mb-2">
                  <p className="text-2xl font-bold gradient-text">{order.bill.billNumber}</p>
                  {isExpired && (
                    <p className="text-red-600 font-semibold text-sm mt-1">EXPIRED</p>
                  )}
                </div>
                {!isExpired && timeRemaining && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full">
                      <span>⏱️</span>
                      <span className="font-mono font-bold text-primary-700">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                )}
                {order.bill.registerNumber && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Reg. No: <span className="font-semibold">{order.bill.registerNumber}</span>
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token Number:</span>
                <span className="font-semibold">{order.tokenNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {order.bill?.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bill Expires:</span>
                  <span className="font-semibold">
                    {new Date(order.bill.expiresAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-bold text-gray-700 mb-2">Items:</h4>
              <ul className="space-y-2">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-500">x {item.qty}</span>
                    </span>
                    <span className="font-semibold">₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold gradient-text">₹{order.total}</span>
              </div>
            </div>
            {canEdit && (
              <div className="pt-3 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="placed">Placed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only admin can see all orders, students and staff see only their own
    const fetch = user?.role === 'admin' ? getAllOrders : getOrders;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (!user) {
    return (
      <motion.div 
        className="p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-600 text-lg">Login to view orders.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold gradient-text mb-2">Orders</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live updates via sockets
        </p>
      </motion.div>
      
      {loading ? (
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </motion.div>
      ) : orders.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            📦
          </motion.div>
          <p className="text-gray-500 text-lg font-medium">No orders yet.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ClickableOrderCard 
                  order={order} 
                  onStatusChange={user.role === 'admin' ? handleStatus : null}
                  canEdit={user.role === 'admin' || user.role === 'staff'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Orders;

