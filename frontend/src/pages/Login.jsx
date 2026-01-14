// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../state/store";

export default function Login() {
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // 🔑 VERY IMPORTANT
      await initialize();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Login failed");

      // 🔑 FETCH ROLE
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      // 🔥 ROLE-BASED REDIRECT
      if (profile?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Invalid login credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b145e] to-[#14082f] px-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div className="text-white">
          <h1 className="text-5xl font-extrabold mb-4">
            Canteen{" "}
            <span className="text-purple-400">
              Connect
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            One login for students, staff &
            admins.
            <br />
            Fast. Simple. Secure.
          </p>
        </div>

        {/* RIGHT */}
        <div className="glass p-8 rounded-2xl w-full max-w-md ml-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Welcome Back
          </h2>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white"
            />

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 font-bold text-white"
            >
              {loading ? "Logging in…" : "LOGIN"}
            </button>
          </form>

          <p className="text-sm text-white/60 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
