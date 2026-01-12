import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/store";

export default function NavBar() {
  const navigate = useNavigate();

  const { user, profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-xl border-b border-white/10">
      
      {/* LEFT */}
      <Link to="/" className="text-xl font-bold text-white">
        Canteen <span className="text-purple-400">Connect</span>
      </Link>

      {/* RIGHT */}
      {user && profile && (
        <div className="flex items-center gap-4 text-white">

          <span className="text-sm text-white/80">
            {profile.name} ({profile.role})
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
