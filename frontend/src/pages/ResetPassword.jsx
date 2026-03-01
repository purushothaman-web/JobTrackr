import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import FormField from '../components/FormField';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing hardware token.');
    }
  }, [token]);

  const validate = () => {
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain an uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain a lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain a number.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain a special character.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        password,
      });
      setMessage(response.data.message || 'Access reinstated. Returning to login sector...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Override override failed. Retry sequence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-obsidian-light border border-border p-8 sm:p-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric to-electric opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-black text-offwhite uppercase tracking-tighter mb-2">
            Access Override<span className="text-electric">.</span>
          </h1>
          <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
            Reset Synchronization Protocol
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 border border-green-500/50 bg-green-500/10 text-green-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="New Passcode"
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="[ INPUT REDACTED ]"
          />

          <FormField
            label="Verify Passcode"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="[ INPUT REDACTED ]"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full uppercase tracking-widest font-black mt-4"
            disabled={loading}
          >
            {loading ? 'Overriding...' : 'Confirm Matrix Override'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
