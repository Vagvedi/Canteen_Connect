import { useEffect, useState } from "react";
import { getAllOrders } from "../api/client";
import { useAuthStore } from "../state/store";
import Bill from "../components/Bill";
import { AnimatePresence } from "framer-motion";
import { Loader2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import SideNav from "../components/SideNav";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const data = await getAllOrders();
        if (m) setOrders(data.filter(o => o.user_id === user.id));
      } catch { if (m) setError("Couldn't load orders."); }
      finally { if (m) setLoading(false); }
    })();
    return () => { m = false; };
  }, [user.id]);

  const active = orders.filter(o => ["placed","preparing","ready"].includes(o.status));
  const past = orders.filter(o => ["completed","cancelled"].includes(o.status));

  const statusConfig = {
    placed:    { icon: Clock,       bg: "bg-teal-light",    iconColor: "text-teal" },
    preparing: { icon: Package,     bg: "bg-amber-light",   iconColor: "text-amber" },
    ready:     { icon: CheckCircle, bg: "bg-emerald-light", iconColor: "text-emerald" },
    completed: { icon: CheckCircle, bg: "bg-surface",       iconColor: "text-charcoal-40" },
    cancelled: { icon: XCircle,     bg: "bg-rose-light",    iconColor: "text-rose" },
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SideNav />
      <div className="flex-1 flex items-center justify-center">
        <div className="card-neu w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-soft">
          <Loader2 className="w-5 h-5 animate-spin text-teal" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SideNav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-display-lg text-charcoal mb-1">Orders</h1>
            <p className="text-charcoal-60 text-sm">Your order history and current status.</p>
          </div>

          {/* Stats pills */}
          <div className="flex gap-3">
            <div className="pill-neu">
              <span className="w-2 h-2 rounded-full bg-teal" />
              {active.length} active
            </div>
            <div className="pill-neu">
              <span className="w-2 h-2 rounded-full bg-charcoal-40" />
              {past.length} past
            </div>
          </div>
        </div>

        {error && (
          <div className="card-neu-inset py-3 px-4 rounded-xl bg-rose-light/50 mb-6">
            <p className="text-rose text-sm font-medium">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card-neu p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-6 shadow-neu-inset text-4xl">
              📦
            </div>
            <p className="text-charcoal-60 text-sm font-medium mb-1">No orders yet</p>
            <p className="text-charcoal-40 text-xs">Your orders will appear here once you place one.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {[{ label: "Active orders", list: active, dotColor: "bg-teal" }, { label: "Past orders", list: past, dotColor: "bg-charcoal-40" }]
              .filter(s => s.list.length > 0)
              .map(section => (
                <section key={section.label}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className={`w-2.5 h-2.5 rounded-full ${section.dotColor} ${section.label === "Active orders" ? "animate-pulse-soft" : ""}`} />
                    <h2 className="text-xs font-bold text-charcoal-60 uppercase tracking-wider">{section.label} · {section.list.length}</h2>
                  </div>

                  <div className="grid gap-4 stagger-children">
                    {section.list.map(order => {
                      const config = statusConfig[order.status] || statusConfig.placed;
                      const StatusIcon = config.icon;
                      return (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="card-neu-sm p-5 w-full text-left group hover:shadow-neu hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center shrink-0 shadow-neu-xs`}>
                              <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-bold text-charcoal truncate group-hover:text-teal transition-colors">
                                  {order.order_code ? `#${order.order_code}` : `#${order.id.slice(0,8)}`}
                                </p>
                                <span className={`badge-neu ${order.status}`}>{order.status}</span>
                              </div>
                              <p className="text-xs text-charcoal-40">
                                {new Date(order.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                              </p>
                            </div>
                            <span className="font-display text-lg font-bold text-charcoal tabular-nums shrink-0">₹{order.total}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
          </div>
        )}

        <AnimatePresence>
          {selectedOrder && <Bill bill={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
