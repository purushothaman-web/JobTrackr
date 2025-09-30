// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
// Simple Modal component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
import { useAuth } from "../context/AuthContext";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
  

const Profile = () => {
  const { api, user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', currentPassword: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name || '', email: profile.email || '', password: '', currentPassword: '' });
    }
  }, [profile]);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setMessage('');
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage('');
    setError('');
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully.');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/jobs/stats"),
        ]);
        setProfile(profileRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const handleResendVerification = async () => {
    if (!profile?.email) return;

    try {
      setResendLoading(true);
      setMessage("");
      setError("");

      const res = await api.post("/auth/resend-verification", {
        email: profile.email,
      });

      setMessage(res.data.message || "Verification email sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSendWeeklyReport = async () => {
    try {
      const res = await api.get("/jobs/email");
      setMessage(res.data.message || "Email sent.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email.");
      setMessage("");
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  // Chart.js data config
  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Jobs",
        data: [
          stats?.stats?.applied || 0,
          stats?.stats?.interview || 0,
          stats?.stats?.offer || 0,
          stats?.stats?.rejected || 0,
        ],
        backgroundColor: [
          "#FACC15", // yellow
          "#3B82F6", // blue
          "#10B981", // green
          "#EF4444", // red
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
      {/* LEFT COLUMN */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between">
        <h1 className="text-3xl font-bold mb-6 text-[#1E293B] text-center">👤 Profile Information</h1>

        <div className="space-y-3 mb-6 text-lg text-gray-700 bg-gray-100 rounded-xl p-6 shadow-sm">
          <p><span className="font-semibold text-gray-600">Name:</span> {profile?.name}</p>
          <p><span className="font-semibold text-gray-600">Email:</span> {profile?.email}</p>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            onClick={handleEditToggle}
          >
            Edit Profile
          </button>
        </div>

        <Modal open={editMode} onClose={handleEditToggle}>
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Leave blank to keep current password"
              />
            </div>
            {formData.password && (
              <div>
                <label className="block font-semibold mb-1">Current Password <span className="text-xs text-gray-500">(required to change password)</span></label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            )}
            {(error || message) && (
              <div className="text-center">
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {message && <p className="text-green-600 mb-2">{message}</p>}
              </div>
            )}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <div className="mt-auto bg-white rounded-xl shadow p-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        <h2 className="text-3xl font-bold mb-6 text-[#1E293B] text-center">📊 Job Statistics</h2>

        {stats ? (
          <ul className="space-y-3 text-lg text-gray-700 bg-gray-100 rounded-xl p-6 mb-6">
            <li><span className="font-semibold text-gray-600">Total Jobs:</span> {stats.totalJobs}</li>
            <li><span className="font-semibold text-gray-600">Applied:</span> {stats.stats?.applied || 0}</li>
            <li><span className="font-semibold text-gray-600">Interview:</span> {stats.stats?.interview || 0}</li>
            <li><span className="font-semibold text-gray-600">Offer:</span> {stats.stats?.offer || 0}</li>
            <li><span className="font-semibold text-gray-600">Rejected:</span> {stats.stats?.rejected || 0}</li>
          </ul>
        ) : (
          <p className="text-center mb-6">No stats available.</p>
        )}

        {(!user?.emailVerified && !profile?.emailVerified) && (
          <div className="text-center mb-6">
            <p className="text-yellow-600 mb-2 font-medium">Your email is not verified.</p>
            <button
              onClick={handleResendVerification}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6 text-center mt-auto">
          <h2 className="text-xl font-semibold mb-4">📧 Weekly Report</h2>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            onClick={handleSendWeeklyReport}
          >
            Send Summary Email
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default Profile;
