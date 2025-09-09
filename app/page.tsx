'use client'

import Link from 'next/link'
import { Search, Calendar, Users, Shield, Pill, Globe, MapPin } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import LanguagePicker from '../components/LanguagePicker'
import AdminLink from '../components/AdminLink'
import { useLanguage } from '../lib/LanguageContext'
import { getTranslation } from '../lib/translations'

export default function HomePage() {
  const { selectedLanguage } = useLanguage()
  const { user } = useUser()

  return (
    <main className="flex-1">
      {/* Header - Simple and Clean */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <LanguagePicker variant="header" />
            </div>
            <div className="flex items-center gap-3">
              <AdminLink variant="header" />
              <Link 
                href="/provider-signup"
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 text-sm font-medium border border-white/20"
              >
                Join as Provider
              </Link>
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
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium border border-white/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - iPhone First Design */}
      <section className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 overflow-hidden min-h-screen md:min-h-0">
        {/* Subtle Seychelles Flag Background */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            className="absolute top-4 right-4 w-20 h-12 sm:top-8 sm:right-8 sm:w-32 sm:h-20 lg:w-48 lg:h-30 xl:w-64 xl:h-40 transform rotate-12" 
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
            className="absolute bottom-8 left-4 w-16 h-10 sm:bottom-12 sm:left-8 sm:w-24 sm:h-16 lg:w-32 lg:h-20 xl:w-40 xl:h-25 transform -rotate-6 opacity-60" 
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
        
        {/* iPhone-optimized hero container */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="py-12 sm:py-20 md:py-24 lg:py-32 xl:py-40 min-h-screen md:min-h-0 flex items-center">
              <div className="text-center max-w-4xl mx-auto w-full">
                
                {/* Logo and branding - iPhone optimized */}
                <div className="mb-6 sm:mb-10 flex flex-col items-center justify-center gap-3 sm:gap-6">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide drop-shadow-lg">MON DOKTER</h1>
                  </div>
                  <span className="text-cyan-200 text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wide drop-shadow-md">
                    {getTranslation(selectedLanguage.code, 'heroSlogan')}
                  </span>
                </div>
                
                {/* Prominent Language Selector - iPhone optimized */}
                <div className="mb-6 sm:mb-10">
                  <LanguagePicker variant="hero" />
                </div>

                {/* Main heading - iPhone optimized typography */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight px-2">
                  {getTranslation(selectedLanguage.code, 'heroTitle')}
                </h2>
                
                <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-cyan-100 max-w-2xl mx-auto px-4">
                  {getTranslation(selectedLanguage.code, 'heroSubtitle')}
                </p>
                
                {/* Search bar - iPhone optimized */}
                <div className="mt-10 sm:mt-12 w-full max-w-md mx-auto px-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={getTranslation(selectedLanguage.code, 'searchPlaceholder')}
                      className="w-full pl-14 pr-4 py-5 rounded-3xl bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-2xl text-base font-medium"
                    />
                  </div>
                </div>

                {/* Service buttons - Mobile optimized grid */}
                <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto px-4">
                  <Link
                    href="/search"
                    className="group flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 transition-all duration-300 touch-manipulation active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">{getTranslation(selectedLanguage.code, 'doctor')}</span>
                  </Link>
                  
                  <Link
                    href="/pharmacy"
                    className="group flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 transition-all duration-300 touch-manipulation active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Pill className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">{getTranslation(selectedLanguage.code, 'pharmacy')}</span>
                  </Link>
                  
                  <Link
                    href="#features"
                    className="group flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 transition-all duration-300 touch-manipulation active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">{getTranslation(selectedLanguage.code, 'emergency')}</span>
                  </Link>
                </div>

                {/* Secondary CTA - Mobile optimized */}
                <div className="mt-10 sm:mt-12">
                  <Link href="#features" className="text-sm sm:text-base font-semibold text-white/90 hover:text-white transition-all duration-200 touch-manipulation inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm">
                    {getTranslation(selectedLanguage.code, 'showAll')} <span aria-hidden="true" className="text-lg">→</span>
                  </Link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Specialties Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl mb-12 sm:mb-16">
            <h2 className="text-sm sm:text-base font-bold leading-7 text-cyan-600 flex items-center justify-center gap-2 tracking-wide uppercase">
              Healthcare Specialties
            </h2>
            <p className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Find the right specialist for you
            </p>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive list of healthcare professionals across all specialties
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
            {/* Medical Clinics & Doctors */}
            <Link href="/search?specialty=Medical Clinics & Doctors" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-cyan-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Medical Clinics & Doctors</h3>
              </div>
            </Link>

            {/* Dentists */}
            <Link href="/search?specialty=Dentists" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Dentists</h3>
              </div>
            </Link>

            {/* Chiropractics */}
            <Link href="/search?specialty=Chiropractics" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Chiropractics</h3>
              </div>
            </Link>

            {/* Acupuncture */}
            <Link href="/search?specialty=Acupuncture" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Acupuncture</h3>
              </div>
            </Link>

            {/* Massage */}
            <Link href="/search?specialty=Massage" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-pink-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Massage</h3>
              </div>
            </Link>

            {/* Physiologists */}
            <Link href="/search?specialty=Physiologists" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Physiologists</h3>
              </div>
            </Link>

            {/* Psychologists */}
            <Link href="/search?specialty=Psychologists" className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Psychologists</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile optimized */}
      <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-sm sm:text-base font-bold leading-7 text-emerald-600 flex items-center justify-center gap-2 tracking-wide uppercase">
              {getTranslation(selectedLanguage.code, 'whyChoose')}
            </h2>
            <p className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {getTranslation(selectedLanguage.code, 'healthcareSimple')}
            </p>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
              {getTranslation(selectedLanguage.code, 'comprehensiveServices')}
            </p>
          </div>
          
          <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 sm:gap-10 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 lg:gap-8">
              
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200">
                <dt className="text-base sm:text-lg font-bold leading-7 text-gray-900">
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                    <Search className="h-7 w-7 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'islandSearch')}
                </dt>
                <dd className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                  {getTranslation(selectedLanguage.code, 'islandSearchDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <dt className="text-base sm:text-lg font-bold leading-7 text-gray-900">
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg">
                    <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'instantBooking')}
                </dt>
                <dd className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                  {getTranslation(selectedLanguage.code, 'instantBookingDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                <dt className="text-base sm:text-lg font-bold leading-7 text-gray-900">
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg">
                    <Pill className="h-7 w-7 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'islandPharmacies')}
                </dt>
                <dd className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                  {getTranslation(selectedLanguage.code, 'islandPharmaciesDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <dt className="text-base sm:text-lg font-bold leading-7 text-gray-900">
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'touristFriendly')}
                </dt>
                <dd className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                  {getTranslation(selectedLanguage.code, 'touristFriendlyDesc')}
                </dd>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200">
                <dt className="text-base sm:text-lg font-bold leading-7 text-gray-900">
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
                    <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                  </div>
                  {getTranslation(selectedLanguage.code, 'emergencyReady')}
                </dt>
                <dd className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                  {getTranslation(selectedLanguage.code, 'emergencyReadyDesc')}
                </dd>
              </div>
              
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Healthcare Providers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet some of our trusted healthcare professionals serving the Seychelles community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real providers will be displayed here once added through admin */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-12 0H3m2 0h2M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare Providers</h3>
                <p className="text-gray-600 mb-6">Trusted healthcare professionals will appear here once they join our platform</p>
                <Link 
                  href="/search" 
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Browse Providers →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-emerald-700">💊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacy Services</h3>
                <p className="text-gray-600 mb-6">Quality medications and health products available for delivery across Seychelles</p>
                <Link 
                  href="/pharmacy" 
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Browse Products →
                </Link>
              </div>
            </div>

            {/* Join as Provider Card */}
            <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-cyan-200">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Network</h3>
                <p className="text-gray-600 mb-6">Are you a healthcare provider? Join MON DOKTER and connect with patients across Seychelles</p>
                <Link 
                  href="/onboarding/provider" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200"
                >
                  Apply as Provider
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/search" 
              className="inline-flex items-center justify-center px-8 py-4 border border-cyan-600 text-cyan-600 font-medium rounded-xl hover:bg-cyan-50 transition-all duration-200"
            >
              View All Providers
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile optimized */}
      <section className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {getTranslation(selectedLanguage.code, 'ctaTitle')}
            </h2>
            <p className="mx-auto mt-6 sm:mt-8 max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-cyan-100">
              {getTranslation(selectedLanguage.code, 'ctaSubtitle')}
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-md sm:max-w-none mx-auto">
              <Link
                href="/search"
                className="w-full sm:w-auto rounded-full bg-white/95 backdrop-blur-sm px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-emerald-700 shadow-2xl hover:bg-white hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 touch-manipulation active:scale-95 min-h-[56px] hover:scale-105"
              >
                <Users className="h-5 w-5" />
                {getTranslation(selectedLanguage.code, 'bookDoctorVisit')}
              </Link>
              <Link
                href="/pharmacy"
                className="w-full sm:w-auto rounded-full bg-emerald-500/95 backdrop-blur-sm px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-2xl hover:bg-emerald-500 hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 touch-manipulation active:scale-95 min-h-[56px] hover:scale-105"
              >
                <Pill className="h-5 w-5" />
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
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
              Emergency Contacts - 24/7
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-red-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-red-800/70 transition-all duration-200 border border-red-500/30">
                <h4 className="font-bold mb-3 text-base sm:text-lg">Medical Emergency</h4>
                <p className="text-red-100 text-sm sm:text-base mb-4 leading-relaxed">Life-threatening situations</p>
                <a href="tel:999" className="text-white font-black text-2xl sm:text-3xl hover:text-red-200 touch-manipulation transition-colors duration-200 inline-block">
                  999
                </a>
              </div>
              <div className="bg-red-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-red-800/70 transition-all duration-200 border border-red-500/30">
                <h4 className="font-bold mb-3 text-base sm:text-lg">Police Emergency</h4>
                <p className="text-red-100 text-sm sm:text-base mb-4 leading-relaxed">Crime, accidents, security</p>
                <a href="tel:999" className="text-white font-black text-2xl sm:text-3xl hover:text-red-200 touch-manipulation transition-colors duration-200 inline-block">
                  999
                </a>
              </div>
              <div className="bg-red-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-red-800/70 transition-all duration-200 border border-red-500/30 sm:col-span-2 lg:col-span-1">
                <h4 className="font-bold mb-3 text-base sm:text-lg">Coast Guard</h4>
                <p className="text-red-100 text-sm sm:text-base mb-4 leading-relaxed">Marine emergencies</p>
                <a href="tel:+2484366000" className="text-white font-black text-xl sm:text-2xl hover:text-red-200 touch-manipulation transition-colors duration-200 inline-block">
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