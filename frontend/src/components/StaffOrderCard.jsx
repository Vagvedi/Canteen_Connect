import OrderStatusBadge from './OrderStatusBadge';
import { Eye, User } from 'lucide-react';

const StaffOrderCard = ({ order, onStatusChange }) => (
  <div className="card-neu-sm p-5 group hover:shadow-neu hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shadow-neu-xs">
          <User className="w-4 h-4 text-teal" />
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">Order #{order.id.slice(0, 6)}</p>
          <p className="text-xs text-charcoal-40 mt-0.5">{order.customerName} · Token: {order.tokenNumber}</p>
        </div>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>

    {/* Items */}
    <div className="card-neu-inset rounded-lg p-3 space-y-1.5 mb-3">
      {order.items.map(i => (
        <div key={i.menuId} className="flex justify-between text-sm">
          <span className="text-charcoal">
            {i.name || i.menuId}
            <span className="text-charcoal-40 font-mono text-xs ml-1">×{i.qty}</span>
          </span>
          <span className="text-charcoal font-semibold tabular-nums">₹{(i.price || 0) * i.qty}</span>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <span className="font-display font-bold text-teal text-base">₹{order.total}</span>
      <div className="flex items-center gap-2">
        <p className="text-[11px] text-charcoal-40">
          {new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </p>
        <select
          className="select-neu text-xs py-1.5 px-2"
          value={order.status}
          onChange={e => onStatusChange(order.id, e.target.value)}
        >
          <option value="placed">Placed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  </div>
);

export default StaffOrderCard;
