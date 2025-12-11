const statusColors = {
  placed: 'bg-gray-200 text-gray-700',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
};

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status] || ''}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;

