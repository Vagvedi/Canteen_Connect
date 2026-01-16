import { useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import DashboardTabs from "./DashboardTabs";
import Menu from "./Menu";
import Orders from "./Orders";
import CartSidebar from "../components/CartSidebar";
import { useAuthStore } from "../state/store";

export default function Dashboard() {
  const { user, initialized } = useAuthStore();
  const [activeTab, setActiveTab] = useState("menu");

  // Wait for auth to initialize
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin to admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen relative">
      <NavBar />

      <div className="flex">
        <div className="flex-1 px-8 py-6">
          <DashboardTabs active={activeTab} setActive={setActiveTab} />

          {activeTab === "menu" && <Menu />}
          {activeTab === "orders" && <Orders />}
        </div>

        <CartSidebar />
      </div>
    </div>
  );
}
