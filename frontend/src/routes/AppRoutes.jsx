import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Jobs from '../pages/Jobs';
import AddJob from '../pages/AddJob';
import EditJob from '../pages/EditJob';
import JobDetails from '../pages/JobDetails';
import { useAuth } from '../context/AuthContext';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import GoogleAuthCallback from '../pages/GoogleAuthCallback';

const AppRoutes = () => {
  const { user, loading: authLoading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        authLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <Navigate to="/jobs" replace />
        ) : (
          <Login />
        )
      } />
      <Route path="/login" element={
        authLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <Navigate to="/jobs" replace />
        ) : (
          <Login />
        )
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/google-callback" element={<GoogleAuthCallback />} />
      <Route
        path="/jobs"
        element={
          authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <Jobs />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/add-job"
        element={
          authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <AddJob />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/edit-job/:id"
        element={
          authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <EditJob />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/jobs/:id"
        element={
          authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <JobDetails />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <Profile />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
