'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Filter, Users, ChevronDown, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../components/Logo'
import LanguagePicker from '../../components/LanguagePicker'
import SimpleNavigation from '../../components/SimpleNavigation'
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
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
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
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
    image: 'https://images.unsplash.com/photo-1594824375037-8abcb5ac8f86?w=300&h=300&fit=crop&crop=face',
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
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    services: ['Family medicine', 'Eco-tourism health', 'Preventive care']
  }
]

export default function SearchPage() {
  const { selectedLanguage } = useLanguage()
  const [islandQuery, setIslandQuery] = useState('')
  const [showIslandDropdown, setShowIslandDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredIslands = seychellesIslands.filter(island =>
    island.name.toLowerCase().includes(islandQuery.toLowerCase())
  )

  const handleIslandSelect = (island: typeof seychellesIslands[0]) => {
    setSelectedIsland(island.name)
    setIslandQuery(island.name)
    setShowIslandDropdown(false)
  }

  // Close island dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIslandDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="md" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-700 hover:text-emerald-600 transition-colors">
                {getTranslation(selectedLanguage.code, 'profile')}
              </Link>
              
              {/* Shared Language Picker */}
              <LanguagePicker variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Same style as pharmacy page */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-emerald-500 py-16 relative overflow-hidden">
        
        {/* ONLY ADDITION: Subtle Seychelles Flag Background with Medical Symbol */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            className="absolute top-8 right-8 w-32 h-20 sm:w-48 sm:h-30 lg:w-64 lg:h-40 transform rotate-12" 
            viewBox="0 0 300 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Seychelles Flag */}
            <defs>
              <filter id="flagShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <g filter="url(#flagShadow)">
              <polygon points="0,0 300,0 240,40 0,40" fill="#003893" fillOpacity="0.8"/>
              <polygon points="0,40 240,40 180,80 0,80" fill="#FCD116" fillOpacity="0.8"/>
              <polygon points="0,80 180,80 120,120 0,120" fill="#D62D20" fillOpacity="0.8"/>
              <polygon points="0,120 120,120 60,160 0,160" fill="#FFFFFF" fillOpacity="0.8"/>
              <polygon points="0,160 60,160 0,200" fill="#007A3D" fillOpacity="0.8"/>
            </g>
          </svg>
          
          {/* Medical Stethoscope Symbol with flag */}
          <svg 
            className="absolute bottom-12 left-8 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 transform -rotate-6 opacity-40" 
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
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {getTranslation(selectedLanguage.code, 'searchTitle')}
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              {getTranslation(selectedLanguage.code, 'searchSubtitle')}
            </p>
          </div>

          {/* Service Type Buttons */}
          <SimpleNavigation currentPage="search" />
          
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={getTranslation(selectedLanguage.code, 'searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1 relative" ref={dropdownRef}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Island"
                    value={islandQuery}
                    onChange={(e) => {
                      setIslandQuery(e.target.value)
                      setShowIslandDropdown(true)
                    }}
                    onFocus={() => setShowIslandDropdown(true)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                  />
                  <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                
                {/* Island Dropdown */}
                {showIslandDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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
                                {island.pharmacies} pharmacies
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
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
                <Search className="h-5 w-5" />
                {getTranslation(selectedLanguage.code, 'search')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mockDoctors.length} {getTranslation(selectedLanguage.code, 'doctorsFound')}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            {getTranslation(selectedLanguage.code, 'filters')}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border"
            >
              <div className="mb-4">
                <Image
                  src={doctor.image}
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{doctor.clinic}, {doctor.city}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {doctor.services && doctor.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {doctor.services && doctor.services.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{doctor.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href={`/book/${doctor.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                >
                  {getTranslation(selectedLanguage.code, 'bookAppointment')}
                </Link>
                <Link
                  href={`/doctor/${doctor.slug}`}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Users className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
