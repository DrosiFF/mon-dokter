'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AdminLink from '../../components/AdminLink';

interface Provider {
  id: string;
  profile: {
    name: string;
    phone: string;
    email: string;
  };
  specialties: string[];
  bio: string;
  clinic: {
    name: string;
    address: string;
    island: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  isActive: boolean;
}

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: {
    name: string;
  };
  start: string;
  end: string;
  status: string;
  notes?: string;
}

export default function ProviderDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }

    if (user) {
      fetchProviderData();
    }
  }, [user, isLoaded, router]);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch provider profile
      const providerResponse = await fetch('/api/provider/profile');
      if (providerResponse.status === 404) {
        // Provider not found - redirect to onboarding
        setProvider(null);
        setLoading(false);
        return;
      }
      
      if (!providerResponse.ok) {
        // Handle database connection issues gracefully
        if (providerResponse.status === 500) {
          setProvider(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch provider profile');
      }

      const providerData = await providerResponse.json();
      setProvider(providerData);

      // Fetch services
      const servicesResponse = await fetch('/api/provider/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/provider/bookings');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

    } catch (error) {
      console.error('Error fetching provider data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/provider/bookings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: action === 'accept' ? 'ACCEPTED' : 'DECLINED',
        }),
      });

      if (response.ok) {
        // Refresh bookings
        fetchProviderData();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchProviderData()}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be approved as a healthcare provider to access this dashboard. 
            {error && <span className="block mt-2 text-sm text-orange-600">Note: Database connection is pending - some features may be limited.</span>}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/onboarding/provider')}
              className="block w-full px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Apply as Provider
            </button>
            <button
              onClick={() => router.push('/')}
              className="block w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
              <p className="text-gray-600">Welcome back, {provider.profile.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{provider.clinic.name}</span>
              <AdminLink variant="sidebar" />
              <button
                onClick={() => router.push('/')}
                className="text-cyan-600 hover:text-cyan-700"
              >
                View Public Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'bookings', name: 'Bookings', count: bookings.length },
              { id: 'services', name: 'Services', count: services.length },
              { id: 'profile', name: 'Profile', count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No bookings yet. Once patients start booking your services, they'll appear here.</p>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.clientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.clientEmail}
                            </div>
                            {booking.clientPhone && (
                              <div className="text-sm text-gray-500">
                                {booking.clientPhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.start).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'ACCEPTED' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'DECLINED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleBookingAction(booking.id, 'accept')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleBookingAction(booking.id, 'decline')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                Add New Service
              </button>
            </div>
            
            {services.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 mb-4">No services configured yet. Add your first service to start accepting bookings.</p>
                <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                  Add Your First Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{service.durationMin} minutes</span>
                      <span className="font-semibold text-gray-900">
                        €{service.price}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Provider Profile</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-sm text-gray-900">{provider.profile.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{provider.profile.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{provider.profile.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Specialties</dt>
                      <dd className="text-sm text-gray-900">
                        {provider.specialties.join(', ')}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Clinic Information</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Clinic Name</dt>
                      <dd className="text-sm text-gray-900">{provider.clinic.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="text-sm text-gray-900">{provider.clinic.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Island</dt>
                      <dd className="text-sm text-gray-900">{provider.clinic.island}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bio</h3>
                <p className="text-gray-700">{provider.bio}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}