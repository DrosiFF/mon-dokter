'use client'

import { useUser, UserButton, SignOutButton } from '@clerk/nextjs'
import { useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  Heart, 
  FileText, 
  Bell,
  Shield,
  LogOut,
  Edit3,
  Clock
} from 'lucide-react'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { selectedLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <Link 
            href="/sign-in"
            className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'health', name: 'Health Records', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-gray-600 hover:text-cyan-600 transition-colors">
                {getTranslation(selectedLanguage.code, 'findDoctor') || 'Find Doctor'}
              </Link>
              <Link href="/pharmacy" className="text-gray-600 hover:text-emerald-600 transition-colors">
                {getTranslation(selectedLanguage.code, 'pharmacy') || 'Pharmacy'}
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Profile'}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user.fullName || 'Welcome!'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Seychelles
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(user.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-600 text-sm font-medium">Upcoming Appointments</p>
                        <p className="text-2xl font-bold text-cyan-900">2</p>
                      </div>
                      <Calendar className="w-8 h-8 text-cyan-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-sm font-medium">Health Records</p>
                        <p className="text-2xl font-bold text-emerald-900">5</p>
                      </div>
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Prescriptions</p>
                        <p className="text-2xl font-bold text-purple-900">3</p>
                      </div>
                      <Heart className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Appointment scheduled</p>
                        <p className="text-sm text-gray-600">Dr. Marie-Louise Chan - Tomorrow at 2:00 PM</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Health record updated</p>
                        <p className="text-sm text-gray-600">Blood pressure reading added</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Your Appointments</h3>
                  <Link 
                    href="/search"
                    className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Book New Appointment
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src="/images/placeholders/doctor-female.svg"
                          alt="Dr. Marie-Louise Chan"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">Dr. Marie-Louise Chan</h4>
                          <p className="text-sm text-gray-600">Tropical Medicine & Tourism Health</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tomorrow, Jan 15
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        2:00 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Victoria, Mahé
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No health records yet</h4>
                  <p className="text-gray-600 mb-6">Your health records will appear here after your appointments</p>
                  <Link 
                    href="/search"
                    className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Book Your First Appointment
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">Notifications</h4>
                          <p className="text-sm text-gray-600">Manage your notification preferences</p>
                        </div>
                      </div>
                      <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">Privacy & Security</h4>
                          <p className="text-sm text-gray-600">Manage your privacy settings</p>
                        </div>
                      </div>
                      <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-red-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-500" />
                        <div>
                          <h4 className="font-medium text-red-900">Sign Out</h4>
                          <p className="text-sm text-red-600">Sign out of your account</p>
                        </div>
                      </div>
                      <SignOutButton>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
