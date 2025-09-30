import axios from 'axios';
import { API_BASE_URL } from '../config';


const API_BASE = API_BASE_URL;

// ✅ GET: Fetch all jobs (with filters and pagination)
export const fetchJobs = async ({
  token,
  page = 1,
  limit = 10,
  status = '',
  sortBy = 'createdAt',
  order = 'desc',
  search = '',
}) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs`, {
      params: { page, limit, status, sortBy, order, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to fetch jobs');
    }
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(errMsg);
  }
};

// ✅ DELETE: Delete a specific job
import { toast } from 'react-toastify';

export const deleteJob = async ({ id, token }) => {
  try {
    const response = await axios.delete(`${API_BASE}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success) {
      toast.success('Job deleted successfully!');
      return response.data.data;
    } else {
      toast.error(response.data.error || 'Failed to delete job.');
      throw new Error(response.data.error || 'Failed to delete job');
    }
  } catch (error) {
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.response?.data?.error || error.message || 'Something went wrong';
    toast.error(errMsg);
    throw new Error(errMsg);
  }
};


// ✅ PUT: Update a job
export const updateJob = async ({
  id,
  position,
  company,
  location,
  status,
  notes,
  token,
}) => {
  const data = {
    position,
    company,
    location,
    status,
    notes,
  };
  try {
    const response = await axios.put(
      `${API_BASE}/jobs/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to update job');
    }
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(errMsg);
  }
};
// ✅ POST: Create a new job
export const createJob = async ({
  position,
  company,
  location,
  status,
  notes,
  token,
}) => {
  const data = {
    position,
    company,
    location,
    status,
    notes,
  };
  try {
    const response = await axios.post(
      `${API_BASE}/jobs`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to create job');
    }
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(errMsg);
  }
};

// ✅ GET: Fetch a specific job
export const fetchJob = async ({ id, token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to fetch job');
    }
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(errMsg);
  }
};


// JobService.jsx

export const updateJobStatus = async ({ token, id, status }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const response = await res.json();
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update job status');
    }
  } catch (error) {
    if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    const errMsg = error.message || 'Something went wrong';
    throw new Error(errMsg);
  }
};
