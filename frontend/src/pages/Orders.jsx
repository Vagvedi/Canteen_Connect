// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOrders,
  getAllOrders,
  updateOrderStatus,
} from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useAuthStore } from "../state/store";
import Bill from "../components/Bill";
import { useOrderTimer } from "../hooks/useOrderTimer";

/* -------------------------------------------
   CLICKABLE ORDER CARD
-------------------------------------------- */
const ClickableOrderCard = ({ order, canEdit, onStatusChange, onViewBill }) => {
  const [expanded, setExpanded] = useState(false);
  const { formattedTime, isExpired } = useOrderTimer(order, onStatusChange);

  return (
    <motion.div
      onClick={() => setExpanded((p) => !p)}
      className="glass p-5 rounded-xl cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* SUMMARY */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-white/60">
            {order.order_code ? (
              <span className="font-bold text-purple-300">Code: {order.order_code}</span>
            ) : (
              `Order #${order.id.slice(0, 6)}`
            )}
          </p>
          <p className="text-lg font-bold text-white">
            ₹{order.total}
          </p>
          <p className="text-sm text-white/70">
            {order.items?.length || 0} item(s)
          </p>
          
          {/* Timer Display */}
          {order.expires_at && order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="mt-2">
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                isExpired 
                  ? 'bg-red-500/30 text-red-300' 
                  : 'bg-purple-500/30 text-purple-300'
              }`}>
                <span>⏱️</span>
                <span className="font-mono font-semibold">
                  {isExpired ? 'EXPIRED' : formattedTime}
                </span>
              </div>
            </div>
          )}
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* EXPANDED */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/20 space-y-3"
          >
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewBill(order);
                }}
                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm"
              >
                View Bill
              </button>
              {canEdit && (
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="flex-1 bg-white text-black rounded px-3 py-2"
                >
                  <option value="placed">Placed</option>
                  <option value="preparing">
                    Preparing
                  </option>
                  <option value="ready">Ready</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -------------------------------------------
   ORDERS PAGE
-------------------------------------------- */
export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      try {
        if (!user) return;

        const data =
          user.role === "admin"
            ? await getAllOrders()
            : await getOrders(user.id);

        if (active) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Orders error:", err);
        if (active) {
          setError("Failed to load orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    // Refresh orders every 30 seconds to catch auto-completed orders
    const refreshInterval = setInterval(fetchOrders, 30000);

    return () => {
      active = false;
      clearInterval(refreshInterval);
    };
  }, [user]);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      const updated = await updateOrderStatus(
        orderId,
        status
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updated.id ? updated : o
        )
      );
    } catch (err) {
      console.error(
        "Status update failed:",
        err
      );
    }
  };

  const handleViewBill = (order) => {
    setSelectedBill(order);
    setShowBill(true);
  };

  const handleCloseBill = () => {
    setShowBill(false);
    setSelectedBill(null);
  };

  if (!user) {
    return (
      <p className="text-white">
        Please login to view orders.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-white">
        Loading orders...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-white/70">
        No orders yet.
      </p>
    );
  }

  // Filter orders: show active orders first, then completed
  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Orders
        </h1>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white/80">Active Orders</h2>
            {activeOrders.map((order) => (
              <ClickableOrderCard
                key={order.id}
                order={order}
                canEdit={
                  user.role === "admin" ||
                  user.role === "staff"
                }
                onStatusChange={handleStatusChange}
                onViewBill={handleViewBill}
              />
            ))}
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white/80">Completed Orders</h2>
            {completedOrders.map((order) => (
              <ClickableOrderCard
                key={order.id}
                order={order}
                canEdit={false}
                onStatusChange={handleStatusChange}
                onViewBill={handleViewBill}
              />
            ))}
          </div>
        )}

        {/* Cancelled Orders */}
        {cancelledOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white/80">Cancelled Orders</h2>
            {cancelledOrders.map((order) => (
              <ClickableOrderCard
                key={order.id}
                order={order}
                canEdit={false}
                onStatusChange={handleStatusChange}
                onViewBill={handleViewBill}
              />
            ))}
          </div>
        )}

        {orders.length === 0 && (
          <p className="text-white/70 text-lg">No orders yet.</p>
        )}
      </div>

      {/* Bill Modal */}
      <AnimatePresence>
        {showBill && selectedBill && (
          <Bill bill={selectedBill} onClose={handleCloseBill} />
        )}
      </AnimatePresence>
    </>
  );
}
