import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../api/client';
import { useAuthStore } from '../state/store';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { user, token } = await apiLogin(form);
      login(user, token);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 mb-3">{error}</div>}
      <form className="card p-4 space-y-3" onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-primary text-white py-2 rounded">Login</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        No account? <Link to="/register" className="text-primary">Register</Link>
      </p>
    </div>
  );
};

export default Login;

