import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/post-job" element={
            <PrivateRoute role="recruiter"><PostJob /></PrivateRoute>
          } />
          <Route path="/recruiter/dashboard" element={
            <PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>
          } />
          <Route path="/recruiter/jobs/:jobId/applicants" element={
            <PrivateRoute role="recruiter"><Applicants /></PrivateRoute>
          } />
          <Route path="/my-applications" element={
            <PrivateRoute role="seeker"><MyApplications /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
