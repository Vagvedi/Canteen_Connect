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

// Generate a 5-character random code
const generateOrderCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const checkout = async (items, user) => {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const orderCode = generateOrderCode();

  // Calculate expiration time (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Prepare order data with all fields
  const orderData = {
    user_id: user.id,
    customer_name: user.name || "Guest",
    items: items,
    total: total,
    status: "placed",
    order_code: orderCode, // Always include order_code
    register_number: user.register_number || null, // Always include register_number (null for staff)
    expires_at: expiresAt.toISOString(), // 1 hour expiration
  };

  const { data: order, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error("Checkout error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    // If the error is about missing columns, provide helpful message
    if (
      error.message &&
      (error.message.includes("column") ||
        error.message.includes("does not exist") ||
        error.code === "42703" ||
        error.code === "42P01")
    ) {
      const errorMsg = `Database schema error: The orders table is missing required columns (order_code or register_number). Please run the migration script in Supabase SQL Editor. Error: ${error.message}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // For other errors, throw with a user-friendly message
    const errorMsg = error.message || "Failed to place order. Please try again.";
    throw new Error(errorMsg);
  }

  // Verify that order_code and register_number were saved
  if (!order.order_code) {
    console.warn("order_code was not saved to database, adding client-side");
    order.order_code = orderCode;
  }
  if (order.register_number === undefined && user.register_number) {
    console.warn("register_number was not saved to database, adding client-side");
    order.register_number = user.register_number;
  }

  return { order };
};
