'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  Pill,
  Heart
} from 'lucide-react'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

export default function ProviderSignupPage() {
  const { user } = useUser()
  const { selectedLanguage } = useLanguage()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    island: '',
    specialties: [],
    description: '',
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '09:00', close: '13:00', closed: true }
    }
  })

  const businessTypes = [
    { id: 'clinic', name: 'Medical Clinic', icon: Stethoscope, description: 'General practice, specialists, diagnostics' },
    { id: 'pharmacy', name: 'Pharmacy', icon: Pill, description: 'Medication dispensing, health products' },
    { id: 'wellness', name: 'Wellness Center', icon: Heart, description: 'Spa, massage, alternative medicine' }
  ]

  const seychellesIslands = [
    'Mahé', 'Praslin', 'La Digue', 'Silhouette', 'North Island', 
    'Bird Island', 'Denis Island', 'Frégate Island', 'Other'
  ]

  const medicalSpecialties = [
    'General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 
    'Gynecology', 'Orthopedics', 'Dentistry', 'Ophthalmology',
    'Tropical Medicine', 'Emergency Medicine', 'Physiotherapy',
    'Psychology', 'Nutrition', 'Pharmacy Services'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleSubmit = async () => {
    // Here we would integrate with SimplyBook.me API to create the provider account
    console.log('Creating SimplyBook.me account for:', formData)
    
    // Simulate API call
    setTimeout(() => {
      setStep(4) // Success step
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <div className="text-sm text-gray-600">
              {getTranslation(selectedLanguage.code, 'providerSignup') || 'Provider Registration'}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 ${
                    stepNum < step ? 'bg-cyan-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {step} of 4
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What type of healthcare business do you operate?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {businessTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleInputChange('businessType', type.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.businessType === type.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <Icon className={`w-12 h-12 mb-4 ${
                        formData.businessType === type.id ? 'text-cyan-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  )
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.businessType}
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g., Victoria Medical Center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner/Manager Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="contact@clinic.sc"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number - <span className="text-xs text-gray-500">(Optional for Seychelles 🇸🇨)</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-40 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="+248 4 123 456"
                    style={{ display: 'block', visibility: 'visible' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Island Location *
                  </label>
                  <select
                    value={formData.island}
                    onChange={(e) => handleInputChange('island', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Select Island</option>
                    {seychellesIslands.map(island => (
                      <option key={island} value={island}>{island}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="123 Revolution Avenue, Victoria"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Brief description of your services and specialties..."
                />
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.businessName || !formData.ownerName || !formData.email || !formData.island || !formData.address}
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Services & Booking Setup
              </h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Your Specialties/Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicalSpecialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        formData.specialties.includes(specialty)
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-cyan-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-cyan-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  SimplyBook.me Integration Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cyan-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>24/7 online booking for your patients</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Automated SMS & email reminders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Calendar sync with Google/Outlook</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Payment processing & deposits</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>HIPAA compliant patient records</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Mobile app for staff and patients</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={formData.specialties.length === 0}
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Create Booking System <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to MON DOKTER Network!
              </h2>
              <p className="text-gray-600 mb-8">
                Your SimplyBook.me booking system is being set up. You'll receive an email with login details and setup instructions within 24 hours.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-green-900 mb-2">Next Steps:</h3>
                <ol className="text-left text-green-800 space-y-2">
                  <li>1. Check your email for SimplyBook.me account details</li>
                  <li>2. Complete your booking system setup</li>
                  <li>3. Your clinic will appear on MON DOKTER within 48 hours</li>
                  <li>4. Start receiving bookings from patients!</li>
                </ol>
              </div>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/provider-dashboard"
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/"
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
