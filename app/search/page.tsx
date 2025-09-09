'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Filter, Users, ChevronDown, Star } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import LanguagePicker from '../../components/LanguagePicker'
import BookingWidget from '../../components/BookingWidget'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

// Medical specialties for search suggestions
const medicalSpecialties = [
  'General Practitioner',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Gynecologist',
  'Orthopedic Surgeon',
  'Dentist',
  'Ophthalmologist',
  'Neurologist',
  'Psychiatrist',
  'Physiotherapist',
  'Psychologist'
]

export default function SearchPage() {
  const { user } = useUser()
  const { selectedLanguage } = useLanguage()
  const searchParams = useSearchParams()
  const [serviceType, setServiceType] = useState('clinic')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Real providers will be loaded from Supabase
  const [realProviders, setRealProviders] = useState([])
  const [loading, setLoading] = useState(false)

  // Load real providers from Supabase
  useEffect(() => {
    const loadProviders = async () => {
      if (serviceType !== 'clinic') return // Only load for clinic for now
      
      setLoading(true)
      try {
        const response = await fetch(`/api/providers/search?type=${serviceType}&specialty=${encodeURIComponent(searchQuery)}`)
        const result = await response.json()
        
        if (result.success) {
          setRealProviders(result.providers)
        } else {
          console.error('Failed to load providers:', result.error)
          setRealProviders([])
        }
      } catch (error) {
        console.error('Error loading providers:', error)
        setRealProviders([])
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, [serviceType, searchQuery])

  // Get URL parameters to pre-populate search
  useEffect(() => {
    const specialty = searchParams.get('specialty')
    if (specialty) {
      setSearchQuery(specialty)
    }
  }, [searchParams])

  // Filter specialties based on search input
  const filteredSpecialties = medicalSpecialties.filter(specialty =>
    specialty.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8) // Limit to 8 suggestions

  // Handle specialty selection
  const handleSpecialtySelect = (specialty: string) => {
    setSearchQuery(specialty)
    setShowSpecialtyDropdown(false)
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSpecialtyDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  {getTranslation(selectedLanguage.code, 'clinic')}
                </Link>
                <Link href="/pharmacy" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                  {getTranslation(selectedLanguage.code, 'pharmacy')}
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  {getTranslation(selectedLanguage.code, 'profile')}
                </Link>
                <Link
                  href="/provider-signup"
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
                >
                  Join as Provider
                </Link>
                <LanguagePicker variant="header" />
              </div>
              {user ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              ) : (
                <Link
                  href="/sign-in"
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Service Type Toggle */}
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setServiceType('clinic')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                  serviceType === 'clinic'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {getTranslation(selectedLanguage.code, 'clinic')}
              </button>
              <button
                onClick={() => setServiceType('pharmacy')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                  serviceType === 'pharmacy'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {getTranslation(selectedLanguage.code, 'pharmacy')}
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={`rounded-3xl p-8 sm:p-12 mb-12 transition-all duration-500 ${
          serviceType === 'clinic' 
            ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500' 
            : 'bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500'
        }`}>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                {serviceType === 'clinic' 
                  ? getTranslation(selectedLanguage.code, 'findBestDoctors')
                  : getTranslation(selectedLanguage.code, 'findBestPharmacies')
                }
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-cyan-100 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                {serviceType === 'clinic'
                  ? getTranslation(selectedLanguage.code, 'searchDoctorsDescription')
                  : getTranslation(selectedLanguage.code, 'searchPharmaciesDescription')
                }
              </p>
            </div>

            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSpecialtyDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSpecialtyDropdown(searchQuery.length > 0)}
                  className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 text-base sm:text-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-cyan-200 focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
                  placeholder={serviceType === 'clinic' 
                    ? getTranslation(selectedLanguage.code, 'searchDoctorsPlaceholder')
                    : getTranslation(selectedLanguage.code, 'searchPharmaciesPlaceholder')
                  }
                />
              </div>

              {/* Specialty Dropdown for Clinics */}
              {serviceType === 'clinic' && showSpecialtyDropdown && filteredSpecialties.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto z-50 specialty-dropdown">
                  {filteredSpecialties.map((specialty, index) => (
                    <button
                      key={index}
                      onClick={() => handleSpecialtySelect(specialty)}
                      className="w-full text-left px-4 py-3 hover:bg-cyan-50 hover:text-cyan-700 transition-colors text-gray-700 border-b border-gray-50 last:border-b-0"
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {serviceType === 'clinic' ? 'Healthcare Providers' : 'Pharmacies'}
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Filter className="h-4 w-4" />
              {getTranslation(selectedLanguage.code, 'filters')}
            </button>
          </div>

          <div className="grid gap-4 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {serviceType === 'clinic' ? (
              loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading healthcare providers...</p>
                </div>
              ) : realProviders.length > 0 ? (
                // Real provider cards from Supabase
                realProviders.map((provider) => (
                  <BookingWidget
                    key={provider.id}
                    providerId={provider.id}
                    providerName={`${provider.firstName} ${provider.lastName}`}
                    providerType="clinic"
                    simplybookUrl={provider.simplybookUrl || "https://simplybook.me/en/"}
                    location={`${provider.clinic}, ${provider.city}`}
                    rating={provider.rating}
                    specialties={provider.services || [provider.specialty]}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No healthcare providers found</p>
                    <p className="text-sm">Try adjusting your search or check back later.</p>
                  </div>
                  <Link 
                    href="/provider-signup"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    <Users className="w-4 h-4" />
                    Join as Healthcare Provider
                  </Link>
                </div>
              )
            ) : (
              // Pharmacy section - coming soon
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Pharmacy listings coming soon!</p>
                  <p className="text-sm">We're working on adding pharmacy providers to the platform.</p>
                </div>
                <Link 
                  href="/provider-signup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  Join as Pharmacy Provider
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Healthcare Specialties Section */}
        <div className="py-16 sm:py-20 bg-gray-50 rounded-3xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:max-w-4xl mb-12 sm:mb-16">
              <h2 className="text-sm sm:text-base font-bold leading-7 text-cyan-600 flex items-center justify-center gap-2 tracking-wide uppercase">
                Healthcare Specialties
              </h2>
              <p className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Browse by specialty
              </p>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
                Find the right healthcare professional for your specific needs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
              {/* Medical Specialties */}
              {['General Practice', 'Dentist', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedics', 'Psychology'].map((specialty, index) => (
                <Link 
                  key={specialty}
                  href={`/search?specialty=${encodeURIComponent(specialty)}`}
                  className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-cyan-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{specialty}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}