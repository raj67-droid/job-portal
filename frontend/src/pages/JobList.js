import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (type) params.type = type;
    const { data } = await api.get('/jobs', { params });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-1">Find your next role</h1>
      <p className="text-slate mb-6">Browse open positions from companies actively hiring.</p>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Search title, skill, keyword..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-ink/15 rounded-md px-3 py-2"
        />
        <input
          placeholder="Location" value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-ink/15 rounded-md px-3 py-2"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border border-ink/15 rounded-md px-3 py-2">
          <option value="">All types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <button type="submit" className="bg-ink text-canvas rounded-md px-4 py-2">Search</button>
      </form>

      {loading ? (
        <p className="text-slate">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate">No jobs match your search yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
}
