import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../state/store";
import { LogOut, Utensils, Shield } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Role-based navigation
  const studentLinks = [
    { path: "/dashboard", label: "Menu" },
    { path: "/orders", label: "Orders" },
  ];
  const staffLinks = [
    { path: "/dashboard", label: "Menu" },
    { path: "/orders", label: "Orders" },
  ];
  const adminLinks = [
    { path: "/admin", label: "Dashboard" },
  ];

  let links;
  if (user.role === "admin") links = adminLinks;
  else if (user.role === "staff") links = staffLinks;
  else links = studentLinks;

  const initials = (user.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  // Role badge color
  const roleBadge = {
    admin:   { bg: "bg-rose-light", text: "text-rose", label: "Admin" },
    staff:   { bg: "bg-amber-light", text: "text-amber", label: "Staff" },
    student: { bg: "bg-teal-light", text: "text-teal", label: "Student" },
  }[user.role] || { bg: "bg-teal-light", text: "text-teal", label: "User" };

  return (
    <nav className="sticky top-0 z-40 nav-neu">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-neu-xs">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-charcoal tracking-tight">
              Canteen<span className="text-teal">Connect</span>
            </span>
          </button>

          {/* Separator */}
          <div className="hidden sm:block w-px h-7 bg-cream-dark mx-1" />

          {/* Greeting */}
          <span className="hidden sm:block text-xs text-charcoal-40 font-medium">
            {getGreeting()}, {user.name?.split(" ")[0] || "there"}
          </span>
        </div>

        {/* Center links */}
        <div className="flex items-center gap-2">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-teal text-white shadow-neu-xs"
                  : "text-charcoal-60 hover:bg-surface hover:shadow-neu-xs"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* User area */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span className={`hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${roleBadge.bg} ${roleBadge.text}`}>
            {roleBadge.label}
          </span>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center shadow-neu-xs">
            <span className="text-xs font-bold text-teal-dark">{initials}</span>
          </div>
          <span className="text-sm font-medium text-charcoal hidden md:inline">
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal-40 hover:text-rose hover:bg-rose-light transition-all duration-200 shadow-neu-xs"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
