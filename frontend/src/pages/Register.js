import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker', company: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <h1 className="text-2xl font-semibold text-ink mb-6">Create an account</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" value={form.name} onChange={update('name')}
          className="w-full border border-ink/15 rounded-md px-3 py-2" />
        <input type="email" required placeholder="Email" value={form.email} onChange={update('email')}
          className="w-full border border-ink/15 rounded-md px-3 py-2" />
        <input type="password" required placeholder="Password (min 6 chars)" value={form.password} onChange={update('password')}
          className="w-full border border-ink/15 rounded-md px-3 py-2" />

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" checked={form.role === 'seeker'} onChange={() => setForm({ ...form, role: 'seeker' })} />
            Job seeker
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" checked={form.role === 'recruiter'} onChange={() => setForm({ ...form, role: 'recruiter' })} />
            Recruiter
          </label>
        </div>

        {form.role === 'recruiter' && (
          <input placeholder="Company name" value={form.company} onChange={update('company')}
            className="w-full border border-ink/15 rounded-md px-3 py-2" />
        )}

        <button type="submit" className="w-full bg-accent text-white rounded-md py-2 hover:bg-accent/90">
          Create account
        </button>
      </form>
      <p className="text-sm text-slate mt-4">
        Already have an account? <Link to="/login" className="text-accent">Log in</Link>
      </p>
    </div>
  );
}
