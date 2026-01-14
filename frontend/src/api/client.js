// src/api/client.js
import { supabase } from "../lib/supabase";

/* =========================
   MENU
   Table: public.menu
========================= */

export const getMenu = async () => {
  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Menu fetch error:", error);
    throw error;
  }

  return data;
};

export const fetchMenuItem = async (id) => {
  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Menu item fetch error:", error);
    throw error;
  }

  return data;
};

/* =========================
   ORDERS
   Table: public.orders
========================= */

export const getOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    throw error;
  }

  return data;
};

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("All orders fetch error:", error);
    throw error;
  }

  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Order status update error:", error);
    throw error;
  }

  return data;
};

/* =========================
   CHECKOUT
========================= */

export const checkout = async (items, user) => {
  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: user.name,
      items,
      total,
      status: "placed",
    })
    .select()
    .single();

  if (error) {
    console.error("Checkout error:", error);
    throw error;
  }

  return { order };
};
