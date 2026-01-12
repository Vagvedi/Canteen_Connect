import NavBar from "../components/NavBar";
import DashboardTabs from "./DashboardTabs";
import { useAuthStore } from "../state/store";

export default function Dashboard() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0627] via-[#1a0b3d] to-[#0b021a]">
      
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-gray-300 mt-1">
          Welcome, {profile.name} ({profile.role})
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-10">
        <DashboardTabs />
      </div>
    </div>
  );
}
