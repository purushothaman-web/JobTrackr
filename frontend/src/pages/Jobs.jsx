import React, { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../services/JobService';
import { useAuth } from '../context/AuthContext';
import JobList from '../components/JobList';
import { CSVLink } from "react-csv";
import debounce from 'lodash.debounce';

const Jobs = () => {
  const { user, loading: authLoading } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Responsive filter menu state
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = debounce(() => {
      setSearchDebounced(search);
      setPagination({ page: 1, totalPages: 1 });
    }, 500);

    handler();
    return () => handler.cancel();
  }, [search]);

  const loadJobs = useCallback(async (page = 1, append = false) => {
    if (authLoading || !user) return;

    try {
      setLoading(true);
      const data = await fetchJobs({
        token: user.token,
        page,
        status: statusFilter,
        sortBy,
        order,
        search: searchDebounced,
      });

      const newJobs = append ? [...jobs, ...data.jobs] : data.jobs;
      setJobs(newJobs);

      // Prepare CSV data
      const formattedJobs = newJobs.map((job) => ({
        position: job.position,
        company: job.company,
        location: job.location,
        status: job.status,
        description: job.description,
        notes: job.notes,
      }));
      setCsvData(formattedJobs);

      setPagination({ page: data.page, totalPages: data.totalPages });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [authLoading, user, statusFilter, sortBy, order, searchDebounced, jobs]);

  // Load jobs when filters/sorting/search/pagination change
  useEffect(() => {
    loadJobs(pagination.page, pagination.page > 1);
  }, [pagination.page, statusFilter, sortBy, order, searchDebounced]);

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const clearFilter = () => {
    setStatusFilter('');
    setSortBy('createdAt');
    setOrder('desc');
    setSearch('');
    setPagination({ page: 1, totalPages: 1 });
  };

  if (authLoading) return <p>Checking authentication...</p>;


  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-full sm:max-w-7xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Job Listings</h2>

      {error && (
        error === 'Too many requests. Please try again later.' ? (
          <div className="mb-4 flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 sm:p-4 rounded">
            <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01" />
            </svg>
            <span>{error}</span>
          </div>
        ) : (
          <p className="text-red-600 mb-4">{error}</p>
        )
      )}

      {/* Filter toggle for small screens */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-6">
        {/* Sidebar filters */}
        {(showFilters || window.innerWidth >= 640) && (
          <aside className="w-full sm:w-1/4 mb-4 sm:mb-0 bg-white p-3 sm:p-4 rounded shadow">
            <h3 className="font-semibold mb-3 sm:mb-4 text-gray-700">Filters & Sorting</h3>

            <div className="mb-3 sm:mb-4">
              <label htmlFor="statusFilter" className="block font-medium mb-1">Filter by Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ page: 1, totalPages: 1 });
                }}
                className="w-full border rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-3 sm:mb-4">
              <label htmlFor="search" className="block font-medium mb-1">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Position, company, etc."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <label htmlFor="sortBy" className="block font-medium mb-1">Sort By</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination({ page: 1, totalPages: 1 });
                }}
                className="w-full border rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="createdAt">Date</option>
                <option value="position">Position</option>
                <option value="company">Company</option>
              </select>
            </div>

            <div className="mb-3 sm:mb-4">
              <label htmlFor="order" className="block font-medium mb-1">Order</label>
              <select
                id="order"
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                  setPagination({ page: 1, totalPages: 1 });
                }}
                className="w-full border rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <button
              onClick={clearFilter}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 bg-white p-3 sm:p-6 rounded shadow">
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
            {statusFilter && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </span>
            )}
            {searchDebounced && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Search: {searchDebounced}
              </span>
            )}
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({order})
            </span>
          </div>

          <JobList jobs={jobs} onStatusUpdated={() => loadJobs(pagination.page)} />

          {pagination.page < pagination.totalPages && (
            <div className="text-center mt-4 sm:mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {/* Export CSV */}
          <div className="mt-4 sm:mt-6 text-right">
            <CSVLink
              data={csvData}
              filename={"jobs.csv"}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 sm:px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Export to CSV
            </CSVLink>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobs;
