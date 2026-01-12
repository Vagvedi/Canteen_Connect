import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../state/store";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const initialize = useAuthStore((s) => s.initialize);

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      role,
      roll_number: role === "student" ? roll : null,
    });

    await initialize();
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="One system for students, staff & admins"
    >
      <form onSubmit={handleRegister} className="space-y-5">

        {/* ROLE TOGGLE */}
        <div className="grid grid-cols-3 gap-2">
          {["student", "staff", "admin"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`py-2 rounded-lg font-semibold ${
                role === r
                  ? "bg-purple-600 text-white"
                  : "bg-black/30 text-white/70"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50"
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50"
        />

        {role === "student" && (
          <input
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50"
          />
        )}

        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-bold text-white"
        >
          {loading ? "Creating..." : "CREATE ACCOUNT"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <p className="text-sm text-white/70 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 font-semibold">
            Login
          </a>
        </p>

      </form>
    </AuthLayout>
  );
}
