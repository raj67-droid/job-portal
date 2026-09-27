import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const STATUS_OPTIONS = ['Applied', 'Reviewed', 'Accepted', 'Rejected'];
const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  const fetchApplicants = async () => {
    const { data } = await api.get(`/applications/job/${jobId}`);
    setApplications(data);
  };

  useEffect(() => { fetchApplicants(); }, [jobId]); // eslint-disable-line

  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    fetchApplicants();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-6">Applicants</h1>

      {applications.length === 0 ? (
        <p className="text-slate">No applications yet for this job.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="border border-ink/10 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{app.applicant?.name}</p>
                  <p className="text-sm text-slate">{app.applicant?.email}</p>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="border border-ink/15 rounded-md px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {app.coverNote && <p className="text-sm text-slate mt-2">{app.coverNote}</p>}
              <a
                href={`${API_ORIGIN}${app.resumePath}`} target="_blank" rel="noreferrer"
                className="text-sm text-accent mt-2 inline-block"
              >
                View resume ({app.resumeOriginalName})
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
