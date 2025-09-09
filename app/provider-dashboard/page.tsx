'use client'

import { useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings,
  ExternalLink,
  Bell,
  CreditCard,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '../../lib/LanguageContext'
import { getTranslation } from '../../lib/translations'

export default function ProviderDashboard() {
  const { user } = useUser()
  const { selectedLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app, this would come from SimplyBook.me API
  const mockData = {
    todayStats: {
      appointments: 12,
      newPatients: 3,
      revenue: 2850,
      noShows: 1
    },
    recentBookings: [
      { id: 1, patient: 'Marie Dubois', time: '09:00', service: 'General Consultation', status: 'confirmed' },
      { id: 2, patient: 'Jean Pierre', time: '10:30', service: 'Blood Pressure Check', status: 'confirmed' },
      { id: 3, patient: 'Sarah Johnson', time: '14:00', service: 'Vaccination', status: 'pending' },
    ],
    weeklyStats: {
      appointments: [15, 18, 22, 19, 25, 16, 12],
      revenue: [3200, 4100, 5200, 4800, 6100, 3800, 2850]
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
              <span className="text-sm bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                Provider
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Dr. {user.firstName || 'Provider'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your practice and view your booking analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.todayStats.appointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Patients</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.todayStats.newPatients}</p>
              </div>
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₨{mockData.todayStats.revenue}</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No-Shows</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.todayStats.noShows}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* SimplyBook.me Integration Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking System Status
                </h3>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">SimplyBook.me Dashboard</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Manage appointments, view analytics, and configure your booking settings
                  </p>
                  <a 
                    href="https://simplybook.me/en/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Open Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 mb-2">Your Booking Page</h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Direct link for patients to book appointments with you
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <Link 
                  href="#" 
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {mockData.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.patient}</p>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{booking.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
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

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="https://simplybook.me/en/" 
                  target="_blank"
                  className="w-full flex items-center gap-3 p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  <span className="text-cyan-900">Manage Appointments</span>
                  <ExternalLink className="w-4 h-4 text-cyan-600 ml-auto" />
                </a>
                <a 
                  href="https://simplybook.me/en/" 
                  target="_blank"
                  className="w-full flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-900">Booking Settings</span>
                  <ExternalLink className="w-4 h-4 text-emerald-600 ml-auto" />
                </a>
                <a 
                  href="https://simplybook.me/en/" 
                  target="_blank"
                  className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-900">View Analytics</span>
                  <ExternalLink className="w-4 h-4 text-purple-600 ml-auto" />
                </a>
              </div>
            </div>

            {/* Practice Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Victoria Medical Center, Mahé</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+248 4 123 456</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>contact@clinic.sc</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Fri: 9:00-17:00</span>
                </div>
              </div>
            </div>

            {/* SimplyBook.me Features */}
            <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl p-6 border border-cyan-100">
              <h3 className="text-lg font-semibold text-cyan-900 mb-4">
                Your SimplyBook.me Features
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-cyan-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>24/7 Online Booking</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>SMS & Email Reminders</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Payment Processing</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Calendar Sync</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Patient Records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
