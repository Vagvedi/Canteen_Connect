import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../state/store";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const initialize = useAuthStore((s) => s.initialize);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      await initialize();
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="One login for students, staff & admins. Fast. Simple. Secure."
    >
      <form className="space-y-5">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-bold text-white"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <p className="text-sm text-white/70 text-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-purple-400 font-semibold">
            Register
          </a>
        </p>

      </form>
    </AuthLayout>
  );
}
