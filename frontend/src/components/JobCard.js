import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block rounded-lg border border-ink/10 bg-white p-5 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-ink">{job.title}</h3>
          <p className="text-sm text-slate mt-0.5">{job.company} · {job.location}</p>
        </div>
        <span className="text-xs rounded-full bg-accent/10 text-accent px-2.5 py-1">{job.type}</span>
      </div>
      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((s) => (
            <span key={s} className="text-xs bg-ink/5 text-slate px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
