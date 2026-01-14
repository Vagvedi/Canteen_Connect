// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authError) {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (signInError) throw signInError;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Auth failed");

      const { error: profileError } =
        await supabase.from("users").upsert(
          {
            id: user.id,
            email,
            name,
            role,
            register_number:
              role === "student"
                ? registerNumber
                : null,
          },
          { onConflict: "id" }
        );

      if (profileError) throw profileError;

      navigate(
        role === "admin"
          ? "/admin"
          : "/dashboard",
        { replace: true }
      );
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.message ||
          "Registration failed"
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
            One system for students, staff &
            admins.
            <br />
            Fast. Simple. Secure.
          </p>
        </div>

        {/* RIGHT */}
        <div className="glass p-8 rounded-2xl w-full max-w-md ml-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Create Account
          </h2>

          {/* ROLE TABS */}
          <div className="flex gap-3 mb-6">
            {["student", "staff", "admin"].map(
              (r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                    role === r
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              )
            )}
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white"
            />

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

            {role === "student" && (
              <input
                placeholder="Register Number"
                value={registerNumber}
                onChange={(e) =>
                  setRegisterNumber(
                    e.target.value
                  )
                }
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white"
              />
            )}

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 font-bold text-white"
            >
              {loading
                ? "Creating..."
                : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* 🔑 LOGIN LINK (NEW – MATCHES LOGIN PAGE STYLE) */}
          <p className="text-sm text-white/60 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
