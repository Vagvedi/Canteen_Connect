export default function MenuCard({ item, onAdd }) {
  return (
    <div className="glass p-5">
      <div className="flex justify-between">
        <div>
          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
            {item.category}
          </span>
          <h3 className="text-lg font-bold mt-2">
            {item.name}
          </h3>
        </div>

        <div className="text-xl font-bold">₹{item.price}</div>
      </div>

      <button
        disabled={!item.available}
        onClick={() => onAdd(item)}
        className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
      >
        {item.available ? "Add to cart 🛒" : "Unavailable"}
      </button>
    </div>
  );
}
