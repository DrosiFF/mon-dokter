'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../lib/LanguageContext';
import { translations } from '../../../lib/translations';

interface ProviderOnboardingData {
  name: string;
  bio: string;
  specialties: string[];
  phone: string;
  clinicName: string;
  clinicAddress: string;
  island: string;
  simplybookCompany?: string;
  simplybookApiUser?: string;
  simplybookApiKey?: string;
}

const SEYCHELLES_ISLANDS = [
  'Mahé',
  'Praslin',
  'La Digue',
  'Silhouette',
  'Curieuse',
  'Bird Island',
  'Denis Island',
  'Other'
];

const MEDICAL_SPECIALTIES = [
  'General Medicine',
  'Gynecology',
  'Orthopedics',
  'Dermatology',
  'Nutrition',
  'Psychology',
  'Ophthalmology',
  'Urology',
  'ENT (Ear, Nose, Throat)',
  'Cardiology',
  'Dentistry',
  'General Surgery',
  'Osteopathy',
  'Internal Medicine',
  'Aesthetic Medicine',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Neurosurgery',
  'Physiotherapy',
  'Psychotherapy',
  'Plastic Surgery',
  'Psychiatry',
  'Pediatrics',
  'Podiatry',
  'Rheumatology',
  'Pulmonology',
  'Physiatry'
];

export default function ProviderOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const t = translations[selectedLanguage.code as keyof typeof translations];

  const [formData, setFormData] = useState<ProviderOnboardingData>({
    name: user?.fullName || '',
    bio: '',
    specialties: [],
    phone: '',
    clinicName: '',
    clinicAddress: '',
    island: 'Mahé',
    simplybookCompany: '',
    simplybookApiUser: '',
    simplybookApiKey: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProviderOnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to apply as a provider');
      return;
    }

    if (formData.specialties.length === 0) {
      setError('Please select at least one specialty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/provider/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      // Redirect to success page or dashboard
      router.push('/onboarding/provider/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <p className="text-gray-600">You need to be logged in to apply as a healthcare provider.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Healthcare Provider Application</h1>
              <p className="mt-2 text-gray-600">
                Join MON DOKTER as a healthcare provider in Seychelles
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell patients about your experience, qualifications, and approach to healthcare..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Specialties *</h2>
                <p className="text-sm text-gray-600 mb-4">Select all specialties that apply to your practice:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {MEDICAL_SPECIALTIES.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clinic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clinicName}
                      onChange={(e) => handleInputChange('clinicName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Island *
                    </label>
                    <select
                      required
                      value={formData.island}
                      onChange={(e) => handleInputChange('island', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {SEYCHELLES_ISLANDS.map((island) => (
                        <option key={island} value={island}>{island}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.clinicAddress}
                    onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                    placeholder="Full address including district and postal code..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* SimplyBook Integration (Optional) */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Integration (Optional)
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  If you already have a SimplyBook.me account, provide your credentials to sync bookings:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Alias
                    </label>
                    <input
                      type="text"
                      value={formData.simplybookCompany}
                      onChange={(e) => handleInputChange('simplybookCompany', e.target.value)}
                      placeholder="your-clinic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API User
                    </label>
                    <input
                      type="text"
                      value={formData.simplybookApiUser}
                      onChange={(e) => handleInputChange('simplybookApiUser', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={formData.simplybookApiKey}
                      onChange={(e) => handleInputChange('simplybookApiKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
