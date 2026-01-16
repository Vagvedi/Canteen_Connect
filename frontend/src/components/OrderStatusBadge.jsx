const statusColors = {
  placed: 'bg-gray-500/30 text-gray-200 border-gray-400/50',
  preparing: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50',
  ready: 'bg-green-500/30 text-green-200 border-green-400/50',
  completed: 'bg-blue-500/30 text-blue-200 border-blue-400/50',
  cancelled: 'bg-red-500/30 text-red-200 border-red-400/50',
};

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status] || 'bg-white/10 text-white border-white/20'}`}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

export default OrderStatusBadge;

