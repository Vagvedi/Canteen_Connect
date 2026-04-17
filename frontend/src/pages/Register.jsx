import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Loader2, Mail, Lock, User, Hash, Eye, EyeOff, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

const ROLES = [
  { value: "student", label: "Student", icon: GraduationCap, desc: "Order food from canteen" },
  { value: "staff",   label: "Staff",   icon: Briefcase,     desc: "Order without roll no." },
  { value: "admin",   label: "Admin",   icon: ShieldCheck,   desc: "Manage orders & menu" },
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerNumber, setRegisterNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth failed");
      const { error: profileError } = await supabase.from("users").upsert(
        { id: user.id, email, name, role, register_number: role === "student" ? registerNumber : null },
        { onConflict: "id" }
      );
      if (profileError) throw profileError;
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join to start ordering from your campus canteen.">
      {/* Role selector — 3-way neumorphic segmented control */}
      <div className="mb-7">
        <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2.5 block">
          I am a
        </label>
        <div className="flex items-center rounded-xl p-1 shadow-neu-inset gap-1">
          {ROLES.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === r.value
                    ? "bg-teal text-white shadow-neu-xs"
                    : "text-charcoal-60 hover:text-charcoal"
                }`}
                title={r.desc}
              >
                <Icon className="w-3.5 h-3.5" />
                {r.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-charcoal-40 mt-2 text-center">
          {ROLES.find(r => r.value === role)?.desc}
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2.5 block">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="inp-neu pl-12"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2.5 block">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@university.edu"
              className="inp-neu pl-12"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2.5 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
              className="inp-neu pl-12 pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-40 hover:text-charcoal transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Register number — only for students */}
        {role === "student" && (
          <div className="fade-up">
            <label className="text-[11px] font-bold text-charcoal-60 uppercase tracking-wider mb-2.5 block">
              Register / Roll number
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-40 pointer-events-none" />
              <input
                type="text"
                value={registerNumber}
                onChange={e => setRegisterNumber(e.target.value)}
                required
                placeholder="e.g. 21BCE0001"
                className="inp-neu pl-12"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 py-3 px-4 rounded-xl bg-rose-light/60 border border-rose/20">
            <span className="text-rose text-sm mt-0.5">⚠</span>
            <p className="text-rose text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-neu-accent w-full h-12 text-[15px] mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-cream-dark/50 text-center">
        <p className="text-sm text-charcoal-60">
          Already have an account?{" "}
          <Link to="/login" className="text-teal hover:text-teal-dark font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
