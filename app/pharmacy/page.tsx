'use client'

import { Search, MapPin, Filter, Clock, Star, Navigation } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LanguagePicker from '../../components/LanguagePicker'
import SimpleNavigation from '../../components/SimpleNavigation'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

// Mock pharmacy data
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
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d4c1?w=300&h=200&fit=crop',
    specialty: 'Nature reserve health specialists'
  },
  {
    id: '4',
    name: 'La Digue Island Pharmacy',
    address: 'La Passe Village Center',
    island: 'La Digue',
    rating: 4.6,
    reviews: 45,
    openHours: '08:30 - 18:00',
    services: ['Bicycle delivery', 'Eco-friendly products', 'Traditional remedies', 'Photography tour medical kits'],
    phone: '+248 4 234 300',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    specialty: 'Eco-tourism health support'
  }
]

export default function PharmacyPage() {
  const { selectedLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/search" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                {getTranslation(selectedLanguage.code, 'doctor')}
              </Link>
              <span className="text-emerald-600 font-semibold">{getTranslation(selectedLanguage.code, 'pharmacy')}</span>
              <Link 
                href="/profile" 
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {getTranslation(selectedLanguage.code, 'profile')}
              </Link>
              
              {/* Shared Language Picker */}
              <LanguagePicker variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - ONLY adding flag background, keeping original design */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 py-16 relative overflow-hidden">
        
        {/* ONLY ADDITION: Subtle Seychelles Flag Background with Pharmacy Symbol */}
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
          
          {/* Pharmacy Cross Symbol with flag */}
          <svg 
            className="absolute bottom-12 left-8 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 transform -rotate-6 opacity-40" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pharmacy cross */}
            <rect x="35" y="15" width="30" height="70" rx="15" fill="#10b981"/>
            <rect x="15" y="35" width="70" height="30" rx="15" fill="#10b981"/>
            {/* Small flag overlay */}
            <g transform="translate(65,10) scale(0.3)" opacity="0.8">
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
              {getTranslation(selectedLanguage.code, 'pharmacyNetwork')}
            </h1>
            <p className="mt-4 text-lg text-emerald-100">
              {getTranslation(selectedLanguage.code, 'pharmacyNetworkDesc')}
            </p>
          </div>

          {/* Service Type Buttons */}
          <SimpleNavigation currentPage="pharmacy" />
          
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={getTranslation(selectedLanguage.code, 'pharmacySearchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={getTranslation(selectedLanguage.code, 'islandPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 flex items-center gap-2">
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
            {mockPharmacies.length} {getTranslation(selectedLanguage.code, 'pharmaciesFound')}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            {getTranslation(selectedLanguage.code, 'filters')}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border"
            >
              <div className="mb-4">
                <Image
                  src={pharmacy.image}
                  alt={pharmacy.name}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pharmacy.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{pharmacy.rating}</span>
                    <span className="text-sm text-gray-500">({pharmacy.reviews})</span>
                  </div>
                </div>
                <p className="text-emerald-600 font-medium text-sm mb-1">{pharmacy.specialty}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{pharmacy.address}, {pharmacy.island}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4" />
                <span>{pharmacy.openHours}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {pharmacy.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {pharmacy.services.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{pharmacy.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                  {getTranslation(selectedLanguage.code, 'getDirections')}
                </button>
                <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Pharmacy Section */}
      <section className="bg-red-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4">{getTranslation(selectedLanguage.code, 'emergencyPharmacy')}</h2>
            <p className="text-red-700">{getTranslation(selectedLanguage.code, 'emergencyPharmacyDesc')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
              <h3 className="font-semibold text-red-900 mb-2">{getTranslation(selectedLanguage.code, 'emergencyHotline')}</h3>
              <p className="text-red-700 text-sm mb-3">{getTranslation(selectedLanguage.code, 'emergencyHotlineDesc')}</p>
              <a href="tel:+2484225000" className="text-red-600 font-bold text-lg hover:text-red-800">
                +248 422 5000
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
              <h3 className="font-semibold text-orange-900 mb-2">{getTranslation(selectedLanguage.code, 'resortDelivery')}</h3>
              <p className="text-orange-700 text-sm mb-3">{getTranslation(selectedLanguage.code, 'resortDeliveryDesc')}</p>
              <a href="tel:+2484247800" className="text-orange-600 font-bold text-lg hover:text-orange-800">
                +248 424 7800
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
              <h3 className="font-semibold text-green-900 mb-2">{getTranslation(selectedLanguage.code, 'touristSupport')}</h3>
              <p className="text-green-700 text-sm mb-3">{getTranslation(selectedLanguage.code, 'touristSupportDesc')}</p>
              <a href="tel:+2484232100" className="text-green-600 font-bold text-lg hover:text-green-800">
                +248 423 2100
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}