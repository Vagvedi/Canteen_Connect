// src/pages/Menu.jsx
import { useEffect, useState } from "react";
import MenuCard from "../components/MenuCard";
import { useCartStore } from "../state/cartStore";
import { getMenu } from "../api/client";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let isMounted = true;

    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        if (isMounted) {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        if (isMounted) {
          setError("Failed to load menu items.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="text-white text-lg">
        Loading menu...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-lg">
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-white/70 text-lg">
        No items available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAdd={addItem}
        />
      ))}
    </div>
  );
}
