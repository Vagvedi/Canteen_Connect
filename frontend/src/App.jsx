// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./state/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";

function getRedirect(user) {
  if (!user) return "/home";
  if (user.role === "admin") return "/admin";
  return "/dashboard"; // both student and staff
}

export default function App() {
  const { initialize, initialized, user } = useAuthStore();

  useEffect(() => { initialize(); }, [initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-5">
          <div className="card-neu w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-soft">
            <span className="text-2xl">🍽️</span>
          </div>
          <span className="font-display text-lg font-bold text-charcoal tracking-tight">
            Canteen<span className="text-teal">Connect</span>
          </span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse-soft" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="relative z-10 w-full min-h-screen bg-cream">
        <Routes>
          <Route path="/" element={<Navigate to={getRedirect(user)} replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Dashboard — accessible by students and staff */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          {/* Admin — only for admin role */}
          <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
