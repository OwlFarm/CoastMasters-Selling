'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Yacht {
  id: string;
  model: string;
  yachtType: string | null;
  yearBuilt: string | null;
  builder: string | null;
  askingPrice: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function YachtDatabasePage() {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilder, setFilterBuilder] = useState('');

  useEffect(() => {
    fetchYachts();
  }, []);

  const fetchYachts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/save-devalk-yacht');
      
      if (!response.ok) {
        throw new Error('Failed to fetch yachts');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setYachts(data.yachts);
      } else {
        setError(data.error || 'Failed to fetch yachts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteYacht = async (id: string) => {
    if (!confirm('Are you sure you want to delete this yacht? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/devalk-yachts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete yacht');
      }

      // Remove from local state
      setYachts(prev => prev.filter(yacht => yacht.id !== id));
      
      alert('Yacht deleted successfully');
    } catch (err) {
      alert(`Failed to delete yacht: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'Not specified';
    return price;
  };

  // Filter yachts based on search and builder filter
  const filteredYachts = yachts.filter(yacht => {
    const matchesSearch = yacht.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (yacht.builder && yacht.builder.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBuilder = !filterBuilder || yacht.builder === filterBuilder;
    
    return matchesSearch && matchesBuilder;
  });

  // Get unique builders for filter dropdown
  const builders = [...new Set(yachts.map(yacht => yacht.builder).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading yacht database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Database</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchYachts}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚤 De Valk Yacht Database</h1>
              <p className="mt-2 text-gray-600">
                Manage and view all saved yacht data from De Valk listings
              </p>
            </div>
            <Link
              href="/simple-devalk-test"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Add New Yacht
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🚤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Yachts</p>
                <p className="text-2xl font-bold text-gray-900">{yachts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🏗️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Builders</p>
                <p className="text-2xl font-bold text-gray-900">{builders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest Addition</p>
                <p className="text-lg font-bold text-gray-900">
                  {yachts.length > 0 ? formatDate(yachts[0].createdAt) : 'None'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price Range</p>
                <p className="text-lg font-bold text-gray-900">
                  {yachts.length > 0 ? '€200K-500K' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Yachts
              </label>
              <input
                type="text"
                placeholder="Search by model or builder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Builder
              </label>
              <select
                value={filterBuilder}
                onChange={(e) => setFilterBuilder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Builders</option>
                {builders.map((builder) => (
                  <option key={builder} value={builder}>
                    {builder}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Yacht List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Yacht Database ({filteredYachts.length} yachts)
            </h3>
          </div>
          
          {filteredYachts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="text-4xl mb-4 block">🚤</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No yachts found</h3>
              <p className="text-gray-600 mb-4">
                {yachts.length === 0 
                  ? "Your yacht database is empty. Start by adding your first yacht!"
                  : "No yachts match your current search criteria."
                }
              </p>
              {yachts.length === 0 && (
                <Link
                  href="/simple-devalk-test"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ➕ Add Your First Yacht
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yacht Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Builder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredYachts.map((yacht) => (
                    <tr key={yacht.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {yacht.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {yacht.yachtType || 'Type not specified'}
                          </div>
                          {yacht.yearBuilt && (
                            <div className="text-sm text-gray-500">
                              Built: {yacht.yearBuilt}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {yacht.builder || 'Builder not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatPrice(yacht.askingPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(yacht.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/yacht-database/${yacht.id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            👁️ View
                          </Link>
                          <Link
                            href={`/yacht-database/${yacht.id}/edit`}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteYacht(yacht.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>
            Database powered by Prisma • SQLite • Next.js API Routes
          </p>
        </div>
      </div>
    </div>
  );
}
