import OrderStatusBadge from './OrderStatusBadge';

const StaffOrderCard = ({ order, onStatusChange }) => {
  return (
    <div className="card p-4 flex flex-col gap-3 border border-blue-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Order #{order.id.slice(0, 6)}</p>
          <p className="text-xs text-gray-500">Token: {order.tokenNumber}</p>
          <p className="text-xs text-gray-500">Student: {order.customerName}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <ul className="text-sm text-gray-700 space-y-1 bg-gray-50 rounded p-2">
        {order.items.map((i) => (
          <li key={i.menuId} className="flex justify-between">
            <span>
              {i.name || i.menuId} <span className="text-xs text-gray-500">x{i.qty}</span>
            </span>
            <span className="text-gray-600">₹{(i.price || 0) * i.qty}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-primary">₹{order.total}</span>
        <select
          className="border rounded px-2 py-1 bg-white"
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
        >
          <option value="placed">placed</option>
          <option value="preparing">preparing</option>
          <option value="ready">ready</option>
          <option value="completed">completed</option>
        </select>
      </div>
    </div>
  );
};

export default StaffOrderCard;

