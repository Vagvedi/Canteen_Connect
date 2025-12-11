import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../state/store';

const NavBar = () => {
  const { user, logout } = useAuthStore();
  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-white/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-primary tracking-tight">
          Canteen Connect
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <NavLink to="/menu" className="hover:text-primary font-medium">
            Menu
          </NavLink>
          <NavLink to="/orders" className="hover:text-primary font-medium">
            Orders
          </NavLink>
          {user?.role === 'staff' && (
            <NavLink to="/staff" className="hover:text-primary font-medium">
              Staff
            </NavLink>
          )}
          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm"
            >
              Logout ({user.name})
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-3 py-1.5 rounded-full bg-primary text-white hover:bg-blue-600 shadow-sm transition text-sm"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

