'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const mockDoctor = {
  id: '1',
  firstName: 'Mario',
  lastName: 'Rossi',
  specialty: 'Cardiology',
  clinic: 'San Giuseppe Clinic',
  city: 'Rome',
  consultationFee: 120,
  image: '/images/placeholders/doctor-male.svg'
}

const availableSlots = [
  { date: '2024-01-15', slots: ['09:00', '10:30', '15:30', '16:00'] },
  { date: '2024-01-16', slots: ['09:00', '11:00', '14:30', '16:30'] },
  { date: '2024-01-17', slots: ['08:30', '10:00', '15:00', '17:00'] },
  { date: '2024-01-18', slots: ['09:30', '11:30', '14:00', '16:00'] },
]

export default function BookingForm({ doctorId: _doctorId }: { doctorId?: string }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Booking confirmed! You will receive a confirmation email.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile optimized */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <Link 
              href={`/doctor/dr-mario-rossi`}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to profile</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Book an appointment
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Fill out the form to book your visit
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Date Selection - Mobile optimized */}
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Select date
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {availableSlots.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.date)
                        setSelectedTime('')
                      }}
                      className={`p-4 sm:p-5 text-center border-2 rounded-2xl transition-all duration-300 min-h-[80px] sm:min-h-[90px] ${
                        selectedDate === day.date
                          ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105'
                      }`}
                    >
                      <div className="font-bold text-sm sm:text-base">
                        {new Date(day.date).toLocaleDateString('it-IT', { 
                          weekday: 'short' 
                        })}
                      </div>
                      <div className="text-xs sm:text-sm mt-1 text-gray-600">
                        {new Date(day.date).toLocaleDateString('it-IT', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Select time
                  </h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots
                      .find(day => day.date === selectedDate)
                      ?.slots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 text-center border rounded-lg transition-colors ${
                            selectedTime === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Patient information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo della visita (opzionale)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        rows={3}
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descrivi brevemente il motivo della visita..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTime && (
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Conferma prenotazione
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Riepilogo prenotazione
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src={mockDoctor.image}
                  alt={`Dr. ${mockDoctor.firstName} ${mockDoctor.lastName}`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    Dr. {mockDoctor.firstName} {mockDoctor.lastName}
                  </p>
                  <p className="text-sm text-blue-600">{mockDoctor.specialty}</p>
                  <p className="text-xs text-gray-500">
                    {mockDoctor.clinic}, {mockDoctor.city}
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {selectedDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(selectedDate).toLocaleDateString('it-IT', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{selectedTime}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Totale:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{mockDoctor.consultationFee}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pagamento al momento della visita
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


