import { Link } from "react-router-dom";
import { Utensils, ShieldCheck, Zap, Clock, IndianRupee, Users } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      {/* Left — Form Panel */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-10">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2.5 mb-8 lg:mb-10 w-fit group">
          <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-neu-xs group-hover:shadow-neu-sm transition-shadow">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-charcoal tracking-tight group-hover:text-teal transition-colors">
            Canteen<span className="text-teal group-hover:text-charcoal">Connect</span>
          </span>
        </Link>

        {/* Form area — perfectly centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[420px]">
            <div className="card-neu p-7 sm:p-9">
              <h1 className="font-display text-display-lg text-charcoal mb-1.5">{title}</h1>
              <p className="text-charcoal-60 text-sm mb-7 leading-relaxed">{subtitle}</p>
              {children}
            </div>

            {/* Trust indicators below form on mobile */}
            <div className="flex items-center justify-center gap-5 mt-6 lg:hidden">
              {[
                { icon: Zap, label: "Fast" },
                { icon: ShieldCheck, label: "Secure" },
                { icon: IndianRupee, label: "₹ INR" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-charcoal-40">
                  <t.icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Decorative Panel (desktop only) */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] bg-surface flex-col items-center justify-center p-10 xl:p-14 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #2A9D8F 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-7">
          {/* Large icon */}
          <div className="w-20 h-20 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto shadow-neu">
            <Utensils className="w-10 h-10 text-teal" />
          </div>

          <div>
            <h2 className="font-display text-display-md text-charcoal mb-2">Campus dining,<br />reimagined.</h2>
            <p className="text-charcoal-60 text-sm leading-relaxed max-w-[280px] mx-auto">
              Skip the line, order from anywhere on campus, and pick up when it's ready.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto">
            {[
              { icon: Zap, text: "Instant ordering", desc: "Place orders from anywhere" },
              { icon: Clock, text: "Real-time tracking", desc: "Know when it's ready" },
              { icon: ShieldCheck, text: "Secure & reliable", desc: "Safe campus platform" },
            ].map((f, i) => (
              <div key={i} className="card-neu-sm flex items-center gap-3 p-3.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-teal-light flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-charcoal block leading-tight">{f.text}</span>
                  <span className="text-[11px] text-charcoal-40">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <p className="font-display text-lg font-bold text-teal">500+</p>
              <p className="text-[10px] text-charcoal-40 uppercase tracking-wider font-semibold">Students</p>
            </div>
            <div className="w-px h-8 bg-cream-dark" />
            <div className="text-center">
              <p className="font-display text-lg font-bold text-teal">50+</p>
              <p className="text-[10px] text-charcoal-40 uppercase tracking-wider font-semibold">Menu Items</p>
            </div>
            <div className="w-px h-8 bg-cream-dark" />
            <div className="text-center">
              <p className="font-display text-lg font-bold text-teal">&lt;5m</p>
              <p className="text-[10px] text-charcoal-40 uppercase tracking-wider font-semibold">Pickup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}