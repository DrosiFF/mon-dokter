'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  island: string;
  logoUrl?: string;
  createdAt: string;
  _count: {
    providers: number;
    services: number;
  };
}

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinicDetails, setClinicDetails] = useState<{
    providers: Array<{
      id: string;
      profile: { name: string };
      specialties: string[];
      services: number;
      recentBookings: number;
    }>;
    services: Array<{
      id: string;
      name: string;
      price: number;
      isActive: boolean;
      bookings: number;
    }>;
    recentBookings: Array<{
      id: string;
      patientName: string;
      serviceName: string;
      date: string;
      status: string;
    }>;
  } | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinicDetails = async (clinicId: string) => {
    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}/details`);
      if (response.ok) {
        const data = await response.json();
        setClinicDetails(data);
      } else {
        // No mock data - show empty state for real testing
        setClinicDetails({
          providers: [],
          services: [],
          recentBookings: []
        });
      }
    } catch (error) {
      console.error('Error fetching clinic details:', error);
    }
  };

  const fetchClinics = async () => {
    try {
      const response = await fetch('/api/admin/clinics');
      
      if (response.ok) {
        const data = await response.json();
        setClinics(data);
      } else {
        // No mock data - show empty state for real testing
        setClinics([]);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
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
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Clinic Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage healthcare clinics across the Seychelles
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Clinic
          </button>
        </div>
      </div>

      {/* Clinics grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
            <div className="p-6">
              {/* Clinic Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-sm text-gray-500">/{clinic.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      setSelectedClinic(clinic);
                      fetchClinicDetails(clinic.id);
                    }}
                    className="p-1 text-gray-400 hover:text-cyan-600"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-cyan-600"
                    title="Edit Clinic"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete Clinic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clinic Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <p>{clinic.address}</p>
                    <p className="text-cyan-600 font-medium">{clinic.island}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <a href={`tel:${clinic.phone}`} className="hover:text-cyan-600">
                    {clinic.phone}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {clinic._count.providers}
                  </div>
                  <div className="text-sm text-gray-600">Providers</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {clinic._count.services}
                  </div>
                  <div className="text-sm text-gray-600">Services</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Created {new Date(clinic.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <a
                    href={`/clinics/${clinic.slug}`}
                    target="_blank"
                    className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    View Public Page →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {clinics.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clinics found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first clinic.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Clinic
            </button>
          </div>
        </div>
      )}

      {/* Create Clinic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Add New Clinic</h3>
              </div>
              
              <div className="px-6 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter clinic name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Full address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Island
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="Mahé">Mahé</option>
                        <option value="Praslin">Praslin</option>
                        <option value="La Digue">La Digue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="+248 4 123 456"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                    Create Clinic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Details Modal */}
      {selectedClinic && clinicDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => {
              setSelectedClinic(null);
              setClinicDetails(null);
            }} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedClinic.name} - Detailed View
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedClinic(null);
                      setClinicDetails(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6 space-y-8">
                {/* Providers Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Providers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinicDetails.providers.map((provider) => (
                      <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{provider.profile.name}</h5>
                          <span className="text-sm text-gray-500">{provider.services} services</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.specialties.map((specialty: string) => (
                            <span key={specialty} className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{provider.recentBookings} bookings this month</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Services & Booking Status</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {clinicDetails.services.map((service) => (
                          <tr key={service.id}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{service.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">€{service.price}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {service.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{service.bookings} total</td>
                            <td className="px-4 py-3 text-sm space-x-2">
                              <button className="text-cyan-600 hover:text-cyan-900">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Bookings Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h4>
                  <div className="space-y-3">
                    {clinicDetails.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.patientName}</p>
                          <p className="text-sm text-gray-600">{booking.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{booking.date}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
