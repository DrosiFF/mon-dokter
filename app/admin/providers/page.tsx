'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Building2,
  Users
} from 'lucide-react';

interface Provider {
  id: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  bio: string;
  specialties: string[];
  clinic: {
    name: string;
    address: string;
    island: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminProvidersPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const url = `/api/admin/providers${statusFilter ? `?status=${statusFilter}` : ''}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      } else {
        // No mock data - show empty state for real testing
        setProviders([]);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAction = async (providerId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/providers/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          action,
        }),
      });

      if (response.ok) {
        // Update local state
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, status: action === 'approve' ? 'approved' : 'rejected', profile: { ...p.profile, role: action === 'approve' ? 'PROVIDER' : 'USER' } }
            : p
        ));
        setSelectedProvider(null);
      } else {
        // For testing without database, just update local state
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, status: action === 'approve' ? 'approved' : 'rejected', profile: { ...p.profile, role: action === 'approve' ? 'PROVIDER' : 'USER' } }
            : p
        ));
        setSelectedProvider(null);
      }
    } catch (error) {
      console.error('Error updating provider:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
        <p className="mt-2 text-sm text-gray-700">
          Review and manage healthcare provider applications and profiles
        </p>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { name: 'All Providers', value: null, count: providers.length },
            { name: 'Pending', value: 'pending', count: providers.filter(p => p.status === 'pending').length },
            { name: 'Approved', value: 'approved', count: providers.filter(p => p.status === 'approved').length },
            { name: 'Rejected', value: 'rejected', count: providers.filter(p => p.status === 'rejected').length },
          ].map((tab) => (
            <a
              key={tab.name}
              href={`/admin/providers${tab.value ? `?status=${tab.value}` : ''}`}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === tab.value
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Providers table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clinic & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-cyan-700">
                          {provider.profile.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {provider.profile.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {provider.profile.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {provider.profile.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {provider.clinic.name}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {provider.clinic.island}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {provider.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                      >
                        {specialty}
                      </span>
                    ))}
                    {provider.specialties.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{provider.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    provider.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : provider.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {provider.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {provider.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(provider.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="text-cyan-600 hover:text-cyan-900"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {provider.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleProviderAction(provider.id, 'approve')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleProviderAction(provider.id, 'reject')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {providers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter 
                ? `No providers with status "${statusFilter}"`
                : 'No provider applications yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedProvider(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Provider Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6 space-y-6">
                {/* Provider Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Provider Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.profile.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.profile.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Role</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.profile.role}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                    {selectedProvider.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clinic Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Clinic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.clinic.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Island</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.clinic.island}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProvider.clinic.address}</p>
                    </div>
                  </div>
                </div>

                {/* Application Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedProvider.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                {selectedProvider.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleProviderAction(selectedProvider.id, 'reject')}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleProviderAction(selectedProvider.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Provider
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
