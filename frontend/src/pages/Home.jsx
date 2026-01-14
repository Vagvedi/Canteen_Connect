import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0627] via-[#1a0b3d] to-[#0b021a] text-white">
      
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-20 grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Canteen{" "}
            <span className="text-purple-400">Connect</span>
          </h1>

          <p className="text-lg text-white/80 max-w-lg">
            Order food, manage canteen operations, and track order status —
            all in one powerful platform.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* RIGHT GLASS CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl space-y-8">
          
          <Feature
            title="For Students"
            description="Browse menu, add items to cart, and checkout in seconds."
            cta="Register as Student"
            link="/register"
          />

          <Divider />

          <Feature
            title="For Staff"
            description="Place orders just like students with faster access."
            cta="Register as Staff"
            link="/register"
          />

          <Divider />

          <Feature
            title="Live Orders"
            description="Track orders with real-time updates instantly."
            cta="View Orders"
            link="/login"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Feature({ title, description, cta, link }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-purple-300">
        {title}
      </h3>
      <p className="text-sm text-white/75">
        {description}
      </p>
      <Link
        to={link}
        className="inline-block mt-2 text-sm font-semibold text-purple-400 hover:underline"
      >
        {cta} →
      </Link>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  );
}
