'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Star, ExternalLink, Users } from 'lucide-react'

interface BookingWidgetProps {
  providerId: string
  providerName: string
  providerType: 'clinic' | 'pharmacy' | 'wellness'
  simplybookUrl?: string
  location: string
  rating: number
  specialties: string[]
}

export default function BookingWidget({
  providerId,
  providerName,
  providerType,
  simplybookUrl,
  location,
  rating,
  specialties
}: BookingWidgetProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Mock available services based on provider type
  const getServices = () => {
    switch (providerType) {
      case 'clinic':
        return [
          'General Consultation (30 min) - ₨150',
          'Follow-up Visit (15 min) - ₨100',
          'Health Check-up (45 min) - ₨250',
          'Vaccination (15 min) - ₨80',
          'Blood Pressure Check (10 min) - ₨50'
        ]
      case 'pharmacy':
        return [
          'Medication Consultation (15 min) - ₨50',
          'Blood Pressure Screening (10 min) - ₨30',
          'Diabetes Monitoring (15 min) - ₨60',
          'Prescription Review (20 min) - ₨75'
        ]
      case 'wellness':
        return [
          'Massage Therapy (60 min) - ₨300',
          'Acupuncture (45 min) - ₨200',
          'Wellness Consultation (30 min) - ₨150',
          'Stress Management (45 min) - ₨180'
        ]
      default:
        return []
    }
  }

  // Mock available time slots
  const getTimeSlots = () => {
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ]
  }

  // Generate next 7 days for booking
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const handleBookingSubmit = () => {
    if (simplybookUrl) {
      // Redirect to actual SimplyBook.me booking page
      window.open(simplybookUrl, '_blank')
    } else {
      // For demo purposes, show success message
      alert(`Booking request sent for ${selectedService} on ${selectedDate} at ${selectedTime}`)
      setShowBookingForm(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Provider Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {providerName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
              {specialties.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
            {simplybookUrl && (
              <a
                href={simplybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 justify-center"
              >
                <ExternalLink className="w-3 h-3" />
                Full Booking Page
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="p-6 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Book an Appointment
          </h4>
          
          <div className="space-y-4">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              >
                <option value="">Choose a service...</option>
                {getServices().map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              >
                <option value="">Choose a date...</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {getTimeSlots().map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBookingSubmit}
                disabled={!selectedService || !selectedDate || !selectedTime}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
              >
                {simplybookUrl ? 'Continue on SimplyBook.me' : 'Request Booking'}
              </button>
              <button
                onClick={() => setShowBookingForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* SimplyBook.me Integration Notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Powered by SimplyBook.me</p>
                <p>This provider uses professional booking management with automated confirmations, reminders, and secure payment processing.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
