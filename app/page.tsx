'use client'

import Link from 'next/link'
import { Search, Calendar, Users, Shield, Pill, Globe } from 'lucide-react'
import LanguagePicker from '../components/LanguagePicker'
import { useLanguage } from '../lib/LanguageContext'
import { getTranslation } from '../lib/translations'

export default function HomePage() {
  const { selectedLanguage } = useLanguage()

  return (
    <main className="flex-1">
      {/* Hero Section - Mobile First Design */}
      <section className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 overflow-hidden">
        {/* Subtle Seychelles Flag Background */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            className="absolute top-8 right-8 w-32 h-20 sm:w-48 sm:h-30 lg:w-64 lg:h-40 transform rotate-12" 
            viewBox="0 0 300 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Seychelles Flag - Blue, Yellow, Red, White, Green stripes */}
            <defs>
              <filter id="flagShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <g filter="url(#flagShadow)">
              {/* Blue stripe */}
              <polygon points="0,0 300,0 240,40 0,40" fill="#003893" fillOpacity="0.8"/>
              {/* Yellow stripe */}
              <polygon points="0,40 240,40 180,80 0,80" fill="#FCD116" fillOpacity="0.8"/>
              {/* Red stripe */}
              <polygon points="0,80 180,80 120,120 0,120" fill="#D62D20" fillOpacity="0.8"/>
              {/* White stripe */}
              <polygon points="0,120 120,120 60,160 0,160" fill="#FFFFFF" fillOpacity="0.8"/>
              {/* Green stripe */}
              <polygon points="0,160 60,160 0,200" fill="#007A3D" fillOpacity="0.8"/>
            </g>
          </svg>
          
          {/* Additional subtle flag element on the left */}
          <svg 
            className="absolute bottom-12 left-8 w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-25 transform -rotate-6 opacity-60" 
            viewBox="0 0 300 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              {/* Simplified flag stripes */}
              <polygon points="0,0 300,0 240,40 0,40" fill="#003893" fillOpacity="0.6"/>
              <polygon points="0,40 240,40 180,80 0,80" fill="#FCD116" fillOpacity="0.6"/>
              <polygon points="0,80 180,80 120,120 0,120" fill="#D62D20" fillOpacity="0.6"/>
              <polygon points="0,120 120,120 60,160 0,160" fill="#FFFFFF" fillOpacity="0.6"/>
              <polygon points="0,160 60,160 0,200" fill="#007A3D" fillOpacity="0.6"/>
            </g>
          </svg>
        </div>
        
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Mobile-optimized hero container */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="py-20 sm:py-24 md:py-32 lg:py-40 xl:py-48">
              <div className="text-center max-w-4xl mx-auto">
                
                {/* Logo and branding - responsive sizing */}
                <div className="mb-6 sm:mb-8 flex flex-col items-center justify-center gap-1 sm:gap-2">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide">MON DOKTER</span>
                  </div>
                  <span className="text-cyan-200 text-sm sm:text-base lg:text-lg font-medium tracking-wide">
                    {getTranslation(selectedLanguage.code, 'heroSlogan')}
                  </span>
                </div>
                
                {/* Prominent Language Selector - Mobile optimized */}
                <LanguagePicker variant="hero" className="mb-6 sm:mb-8" />

                {/* Main heading - responsive typography */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  {getTranslation(selectedLanguage.code, 'heroTitle')}
                </h1>
                
                <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-cyan-100 max-w-3xl mx-auto">
                  {getTranslation(selectedLanguage.code, 'heroSubtitle')}
                </p>
                
                {/* Search bar - MioDottore style */}
                <div className="mt-8 sm:mt-10 w-full max-w-lg mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={getTranslation(selectedLanguage.code, 'searchPlaceholder')}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-xl text-base"
                    />
                  </div>
                </div>

                {/* Service buttons - MioDottore style grid */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  <Link
                    href="/search"
                    className="group flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 touch-manipulation active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium text-center">{getTranslation(selectedLanguage.code, 'doctor')}</span>
                  </Link>
                  
                  <Link
                    href="/pharmacy"
                    className="group flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 touch-manipulation active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Pill className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium text-center">{getTranslation(selectedLanguage.code, 'pharmacy')}</span>
                  </Link>
                  
                  <Link
                    href="#features"
                    className="group flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 touch-manipulation active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium text-center">{getTranslation(selectedLanguage.code, 'emergency')}</span>
                  </Link>
                </div>

                {/* Secondary CTA */}
                <div className="mt-8">
                  <Link href="#features" className="text-sm font-medium text-white/80 hover:text-white transition-colors touch-manipulation inline-flex items-center gap-1">
                    {getTranslation(selectedLanguage.code, 'showAll')} <span aria-hidden="true">→</span>
                  </Link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MioDottore-style Feature Highlights */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Find Doctor */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
                  <Search className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTranslation(selectedLanguage.code, 'findDoctorIsland')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getTranslation(selectedLanguage.code, 'findDoctorIslandDesc')}
              </p>
            </div>

            {/* Easy Booking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTranslation(selectedLanguage.code, 'easyBooking')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getTranslation(selectedLanguage.code, 'easyBookingDesc')}
              </p>
            </div>

            {/* Prescription Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <Pill className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTranslation(selectedLanguage.code, 'prescriptionServices')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getTranslation(selectedLanguage.code, 'prescriptionServicesDesc')}
              </p>
            </div>

            {/* Smart Reminders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTranslation(selectedLanguage.code, 'smartReminders')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getTranslation(selectedLanguage.code, 'smartRemindersDesc')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section - Professional responsive grid */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-emerald-600 flex items-center justify-center gap-2">
              {getTranslation(selectedLanguage.code, 'whyChoose')}
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {getTranslation(selectedLanguage.code, 'healthcareSimple')}
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              {getTranslation(selectedLanguage.code, 'comprehensiveServices')}
            </p>
          </div>
          
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 lg:gap-8">
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <Search className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'islandSearch')}
                </dt>
                <dd className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                  {getTranslation(selectedLanguage.code, 'islandSearchDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <Calendar className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'instantBooking')}
                </dt>
                <dd className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                  {getTranslation(selectedLanguage.code, 'instantBookingDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <Pill className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'islandPharmacies')}
                </dt>
                <dd className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                  {getTranslation(selectedLanguage.code, 'islandPharmaciesDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'touristFriendly')}
                </dt>
                <dd className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                  {getTranslation(selectedLanguage.code, 'touristFriendlyDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'emergencyReady')}
                </dt>
                <dd className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                  {getTranslation(selectedLanguage.code, 'emergencyReadyDesc')}
                </dd>
              </div>
              
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section - Professional styling */}
      <section className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {getTranslation(selectedLanguage.code, 'ctaTitle')}
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-8 text-cyan-100">
              {getTranslation(selectedLanguage.code, 'ctaSubtitle')}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto rounded-full bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-emerald-700 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation active:scale-95 min-h-[44px]"
              >
                {getTranslation(selectedLanguage.code, 'bookDoctorVisit')}
              </Link>
              <Link
                href="/pharmacy"
                className="w-full sm:w-auto rounded-full bg-emerald-500/90 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-xl hover:bg-emerald-500 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation active:scale-95 min-h-[44px]"
              >
                {getTranslation(selectedLanguage.code, 'findPharmacy')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency & Useful Contacts Footer - Professional responsive layout */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          
          {/* Emergency Section - Mobile optimized */}
          <div className="bg-red-600 rounded-2xl p-4 sm:p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              Emergency Contacts - 24/7
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-red-700/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Medical Emergency</h4>
                <p className="text-red-100 text-xs sm:text-sm mb-2">Life-threatening situations</p>
                <a href="tel:999" className="text-white font-bold text-lg sm:text-xl hover:text-red-200 touch-manipulation">
                  999
                </a>
              </div>
              <div className="bg-red-700/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Police Emergency</h4>
                <p className="text-red-100 text-xs sm:text-sm mb-2">Crime, accidents, security</p>
                <a href="tel:999" className="text-white font-bold text-lg sm:text-xl hover:text-red-200 touch-manipulation">
                  999
                </a>
              </div>
              <div className="bg-red-700/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Coast Guard</h4>
                <p className="text-red-100 text-xs sm:text-sm mb-2">Marine emergencies</p>
                <a href="tel:+2484366000" className="text-white font-bold text-lg sm:text-xl hover:text-red-200 touch-manipulation">
                  +248 436 6000
                </a>
              </div>
            </div>
          </div>

          {/* Useful Services Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            
            {/* Healthcare Services */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Healthcare
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-300">Seychelles Hospital</p>
                  <a href="tel:+2484388000" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 438 8000</a>
                </div>
                <div>
                  <p className="text-gray-300">Victoria Hospital</p>
                  <a href="tel:+2484388000" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 438 8000</a>
                </div>
                <div>
                  <p className="text-gray-300">Praslin Hospital</p>
                  <a href="tel:+2484233333" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 423 3333</a>
                </div>
              </div>
            </div>

            {/* Tourist Services */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Tourist Help
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-300">Tourist Helpline</p>
                  <a href="tel:+2484293900" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 429 3900</a>
                </div>
                <div>
                  <p className="text-gray-300">Airport Medical</p>
                  <a href="tel:+2484384400" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 438 4400</a>
                </div>
                <div>
                  <p className="text-gray-300">Embassy Services</p>
                  <a href="tel:+2484225500" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 422 5500</a>
                </div>
              </div>
            </div>

            {/* Pharmacy Services */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Pill className="h-4 w-4 sm:h-5 sm:w-5" />
                24/7 Pharmacy
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-300">Emergency Pharmacy</p>
                  <a href="tel:+2484225000" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 422 5000</a>
                </div>
                <div>
                  <p className="text-gray-300">Prescription Delivery</p>
                  <a href="tel:+2484247800" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 424 7800</a>
                </div>
                <div>
                  <p className="text-gray-300">Medical Supplies</p>
                  <a href="tel:+2484232100" className="text-cyan-300 hover:text-cyan-200 touch-manipulation">+248 423 2100</a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Link href="/search" className="block text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 transition-colors touch-manipulation">
                  Find nearest doctor
                </Link>
                <Link href="/pharmacy" className="block text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 transition-colors touch-manipulation">
                  Locate pharmacy
                </Link>
                <button className="block text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 transition-colors text-left touch-manipulation">
                  Call ambulance
                </button>
                <button className="block text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 transition-colors text-left touch-manipulation">
                  Travel insurance
                </button>
              </div>
            </div>
            
          </div>

          {/* Additional Useful Info - Responsive */}
          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
              <div>
                <h5 className="font-semibold text-cyan-400 mb-2">Health Tips for Seychelles</h5>
                <ul className="space-y-1 text-gray-300">
                  <li>• Use SPF 30+ sunscreen daily</li>
                  <li>• Stay hydrated in tropical climate</li>
                  <li>• Check diving medical requirements</li>
                  <li>• Carry basic first aid kit</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-emerald-400 mb-2">Island Medical Centers</h5>
                <ul className="space-y-1 text-gray-300">
                  <li>• Mahé: 8 clinics, 3 hospitals</li>
                  <li>• Praslin: 2 clinics, 1 hospital</li>
                  <li>• La Digue: 1 clinic</li>
                  <li>• Other islands: On-call services</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-400 mb-2">Tourist Medical Insurance</h5>
                <ul className="space-y-1 text-gray-300">
                  <li>• Travel insurance recommended</li>
                  <li>• EU health cards accepted</li>
                  <li>• Private clinics available</li>
                  <li>• Medical evacuation coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright - Professional */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 MON DOKTER Seychelles. Healthcare made simple in paradise.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Licensed healthcare platform serving residents and visitors across all Seychelles islands.
            </p>
          </div>
          
        </div>
      </footer>
      
    </main>
  )
}