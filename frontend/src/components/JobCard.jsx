import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusDropdown from './StatusDropdown';
import { useAuth } from '../context/AuthContext';
import { updateJobStatus } from '../services/JobService';
import { toast } from 'react-toastify';

const StatusIcon = ({ status }) => {
  const colors = {
    applied: 'bg-yellow-400',
    interview: 'bg-blue-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
  };

  const colorClass = colors[status.toLowerCase().trim()] || 'bg-gray-400';

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full mr-2 align-middle ${colorClass}`}
      aria-label={`Status: ${status}`}
      title={`Status: ${status}`}
    />
  );
};

const JobCard = ({ job, onStatusUpdated }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(job.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateJobStatus({ token: user.token, id: job.id, status: newStatus });
      setStatus(newStatus);
      toast.success(`Status updated to "${newStatus}"`);

      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between min-h-[220px] w-full max-w-md mx-auto md:max-w-none md:w-auto">
      <div className="p-4 sm:p-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <Link to={`/jobs/${job.id}`} className="block">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 break-words">{job.position}</h2>
          </Link>
          <StatusIcon status={status} />
        </div>
        <p className="text-gray-500 font-medium mb-2 break-words">{job.company}</p>
        <p className="text-sm text-gray-400 break-words">Location: {job.location}</p>
      </div>
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 gap-2">
        <p className="text-xs text-gray-400 mb-2 sm:mb-0">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
        <StatusDropdown
          currentStatus={status}
          onChange={(e, value) => {
            e.stopPropagation();
            handleStatusChange(value);
          }}
        />
      </div>
    </div>
  );
};

export default JobCard;
