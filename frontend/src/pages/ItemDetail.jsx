// src/pages/ItemDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMenuItem } from "../api/client";
import { useCartStore } from "../state/cartStore";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let isMounted = true;

    const loadItem = async () => {
      try {
        const data = await fetchMenuItem(id);
        if (isMounted) {
          setItem(data);
        }
      } catch (err) {
        console.error("Item fetch error:", err);
        if (isMounted) {
          setError("Item not found.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-6 space-y-3">
        <p className="text-sm uppercase text-gray-400">
          {item.category}
        </p>

        <h1 className="text-2xl font-bold">
          {item.name}
        </h1>

        {item.description && (
          <p className="text-gray-600">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-xl font-semibold text-primary">
            ₹{item.price}
          </span>

          <button
            onClick={() => addItem(item)}
            disabled={!item.available}
            className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
          >
            {item.available ? "Add to cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
