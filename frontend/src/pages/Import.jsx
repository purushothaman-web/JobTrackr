import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { importJobs } from '../services/JobService';

const exampleRows = [
  {
    position: 'Frontend Engineer',
    company: 'Acme',
    status: 'applied',
    location: 'Remote',
    notes: 'Applied via referral',
  },
];

const Import = () => {
  const { user, loading: authLoading } = useAuth();
  const [rowsText, setRowsText] = useState(JSON.stringify(exampleRows, null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    let rows;
    try {
      rows = JSON.parse(rowsText);
    } catch {
      setError('Invalid JSON. Provide an array of rows.');
      return;
    }

    if (!Array.isArray(rows)) {
      setError('Rows must be a JSON array.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await importJobs({ rows, token: user.token });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Import Jobs</h1>
      <p className="mb-4 text-gray-600">
        Paste a JSON array matching job rows. Each row needs at least `position` and `company` (or `companyId`).
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleImport} className="bg-white rounded shadow p-4">
        <textarea
          value={rowsText}
          onChange={(e) => setRowsText(e.target.value)}
          rows={16}
          className="w-full border rounded p-3 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded p-4 text-green-900">
          <h2 className="font-semibold mb-2">Import Result</h2>
          <p>Imported: {result.imported}</p>
          <p>Skipped duplicates: {result.skippedDuplicates}</p>
          <p>Invalid rows: {result.invalidRows}</p>
          <p>Total rows: {result.totalRows}</p>
        </div>
      )}
    </div>
  );
};

export default Import;
