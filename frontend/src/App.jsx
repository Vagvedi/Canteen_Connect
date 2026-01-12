import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import ItemDetail from "./pages/ItemDetail";

import { useAuthStore } from "./state/store";

export default function App() {
  const { user, profile, initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        {!user && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* ---------------- LOGGED IN BUT PROFILE LOADING ---------------- */}
        {user && !profile && (
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-white">
                Loading profile...
              </div>
            }
          />
        )}

        {/* ---------------- ADMIN ROUTES ---------------- */}
        {user && profile?.role === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}

        {/* ---------------- STUDENT / STAFF ROUTES ---------------- */}
        {user &&
          (profile?.role === "student" || profile?.role === "staff") && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<ItemDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
      </Routes>
    </BrowserRouter>
  );
}
