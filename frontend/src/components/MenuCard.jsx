import { Link } from 'react-router-dom';

const MenuCard = ({ item, onAdd }) => {
  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-primary">
            {item.category}
          </span>
          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <div className="text-right">
          <span className="font-semibold text-primary text-lg">₹{item.price}</span>
          <div className="text-xs text-gray-500">
            {item.available ? 'Available' : 'Unavailable'}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Link to={`/menu/${item.id}`} className="text-primary text-sm font-semibold hover:underline">
          Details
        </Link>
        <button
          onClick={() => onAdd(item)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!item.available}
        >
          {item.available ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;

