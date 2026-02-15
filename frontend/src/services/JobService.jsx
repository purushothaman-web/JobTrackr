import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const API_BASE = API_BASE_URL;

const getAuthConfig = (token, extra = {}) => ({
  ...extra,
  headers: {
    ...(extra.headers || {}),
    Authorization: `Bearer ${token}`,
  },
});

const getErrorMessage = (error) => {
  if (error.response?.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  return error.response?.data?.error || error.response?.data?.message || error.message || 'Something went wrong';
};

const unwrap = (response, fallback) => {
  if (response?.data?.success) return response.data.data;
  throw new Error(response?.data?.error || fallback);
};

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
    const response = await axios.get(`${API_BASE}/jobs`, getAuthConfig(token, {
      params: { page, limit, status, sortBy, order, search },
    }));
    return unwrap(response, 'Failed to fetch jobs');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchJob = async ({ id, token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/${id}`, getAuthConfig(token));
    return unwrap(response, 'Failed to fetch job');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createJob = async ({
  position,
  company,
  location,
  status,
  notes,
  token,
}) => {
  const data = { position, company, location, status, notes };
  try {
    const response = await axios.post(`${API_BASE}/jobs`, data, getAuthConfig(token));
    return unwrap(response, 'Failed to create job');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateJob = async ({
  id,
  position,
  company,
  location,
  status,
  notes,
  token,
}) => {
  const data = { position, company, location, status, notes };
  try {
    const response = await axios.put(`${API_BASE}/jobs/${id}`, data, getAuthConfig(token));
    return unwrap(response, 'Failed to update job');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteJob = async ({ id, token }) => {
  try {
    const response = await axios.delete(`${API_BASE}/jobs/${id}`, getAuthConfig(token));
    const data = unwrap(response, 'Failed to delete job');
    toast.success('Job deleted successfully!');
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    throw new Error(message);
  }
};

export const updateJobStatus = async ({ token, id, status }) => {
  try {
    const response = await axios.patch(`${API_BASE}/jobs/${id}/status`, { status }, getAuthConfig(token));
    return unwrap(response, 'Failed to update job status');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getJobStats = async ({ token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/stats`, getAuthConfig(token));
    return unwrap(response, 'Failed to fetch job stats');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const exportJobsCSV = async ({ token }) => {
  try {
    const response = await axios.get(
      `${API_BASE}/jobs/export`,
      getAuthConfig(token, { responseType: 'blob' })
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const sendJobSummaryEmail = async ({ token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/email`, getAuthConfig(token));
    return unwrap(response, 'Failed to send job summary email');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const importJobs = async ({ rows, token }) => {
  try {
    const response = await axios.post(`${API_BASE}/jobs/import`, { rows }, getAuthConfig(token));
    return unwrap(response, 'Failed to import jobs');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getJobTimeline = async ({ jobId, token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/${jobId}/timeline`, getAuthConfig(token));
    return unwrap(response, 'Failed to fetch job timeline');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchInterviews = async ({ jobId, token }) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/${jobId}/interviews`, getAuthConfig(token));
    return unwrap(response, 'Failed to fetch interviews');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchAllInterviews = async ({ token, status = '', from = '', to = '' } = {}) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get(`${API_BASE}/interviews`, getAuthConfig(token, { params }));
    return unwrap(response, 'Failed to fetch interviews');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createInterview = async ({ jobId, payload, token }) => {
  try {
    const response = await axios.post(
      `${API_BASE}/jobs/${jobId}/interviews`,
      payload,
      getAuthConfig(token)
    );
    return unwrap(response, 'Failed to create interview');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateInterview = async ({ interviewId, payload, token }) => {
  try {
    const response = await axios.put(
      `${API_BASE}/interviews/${interviewId}`,
      payload,
      getAuthConfig(token)
    );
    return unwrap(response, 'Failed to update interview');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteInterview = async ({ interviewId, token }) => {
  try {
    const response = await axios.delete(`${API_BASE}/interviews/${interviewId}`, getAuthConfig(token));
    return unwrap(response, 'Failed to delete interview');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchCompanies = async ({ token, search = '' } = {}) => {
  try {
    const params = {};
    if (search) params.search = search;

    const response = await axios.get(`${API_BASE}/companies`, getAuthConfig(token, { params }));
    return unwrap(response, 'Failed to fetch companies');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createCompany = async ({ payload, token }) => {
  try {
    const response = await axios.post(`${API_BASE}/companies`, payload, getAuthConfig(token));
    return unwrap(response, 'Failed to create company');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateCompany = async ({ companyId, payload, token }) => {
  try {
    const response = await axios.put(
      `${API_BASE}/companies/${companyId}`,
      payload,
      getAuthConfig(token)
    );
    return unwrap(response, 'Failed to update company');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteCompany = async ({ companyId, token }) => {
  try {
    const response = await axios.delete(`${API_BASE}/companies/${companyId}`, getAuthConfig(token));
    return unwrap(response, 'Failed to delete company');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
