import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../api/client';
import { useAuthStore } from '../state/store';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { user, token } = await apiRegister(form);
      login(user, token);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 mb-3">{error}</div>}
      <form className="card p-4 space-y-3" onSubmit={submit}>
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <select
          className="w-full border rounded px-3 py-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        <button className="w-full bg-primary text-white py-2 rounded">Create account</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        Already registered? <Link to="/login" className="text-primary">Login</Link>
      </p>
    </div>
  );
};

export default Register;

