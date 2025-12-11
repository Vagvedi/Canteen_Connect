import { Link } from 'react-router-dom';

const CartSidebar = ({ items, onUpdateQty, onRemove }) => {
  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.qty, 0);
  return (
    <aside className="card p-4 sticky top-20 max-h-[80vh] overflow-y-auto">
      <h3 className="font-semibold mb-2">Your Cart</h3>
      {items.length === 0 && <p className="text-sm text-gray-500">Cart is empty</p>}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.menuId} className="border rounded p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.menuItem.name}</p>
                <p className="text-xs text-gray-500">₹{item.menuItem.price} each</p>
              </div>
              <button
                className="text-xs text-red-500"
                onClick={() => onRemove(item.menuId)}
              >
                Remove
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">Qty</span>
              <input
                type="number"
                className="border rounded px-2 py-1 w-16"
                value={item.qty}
                onChange={(e) => onUpdateQty(item.menuId, Number(e.target.value))}
                min={1}
              />
              <span className="ml-auto font-semibold">
                ₹{item.menuItem.price * item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold">₹{total}</span>
      </div>
      <Link
        to="/checkout"
        className="mt-3 block text-center bg-primary text-white rounded py-2 hover:bg-blue-600"
      >
        Checkout
      </Link>
    </aside>
  );
};

export default CartSidebar;

