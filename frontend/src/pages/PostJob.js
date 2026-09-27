import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '',
    type: 'Full-time', salary: '', skills: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/jobs', form);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-6">Post a new job</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Job title" value={form.title} onChange={update('title')}
          className="w-full border border-ink/15 rounded-md px-3 py-2" />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Company" value={form.company} onChange={update('company')}
            className="border border-ink/15 rounded-md px-3 py-2" />
          <input required placeholder="Location" value={form.location} onChange={update('location')}
            className="border border-ink/15 rounded-md px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select value={form.type} onChange={update('type')} className="border border-ink/15 rounded-md px-3 py-2">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
          <input placeholder="Salary (optional)" value={form.salary} onChange={update('salary')}
            className="border border-ink/15 rounded-md px-3 py-2" />
        </div>
        <input placeholder="Skills (comma-separated)" value={form.skills} onChange={update('skills')}
          className="w-full border border-ink/15 rounded-md px-3 py-2" />
        <textarea required placeholder="Job description" value={form.description} onChange={update('description')}
          className="w-full border border-ink/15 rounded-md px-3 py-2 h-40" />
        <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent/90">
          Publish job
        </button>
      </form>
    </div>
  );
}
