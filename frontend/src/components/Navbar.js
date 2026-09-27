import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-ink/10 bg-canvas">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink">
          WorkBridge
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-slate hover:text-ink">Browse jobs</Link>

          {user?.role === 'recruiter' && (
            <>
              <Link to="/post-job" className="text-slate hover:text-ink">Post a job</Link>
              <Link to="/recruiter/dashboard" className="text-slate hover:text-ink">My postings</Link>
            </>
          )}

          {user?.role === 'seeker' && (
            <Link to="/my-applications" className="text-slate hover:text-ink">My applications</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-ink px-3 py-1.5 text-canvas hover:bg-ink/90"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate hover:text-ink">Log in</Link>
              <Link to="/register" className="rounded-md bg-accent px-3 py-1.5 text-white hover:bg-accent/90">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
