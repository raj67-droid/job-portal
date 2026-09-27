import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const { data } = await api.get('/jobs/my/posted');
    setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    await api.delete(`/jobs/${id}`);
    fetchJobs();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-ink">My job postings</h1>
        <Link to="/post-job" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent/90">
          + Post a job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-slate">You haven't posted any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="flex items-center justify-between border border-ink/10 rounded-lg p-4 bg-white">
              <div>
                <p className="font-medium text-ink">{job.title}</p>
                <p className="text-sm text-slate">{job.location} · {job.type}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-accent">View applicants</Link>
                <button onClick={() => handleDelete(job._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
