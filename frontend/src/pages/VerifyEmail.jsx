import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import Button from '../components/Button';

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

        setStatus({ loading: false, success: true, message: response.data.data?.message || 'Verification successful.' });

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
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-obsidian-light border border-border p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric to-electric" />

        <h1 className="font-heading text-4xl font-black text-offwhite tracking-tighter uppercase mb-2">
          Identity Sync<span className="text-electric">.</span>
        </h1>
        
        <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-8 border-b border-border/50 pb-6 inline-block">
          Email Verification Protocol
        </p>

        <div className="min-h-[100px] flex flex-col items-center justify-center">
          {status.loading && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-mono text-electric uppercase tracking-widest text-sm"
            >
              [ VERIFYING_AUTH_TOKEN... ]
            </motion.div>
          )}

          {!status.loading && (
            <div className={`p-4 border font-mono text-sm uppercase tracking-widest w-full ${status.success ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-red-500/50 bg-red-500/10 text-red-500'}`}>
              {status.message}
            </div>
          )}

          {!status.loading && status.success && (
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-6 animate-pulse">
              Redirecting to login portal...
            </p>
          )}

          {!status.loading && !status.success && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Retry Auth
              </Button>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
