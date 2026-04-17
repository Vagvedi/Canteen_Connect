import { Link } from "react-router-dom";
import { ArrowRight, Utensils } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 nav-neu">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-neu-xs">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-charcoal tracking-tight">
            Canteen<span className="text-teal">Connect</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="btn-neu-ghost text-sm"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn-neu-accent text-sm px-5 h-10"
          >
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
