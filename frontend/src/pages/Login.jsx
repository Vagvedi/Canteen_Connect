import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../state/store";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      await initialize();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login failed");
      const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
      navigate(profile?.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue ordering.">
      <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="••••••••"
              className="inp-neu pl-12 pr-12"
              autoComplete="current-password"
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
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-cream-dark/50 text-center">
        <p className="text-sm text-charcoal-60">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal hover:text-teal-dark font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
