import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_COLORS = {
  Applied: 'bg-ink/5 text-slate',
  Reviewed: 'bg-blue-50 text-blue-700',
  Accepted: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApplications(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-6">My applications</h1>

      {applications.length === 0 ? (
        <p className="text-slate">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="flex items-center justify-between border border-ink/10 rounded-lg p-4 bg-white">
              <div>
                <p className="font-medium text-ink">{app.job?.title}</p>
                <p className="text-sm text-slate">{app.job?.company} · {app.job?.location}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
