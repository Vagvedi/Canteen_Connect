import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShoppingBag, ChefHat, Zap, BarChart3, Users, Utensils } from "lucide-react";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <NavBar />

      {/* ══════ HERO ══════ */}
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-neu p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="pill-neu active w-fit mb-6">
                <Zap className="w-3 h-3" /> Campus dining, reimagined
              </div>

              <h1 className="font-display text-display-xl text-charcoal mb-6">
                Skip the line.<br />
                <span className="text-teal">Enjoy the food.</span>
              </h1>

              <p className="text-charcoal-60 text-lg leading-relaxed max-w-lg mb-10">
                Browse your canteen's menu, place orders from anywhere on campus,
                and pick up when it's ready. No queues, no hassle.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-neu-accent text-base px-8 h-12">
                  Start ordering <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-neu text-base px-7 h-12">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Floating stat pills */}
            <div className="relative z-10 mt-12 flex flex-wrap gap-3">
              {[
                { icon: Users, label: "500+ Students", color: "text-teal" },
                { icon: Utensils, label: "50+ Items", color: "text-amber" },
                { icon: Clock, label: "< 5min Pickup", color: "text-emerald" },
              ].map((stat, i) => (
                <div key={i} className="card-neu-sm flex items-center gap-2.5 px-4 py-2.5">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm font-semibold text-charcoal">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="pill-neu text-xs mb-4 inline-flex">How it works</span>
            <h2 className="font-display text-display-lg text-charcoal mt-4">
              Order in 3 simple steps
            </h2>
            <p className="text-charcoal-60 text-sm mt-2 max-w-md mx-auto">
              From browsing to pickup, it's designed to be effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                num: "01",
                icon: "📋",
                title: "Browse menu",
                desc: "See what's available right now, updated in real time by kitchen staff.",
                accent: "bg-teal-light text-teal",
              },
              {
                num: "02",
                icon: "🛒",
                title: "Place order",
                desc: "Order from class, the library, or your room. It'll be ready when you arrive.",
                accent: "bg-amber-light text-amber",
              },
              {
                num: "03",
                icon: "✅",
                title: "Pick up",
                desc: "Show your order code at the counter. Skip the line, grab and go.",
                accent: "bg-emerald-light text-emerald",
              },
            ].map((step) => (
              <div key={step.num} className="card-neu text-center p-8 hover:shadow-neu-hover hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-5 shadow-neu-inset text-2xl">
                  {step.icon}
                </div>
                <span className="font-mono text-xs text-charcoal-40 block mb-2">{step.num}</span>
                <h3 className="font-display text-display-sm text-charcoal mb-2">{step.title}</h3>
                <p className="text-charcoal-60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="pill-neu text-xs mb-4 inline-flex">Features</span>
            <h2 className="font-display text-display-lg text-charcoal mt-4">
              Built for campus life
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 stagger-children">
            {[
              {
                icon: ShoppingBag,
                title: "Live menu",
                desc: "Real-time availability updated by kitchen staff. Know what's ready before you walk over.",
                iconBg: "bg-teal-light",
                iconColor: "text-teal",
              },
              {
                icon: Clock,
                title: "Order ahead",
                desc: "Place your order from anywhere on campus. It'll be waiting for you when you arrive.",
                iconBg: "bg-amber-light",
                iconColor: "text-amber",
              },
              {
                icon: ChefHat,
                title: "Staff tools",
                desc: "Kitchen staff manage inventory, track orders, and update availability from one dashboard.",
                iconBg: "bg-emerald-light",
                iconColor: "text-emerald",
              },
              {
                icon: BarChart3,
                title: "Order tracking",
                desc: "Track your order status in real-time. Know exactly when it's ready for pickup.",
                iconBg: "bg-rose-light",
                iconColor: "text-rose",
              },
            ].map((f, i) => (
              <div key={i} className="card-neu p-7 flex gap-5 group hover:shadow-neu-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 shadow-neu-xs`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display text-display-sm text-charcoal mb-1.5 group-hover:text-teal transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-charcoal-60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-neu p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-amber/5" />
            <div className="relative z-10">
              <h2 className="font-display text-display-md text-charcoal mb-3">
                Ready to skip the line?
              </h2>
              <p className="text-charcoal-60 text-sm mb-6 max-w-md mx-auto">
                Join hundreds of students already ordering smarter.
              </p>
              <Link to="/register" className="btn-neu-accent text-base px-8 h-12 inline-flex">
                Create your account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-neu-xs">
              <Utensils className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-charcoal tracking-tight">
              Canteen<span className="text-teal">Connect</span>
            </span>
          </div>
          <p className="text-xs text-charcoal-40">Made for campus dining · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
