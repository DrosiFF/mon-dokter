'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Filter, Users, ChevronDown, Star, Navigation } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import LanguagePicker from '../../components/LanguagePicker'
import BookingWidget from '../../components/BookingWidget'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

// Seychelles islands with pharmacies
const seychellesIslands = [
  { name: 'Mahé', pharmacies: 8, mainCity: 'Victoria' },
  { name: 'Praslin', pharmacies: 3, mainCity: 'Grand Anse' },
  { name: 'La Digue', pharmacies: 2, mainCity: 'La Passe' },
  { name: 'Silhouette', pharmacies: 1, mainCity: 'La Passe' },
  { name: 'Cerf Island', pharmacies: 1, mainCity: 'Cerf Resort' },
  { name: 'Round Island', pharmacies: 1, mainCity: 'Round Island Resort' }
]

// Medical specialties for search suggestions
const medicalSpecialties = [
  'General Practitioner',
  'Gynecologist',
  'Orthopedic Surgeon',
  'Dermatologist',
  'Nutritionist',
  'Psychologist',
  'Ophthalmologist',
  'Urologist',
  'ENT Specialist',
  'Cardiologist',
  'Dentist',
  'General Surgeon',
  'Osteopath',
  'Internist',
  'Cosmetic Doctor',
  'Endocrinologist',
  'Gastroenterologist',
  'Neurologist',
  'Neurosurgeon',
  'Physiotherapist',
  'Psychotherapist',
  'Plastic Surgeon',
  'Psychiatrist',
  'Pediatrician',
  'Podiatrist',
  'Rheumatologist',
  'Pulmonologist',
  'Physiatrist',
  'Vascular Surgeon',
  'Dietitian',
  'Andrologist',
  'Allergist',
  'Radiologist',
  'Proctologist',
  'Angiologist',
  'Hematologist',
  'Breast Specialist',
  'Dietologist',
  'Geriatrician',
  'Sports Medicine Doctor',
  'Acupuncturist',
  'Oncologist',
  'Primary Care Pediatrician',
  'Nephrologist',
  'Clinical Psychologist',
  'Surgeon',
  'Diabetologist',
  'Speech Therapist',
  'Chiropractor',
  'Cardiac Surgeon',
  'Maxillofacial Surgeon',
  'Forensic Doctor',
  'Child Neuropsychiatrist',
  'Orthodontist',
  'Anesthesiologist',
  'Cosmetic Surgeon',
  'Pain Therapist',
  'Ultrasonographer',
  'Midwife',
  'Occupational Health Doctor',
  'Homeopath',
  'Sexologist',
  'Infectious Disease Specialist',
  'Hepatologist',
  'Thoracic Surgeon',
  'Diagnostic Radiologist',
  'Pediatric Surgeon',
  'Massage Therapist',
  'Spine Surgeon',
  'Orthoptist',
  'Posturologist',
  'Medical Examiner',
  'Health Technician',
  'Therapist',
  'Trichologist',
  'Phoniatrician',
  'Professional Counselor',
  'Nurse',
  'Immunologist',
  'Dental Hygienist',
  'Medical Geneticist',
  'Reproductive Biologist',
  'Neuropsychologist',
  'Pathologist',
  'Radiation Therapist',
  'Nuclear Medicine Doctor',
  'Kinesiologist',
  'Blood Donation Specialist',
  'Stomatologist',
  'Radiology Technician',
  'COVID Test Specialist',
  'Clinical Analyst',
  'Hearing Aid Specialist',
  'Epidemiologist',
  'Venereologist',
  'Dental Technician'
]

// Mock pharmacy data for search page
const mockPharmacies = [
  {
    id: '1',
    name: 'Victoria Central Pharmacy',
    address: 'Independence Avenue, Victoria',
    island: 'Mahé',
    rating: 4.8,
    reviews: 127,
    openHours: '07:00 - 21:00',
    services: ['Tourist prescriptions', 'Travel medications', 'Suncare & tropical health', 'Resort delivery'],
    phone: '+248 4 225 500',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881',
    specialty: 'Main tourist hub - multilingual staff'
  },
  {
    id: '2',
    name: 'Beau Vallon Beach Pharmacy',
    address: 'Beau Vallon Beach Road',
    island: 'Mahé',
    rating: 4.9,
    reviews: 203,
    openHours: '08:00 - 22:00',
    services: ['Beach resort delivery', 'Emergency dive medicine', 'Tropical disease prevention', 'Sunburn treatment'],
    phone: '+248 4 247 800',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926',
    specialty: 'Beach & water sports specialists'
  },
  {
    id: '3',
    name: 'Praslin Paradise Pharmacy',
    address: 'Anse Volbert Village',
    island: 'Praslin',
    rating: 4.7,
    reviews: 89,
    openHours: '08:00 - 20:00',
    services: ['Island hopping medical kit', 'Coco de Mer wellness products', 'Snorkeling safety', 'Hotel partnerships'],
    phone: '+248 4 232 100',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    specialty: 'Nature reserve health specialists'
  }
]

// Mock data for demonstration
const mockDoctors = [
  {
    id: '1',
    slug: 'dr-marie-louise-chan',
    firstName: 'Dr. Marie-Louise',
    lastName: 'Chan',
    specialty: 'Tropical Medicine & Tourism Health',
    clinic: 'Seychelles International Medical Centre',
    city: 'Victoria, Mahé',
    rating: 4.9,
    bio: 'Specialist in tropical diseases and tourist health services. Fluent in English, French & Creole.',
    image: '/images/placeholders/doctor-female.svg',
    services: ['Travel medicine', 'Diving medical exams', 'Tropical disease treatment']
  },
  {
    id: '2',
    slug: 'dr-jean-baptiste-morel',
    firstName: 'Dr. Jean-Baptiste',
    lastName: 'Morel',
    specialty: 'Emergency & Marine Medicine',
    clinic: 'Beau Vallon Medical Centre',
    city: 'Beau Vallon, Mahé',
    rating: 4.8,
    bio: 'Emergency physician specializing in marine injuries and water sports medicine.',
    image: '/images/placeholders/doctor-male.svg',
    services: ['Emergency care', 'Dive medicine', 'Marine injury treatment']
  },
  {
    id: '3',
    slug: 'dr-priya-patel',
    firstName: 'Dr. Priya',
    lastName: 'Patel',
    specialty: 'Dermatology & Sun Care',
    clinic: 'Praslin Health Clinic',
    city: 'Grand Anse, Praslin',
    rating: 4.7,
    bio: 'Dermatologist specializing in tropical skin conditions and sun damage prevention.',
    image: '/images/placeholders/doctor-specialist.svg',
    services: ['Skin cancer screening', 'Sunburn treatment', 'Tropical skin conditions']
  },
  {
    id: '4',
    slug: 'dr-antoine-labouche',
    firstName: 'Dr. Antoine',
    lastName: 'Labouche',
    specialty: 'Family Medicine & Island Health',
    clinic: 'La Digue Community Clinic',
    city: 'La Passe, La Digue',
    rating: 4.6,
    bio: 'Family doctor serving the La Digue community and eco-tourists with comprehensive care.',
    image: '/images/placeholders/doctor-male.svg',
    services: ['Family medicine', 'Eco-tourism health', 'Preventive care']
  }
]

export default function SearchPage() {
  const { selectedLanguage } = useLanguage()
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [islandQuery, setIslandQuery] = useState('')
  const [showIslandDropdown, setShowIslandDropdown] = useState(false)
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false)
  const [_selectedIsland, setSelectedIsland] = useState('')
  const [serviceType, setServiceType] = useState<'clinic' | 'pharmacy'>('clinic')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const specialtyDropdownRef = useRef<HTMLDivElement>(null)

  // Read specialty from URL parameters and populate search input
  useEffect(() => {
    const specialty = searchParams.get('specialty')
    if (specialty) {
      setSearchQuery(specialty)
    }
  }, [searchParams])

  // Force input to update when serviceType changes
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.placeholder = serviceType === 'clinic' 
        ? getTranslation(selectedLanguage.code, 'searchPlaceholderClinic')
        : getTranslation(selectedLanguage.code, 'searchPlaceholderPharmacy')
    }
  }, [serviceType, selectedLanguage.code])

  const filteredIslands = seychellesIslands.filter(island =>
    island.name.toLowerCase().includes(islandQuery.toLowerCase())
  )

  // Filter medical specialties based on search query (only for clinic service type)
  const filteredSpecialties = serviceType === 'clinic' 
    ? medicalSpecialties.filter(specialty =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase()) && 
        searchQuery.length > 0
      ).slice(0, 12) // Limit to 12 suggestions
    : []

  const handleIslandSelect = (island: typeof seychellesIslands[0]) => {
    setSelectedIsland(island.name)
    setIslandQuery(island.name)
    setShowIslandDropdown(false)
  }

  const handleSpecialtySelect = (specialty: string) => {
    setSearchQuery(specialty)
    setShowSpecialtyDropdown(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIslandDropdown(false)
      }
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target as Node)) {
        setShowSpecialtyDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - iPhone optimized */}
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
            {/* Mobile menu - Language picker only */}
            <div className="sm:hidden">
              <LanguagePicker variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - iPhone optimized */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-emerald-500 py-16 sm:py-20 relative overflow-hidden">
        
        {/* Subtle Seychelles Flag Background with Medical Symbol - Mobile optimized */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            className="absolute top-4 right-4 w-20 h-12 sm:top-8 sm:right-8 sm:w-32 sm:h-20 lg:w-48 lg:h-30 xl:w-64 xl:h-40 transform rotate-12" 
            viewBox="0 0 300 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Seychelles Flag */}
            <defs>
              <filter id="flagShadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <g filter="url(#flagShadow2)">
              <polygon points="0,0 300,0 240,40 0,40" fill="#003893" fillOpacity="0.8"/>
              <polygon points="0,40 240,40 180,80 0,80" fill="#FCD116" fillOpacity="0.8"/>
              <polygon points="0,80 180,80 120,120 0,120" fill="#D62D20" fillOpacity="0.8"/>
              <polygon points="0,120 120,120 60,160 0,160" fill="#FFFFFF" fillOpacity="0.8"/>
              <polygon points="0,160 60,160 0,200" fill="#007A3D" fillOpacity="0.8"/>
            </g>
          </svg>
          
          {/* Medical Stethoscope Symbol - Mobile optimized */}
          <svg 
            className="absolute bottom-8 left-4 w-16 h-16 sm:bottom-12 sm:left-8 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 transform -rotate-6 opacity-40" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stethoscope */}
            <path d="M25 15 C20 12, 20 8, 25 8 C30 8, 35 12, 40 15" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M40 15 L50 25" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round"/>
            <path d="M25 15 L35 25" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="45" cy="30" r="8" fill="#0ea5e9" stroke="white" strokeWidth="2"/>
            <circle cx="45" cy="30" r="4" fill="white"/>
            {/* Small flag overlay */}
            <g transform="translate(60,10) scale(0.3)" opacity="0.8">
              <polygon points="0,0 60,0 48,8 0,8" fill="#003893"/>
              <polygon points="0,8 48,8 36,16 0,16" fill="#FCD116"/>
              <polygon points="0,16 36,16 24,24 0,24" fill="#D62D20"/>
              <polygon points="0,24 24,24 12,32 0,32" fill="#FFFFFF"/>
              <polygon points="0,32 12,32 0,40" fill="#007A3D"/>
            </g>
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              {getTranslation(selectedLanguage.code, 'searchTitle')}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-white/90 leading-relaxed font-medium">
              {getTranslation(selectedLanguage.code, 'searchSubtitle')}
            </p>
          </div>

          
          <div className="mt-6 sm:mt-8 mx-auto max-w-sm sm:max-w-3xl px-3 relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 relative">
              <div className="flex-1 relative" ref={specialtyDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (serviceType === 'clinic' && e.target.value.length > 0) {
                        setShowSpecialtyDropdown(true)
                      } else {
                        setShowSpecialtyDropdown(false)
                      }
                    }}
                    onFocus={() => {
                      if (serviceType === 'clinic' && searchQuery.length > 0) {
                        setShowSpecialtyDropdown(true)
                      }
                    }}
                    placeholder={serviceType === 'clinic' 
                      ? getTranslation(selectedLanguage.code, 'searchPlaceholderClinic')
                      : getTranslation(selectedLanguage.code, 'searchPlaceholderPharmacy')
                    }
                    className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl bg-white/98 backdrop-blur-md text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/60 focus:outline-none shadow-2xl text-base font-medium transition-all duration-300 focus:shadow-3xl"
                  />
                </div>
                
                {/* Specialty Suggestions Dropdown */}
                {showSpecialtyDropdown && filteredSpecialties.length > 0 && (
                  <div 
                    className="specialty-dropdown absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-2xl shadow-2xl z-[9999] max-h-80 overflow-y-auto"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d1d5db #f3f4f6'
                    }}
                  >
                    <div className="py-2">
                      {filteredSpecialties.map((specialty, index) => (
                        <button
                          key={index}
                          onClick={() => handleSpecialtySelect(specialty)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0 text-sm"
                        >
                          <div className="font-medium text-gray-900">{specialty}</div>
                        </button>
                      ))}
                    </div>
                    {/* Visual indicator for more items */}
                    {filteredSpecialties.length >= 12 && (
                      <div className="text-center py-2 text-xs text-gray-500 border-t border-gray-100">
                        Scroll to see more suggestions
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 relative" ref={dropdownRef}>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Select Island"
                    value={islandQuery}
                    onChange={(e) => {
                      setIslandQuery(e.target.value)
                      setShowIslandDropdown(true)
                    }}
                    onFocus={() => setShowIslandDropdown(true)}
                    className="w-full pl-12 pr-12 py-4 sm:py-5 rounded-2xl bg-white/98 backdrop-blur-md text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/60 focus:outline-none shadow-2xl text-base font-medium transition-all duration-300 focus:shadow-3xl"
                  />
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                {/* Island Dropdown */}
                {showIslandDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {filteredIslands.length > 0 ? (
                      filteredIslands.map((island) => (
                        <button
                          key={island.name}
                          onClick={() => handleIslandSelect(island)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{island.name}</div>
                              <div className="text-sm text-gray-500">{island.mainCity}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-emerald-600">
                                {serviceType === 'clinic' 
                                  ? `${island.pharmacies + 2} doctors`
                                  : `${island.pharmacies} pharmacies`
                                }
                              </div>
                              <div className="text-xs text-gray-400">available</div>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No islands found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-white/98 backdrop-blur-md text-blue-600 rounded-2xl font-black hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl text-base min-h-[56px] hover:shadow-3xl active:scale-95">
                <Search className="h-5 w-5" />
                {getTranslation(selectedLanguage.code, 'search')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Type Toggle - iPhone optimized */}
      <div className="bg-white/95 backdrop-blur-md py-4 sm:py-8 border-b border-gray-100 sticky top-14 sm:top-18 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto">
            <button
              onClick={() => {
                console.log('Clinic button clicked, current serviceType:', serviceType)
                setServiceType('clinic')
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer min-h-[48px] active:scale-95 ${
                serviceType === 'clinic'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl scale-105 shadow-blue-500/25'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105 border border-gray-200'
              }`}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-base font-black">{getTranslation(selectedLanguage.code, 'clinic')}</span>
            </button>
            <button
              onClick={() => {
                console.log('Pharmacy button clicked, current serviceType:', serviceType)
                setServiceType('pharmacy')
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer min-h-[48px] active:scale-95 ${
                serviceType === 'pharmacy'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-2xl scale-105 shadow-emerald-500/25'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105 border border-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
              <span className="text-xs sm:text-base font-black">{getTranslation(selectedLanguage.code, 'pharmacy')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Section - iPhone optimized */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">
            {serviceType === 'clinic' 
              ? `${mockDoctors.length} ${getTranslation(selectedLanguage.code, 'doctorsFound')}`
              : `${mockPharmacies.length} ${getTranslation(selectedLanguage.code, 'pharmaciesFound')}`
            }
            <span className="block sm:inline text-xs text-gray-500 sm:ml-2 font-medium">(Current: {serviceType})</span>
          </h2>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold min-h-[44px] justify-center sm:justify-start bg-white shadow-sm hover:shadow-md active:scale-95">
            <Filter className="h-4 w-4" />
            {getTranslation(selectedLanguage.code, 'filters')}
          </button>
        </div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {serviceType === 'clinic' ? (
            // Doctor cards
            mockDoctors.map((doctor) => (
              <BookingWidget
                key={doctor.id}
                providerId={doctor.id}
                providerName={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                providerType="clinic"
                simplybookUrl="https://simplybook.me/en/"
                location={`${doctor.clinic}, ${doctor.city}`}
                rating={doctor.rating}
                specialties={doctor.services || [doctor.specialty]}
              />
            ))
          ) : (
            // Pharmacy cards
            mockPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="mb-4">
                  <Image
                    src={pharmacy.image}
                    alt={pharmacy.name}
                    width={400}
                    height={128}
                    className="w-full h-28 sm:h-32 object-cover rounded-xl mb-4 shadow-md"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                      {pharmacy.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                      <span className="text-xs sm:text-sm font-bold text-yellow-700">{pharmacy.rating}</span>
                    </div>
                  </div>
                  <p className="text-emerald-600 font-bold text-xs sm:text-sm mb-2">{pharmacy.specialty}</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span className="font-medium">{pharmacy.address}, {pharmacy.island}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pharmacy.services && pharmacy.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-100"
                      >
                        {service}
                      </span>
                    ))}
                    {pharmacy.services && pharmacy.services.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full font-medium border border-gray-200">
                        +{pharmacy.services.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-sm text-center font-bold shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {getTranslation(selectedLanguage.code, 'call')}
                  </a>
                  <button className="px-4 py-3 border border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                    <Navigation className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Healthcare Specialties Section */}
      <div className="py-16 sm:py-20 bg-gray-50">
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
            {/* Medical Clinics & Doctors */}
            <div 
              onClick={() => setSearchQuery('Medical Clinics & Doctors')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-cyan-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Medical Clinics & Doctors</h3>
              </div>
            </div>

            {/* Dentists */}
            <div 
              onClick={() => setSearchQuery('Dentists')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Dentists</h3>
              </div>
            </div>

            {/* Chiropractics */}
            <div 
              onClick={() => setSearchQuery('Chiropractics')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Chiropractics</h3>
              </div>
            </div>

            {/* Acupuncture */}
            <div 
              onClick={() => setSearchQuery('Acupuncture')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Acupuncture</h3>
              </div>
            </div>

            {/* Massage */}
            <div 
              onClick={() => setSearchQuery('Massage')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-pink-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Massage</h3>
              </div>
            </div>

            {/* Physiologists */}
            <div 
              onClick={() => setSearchQuery('Physiologists')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Physiologists</h3>
              </div>
            </div>

            {/* Psychologists */}
            <div 
              onClick={() => setSearchQuery('Psychologists')}
              className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Psychologists</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
