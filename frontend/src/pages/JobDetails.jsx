import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJob, deleteJob } from '../services/JobService';

const JobDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      if (user && user.token) {
        try {
          setLoading(true);
          const job = await fetchJob({ token: user.token, id });
          setJob(job);
          setError('');
        } catch (err) {
          setError(err.message || 'Failed to load job');
        } finally {
          setLoading(false);
        }
      }
    };

    loadJob();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteJob({ token: user.token, id });
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Loading authentication...</p>;
  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;
  if (!job) return <p className="text-center my-4">Job not found.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-md sm:max-w-2xl bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">Job Details</h1>

        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6 text-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-2 sm:pb-3 gap-1">
            <span className="font-semibold text-gray-600">Position:</span>
            <span className="text-base sm:text-lg break-words">{job.position}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-2 sm:pb-3 gap-1">
            <span className="font-semibold text-gray-600">Company:</span>
            <span className="text-base sm:text-lg break-words">{job.company}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-2 sm:pb-3 gap-1">
            <span className="font-semibold text-gray-600">Location:</span>
            <span className="text-base sm:text-lg break-words">{job.location}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-2 sm:pb-3 gap-1">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className="capitalize px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">{job.status}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Notes:</span>
            <p className="mt-2 whitespace-pre-wrap text-gray-800 bg-gray-100 rounded p-2 sm:p-3">{job.notes || 'N/A'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={() => navigate('/jobs')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            disabled={loading}
          >
            Back to Jobs
          </button>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => navigate(`/edit-job/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
