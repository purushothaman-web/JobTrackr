import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import FormField from '../components/FormField';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(
        response.data.message ||
          'Reset sequence initiated. Monitor comms channel (email).'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Access error. Retry link transmission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-obsidian-light border border-border p-8 sm:p-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric to-electric opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-black text-offwhite uppercase tracking-tighter mb-2">
            Reset Matrix<span className="text-electric">.</span>
          </h1>
          <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
            Recover Access Token
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
            label="Email Coordinate"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@network.com"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full uppercase tracking-widest font-black"
            disabled={loading}
          >
            {loading ? 'Transmitting...' : 'Send Reset Link'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
