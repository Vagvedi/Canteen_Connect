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

/* -------------------------------------------
   CLICKABLE ORDER CARD
-------------------------------------------- */
const ClickableOrderCard = ({ order, canEdit, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      onClick={() => setExpanded((p) => !p)}
      className="glass p-5 rounded-xl cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* SUMMARY */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/60">
            Order #{order.id.slice(0, 6)}
          </p>
          <p className="text-lg font-bold">
            ₹{order.total}
          </p>
          <p className="text-sm text-white/70">
            {order.items?.length || 0} item(s)
          </p>
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

            {canEdit && (
              <div className="pt-3">
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="w-full bg-white text-black rounded px-3 py-2"
                >
                  <option value="placed">Placed</option>
                  <option value="preparing">
                    Preparing
                  </option>
                  <option value="ready">Ready</option>
                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            )}
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

    return () => {
      active = false;
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

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <ClickableOrderCard
            key={order.id}
            order={order}
            canEdit={
              user.role === "admin" ||
              user.role === "staff"
            }
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
