import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [status, setStatus] = useState({ message: '', error: false });
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setStatus({ message: 'Please attach a resume file (PDF/DOC/DOCX).', error: true });
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverNote', coverNote);

    try {
      await api.post(`/applications/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setApplied(true);
      setStatus({ message: 'Application submitted successfully!', error: false });
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Failed to apply', error: true });
    }
  };

  if (!job) return <p className="max-w-3xl mx-auto px-6 py-10 text-slate">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink">{job.title}</h1>
      <p className="text-slate mt-1">{job.company} · {job.location} · {job.type}</p>
      {job.salary && <p className="text-slate mt-1">Salary: {job.salary}</p>}

      {job.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((s) => (
            <span key={s} className="text-xs bg-ink/5 text-slate px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}

      <p className="mt-6 text-ink whitespace-pre-line leading-relaxed">{job.description}</p>

      <hr className="my-8 border-ink/10" />

      {user?.role === 'seeker' && !applied && (
        <form onSubmit={handleApply} className="space-y-4">
          <h2 className="font-medium text-ink">Apply to this job</h2>
          <input
            type="file" accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="block text-sm"
          />
          <textarea
            placeholder="Optional cover note..." value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            className="w-full border border-ink/15 rounded-md px-3 py-2 h-24"
          />
          <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent/90">
            Submit application
          </button>
        </form>
      )}

      {applied && <p className="text-accent font-medium">You've applied to this job.</p>}
      {!user && <p className="text-slate">Log in as a job seeker to apply.</p>}
      {status.message && (
        <p className={`mt-3 text-sm ${status.error ? 'text-red-600' : 'text-accent'}`}>{status.message}</p>
      )}
    </div>
  );
}
