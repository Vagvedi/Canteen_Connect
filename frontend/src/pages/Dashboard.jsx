import { useState } from "react";
import NavBar from "../components/NavBar";
import DashboardTabs from "./DashboardTabs";
import Menu from "./Menu";
import Orders from "./Orders";
import CartSidebar from "../components/CartSidebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("menu");

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
