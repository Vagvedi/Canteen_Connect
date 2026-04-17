import CartSidebar from '../components/CartSidebar';
import { useCartStore } from '../state/store';

const Cart = () => {
  const { items, updateQty, removeItem } = useCartStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <CartSidebar items={items} onUpdateQty={updateQty} onRemove={removeItem} />
    </div>
  );
};

export default Cart;

