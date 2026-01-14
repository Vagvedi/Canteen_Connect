// src/components/NavBar.jsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/store";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* LEFT */}
      <h1 className="text-2xl font-bold text-white">
        Canteen{" "}
        <span className="text-purple-400">
          Connect
        </span>
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            {user.name}
          </p>
          <p className="text-xs uppercase text-purple-300 tracking-wider">
            {user.role}
          </p>
        </div>

        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 font-bold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
