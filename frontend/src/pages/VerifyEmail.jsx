import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const API_BASE = API_BASE_URL;

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState({ loading: true, success: false, message: '' });

  const verifyRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, success: false, message: 'Invalid or missing verification token.' });
      return;
    }

    if (verifyRef.current) return;
    verifyRef.current = true;

    const verify = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/verify-email/${token}`, {
          withCredentials: true,
        });

        // if (response.data.user) {
        //   setUser(response.data.user);
        // }

        setStatus({ loading: false, success: true, message: response.data.data.message }); // Corrected path to message

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus({
          loading: false,
          success: false,
          message: err.response?.data?.message || 'Verification failed.',
        });
      }
    };

    verify();
  }, [token, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#1E293B]">Email Verification</h1>

        {status.loading && (
          <p className="text-blue-600 flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Verifying your email...
          </p>
        )}

        {!status.loading && (
          <p className={`text-lg font-semibold ${status.success ? 'text-green-600' : 'text-red-600'} mb-2`}>
            {status.message}
          </p>
        )}

        {!status.loading && status.success && (
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        )}

        {!status.loading && !status.success && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Retry
            </button>
            <Link
              to="/login"
              className="inline-block text-blue-600 hover:underline font-semibold"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
