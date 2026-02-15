import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAllInterviews, updateInterview, deleteInterview } from '../services/JobService';

const Interviews = () => {
  const { user, loading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInterviews = async (filters = {}) => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const data = await fetchAllInterviews({ token: user.token, ...filters });
      setInterviews(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.token) loadInterviews();
  }, [authLoading, user]);

  const handleFilter = async (e) => {
    e.preventDefault();
    await loadInterviews({ status, from, to });
  };

  const handleStatusChange = async (interview, newStatus) => {
    if (!user?.token) return;
    try {
      await updateInterview({
        interviewId: interview.id,
        payload: { status: newStatus },
        token: user.token,
      });
      await loadInterviews({ status, from, to });
    } catch (err) {
      setError(err.message || 'Failed to update interview');
    }
  };

  const handleDelete = async (interview) => {
    if (!user?.token) return;
    if (!window.confirm('Delete this interview?')) return;
    try {
      await deleteInterview({ interviewId: interview.id, token: user.token });
      await loadInterviews({ status, from, to });
    } catch (err) {
      setError(err.message || 'Failed to delete interview');
    }
  };

  if (authLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Interviews</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleFilter} className="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-3 py-2" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Apply Filters
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Job</th>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Round</th>
              <th className="text-left p-3">Mode</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview.id} className="border-t">
                <td className="p-3">{new Date(interview.scheduledAt).toLocaleString()}</td>
                <td className="p-3">{interview.job?.position || '-'}</td>
                <td className="p-3">{interview.job?.company || '-'}</td>
                <td className="p-3">{interview.round || '-'}</td>
                <td className="p-3">{interview.mode || '-'}</td>
                <td className="p-3">
                  <select
                    value={interview.status || 'scheduled'}
                    onChange={(e) => handleStatusChange(interview, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="scheduled">scheduled</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(interview)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!interviews.length && !loading && (
              <tr>
                <td colSpan={7} className="p-3 text-gray-500">
                  No interviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Interviews;
