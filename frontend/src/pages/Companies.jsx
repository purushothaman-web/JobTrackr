import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../services/JobService';

const initialForm = {
  name: '',
  website: '',
  industry: '',
  location: '',
  notes: '',
};

const Companies = () => {
  const { user, loading: authLoading } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCompanies = async (searchTerm = '') => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const data = await fetchCompanies({ token: user.token, search: searchTerm });
      setCompanies(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.token) loadCompanies();
  }, [authLoading, user]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    try {
      setLoading(true);
      if (editingId) {
        await updateCompany({ companyId: editingId, payload: form, token: user.token });
      } else {
        await createCompany({ payload: form, token: user.token });
      }
      resetForm();
      await loadCompanies(search);
    } catch (err) {
      setError(err.message || 'Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (company) => {
    setEditingId(company.id);
    setForm({
      name: company.name || '',
      website: company.website || '',
      industry: company.industry || '',
      location: company.location || '',
      notes: company.notes || '',
    });
  };

  const handleDelete = async (company) => {
    if (!user?.token) return;
    if (!window.confirm(`Delete ${company.name}?`)) return;

    try {
      setLoading(true);
      await deleteCompany({ companyId: company.id, token: user.token });
      await loadCompanies(search);
    } catch (err) {
      setError(err.message || 'Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadCompanies(search);
  };

  if (authLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Companies</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company name"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Company name"
          className="border rounded px-3 py-2"
        />
        <input
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="Website"
          className="border rounded px-3 py-2"
        />
        <input
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
          placeholder="Industry"
          className="border rounded px-3 py-2"
        />
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          className="border rounded px-3 py-2"
        />
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes"
          className="border rounded px-3 py-2 md:col-span-2"
          rows={3}
        />
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {editingId ? 'Update Company' : 'Add Company'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-200 px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Industry</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Jobs</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-t">
                <td className="p-3">{company.name}</td>
                <td className="p-3">{company.industry || '-'}</td>
                <td className="p-3">{company.location || '-'}</td>
                <td className="p-3">{company._count?.jobs ?? 0}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => startEdit(company)} className="text-blue-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(company)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!companies.length && !loading && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;
