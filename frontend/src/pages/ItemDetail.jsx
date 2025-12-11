import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMenuItem } from '../api/client';
import { useCartStore } from '../state/store';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchMenuItem(id)
      .then(setItem)
      .catch(() => setError('Item not found'));
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-6 space-y-3">
        <p className="text-sm uppercase text-gray-400">{item.category}</p>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p className="text-gray-600">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-primary">₹{item.price}</span>
          <button
            onClick={() => addItem(item)}
            className="px-4 py-2 rounded bg-primary text-white"
            disabled={!item.available}
          >
            {item.available ? 'Add to cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

