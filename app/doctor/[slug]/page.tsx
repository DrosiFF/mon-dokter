import { MapPin, Star, Calendar, Clock, Euro } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import MapView from '../../../components/MapView'

// Mock data - in a real app this would come from your database
const mockDoctor = {
  id: '1',
  slug: 'dr-mario-rossi',
  firstName: 'Mario',
  lastName: 'Rossi',
  specialty: 'Cardiology',
  clinic: 'San Giuseppe Clinic',
  city: 'Rome',
  rating: 4.8,
  reviewCount: 127,
  bio: 'Dr. Mario Rossi is a cardiologist with over 15 years of experience in treating cardiovascular diseases. He graduated from La Sapienza University in Rome and completed his specialization at the prestigious San Camillo Hospital. He is an expert in echocardiography, electrocardiography and cardiac catheterization.',
  experience: 15,
  consultationFee: 120,
  image: '/images/placeholders/doctor-male.svg',
  latitude: -4.6191,
  longitude: 55.4513,
  qualifications: [
    'Degree in Medicine and Surgery - La Sapienza University',
    'Specialization in Cardiology - San Camillo Hospital',
    'Master in Echocardiography - European Society of Cardiology',
    'Certification in Cardiac Catheterization'
  ],
  availableSlots: [
    { date: '2024-01-15', time: '09:00', available: true },
    { date: '2024-01-15', time: '10:30', available: true },
    { date: '2024-01-15', time: '14:00', available: false },
    { date: '2024-01-15', time: '15:30', available: true },
    { date: '2024-01-16', time: '09:00', available: true },
    { date: '2024-01-16', time: '11:00', available: true },
  ]
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15 passes promised params; we await to satisfy type checks (unused)
  await params
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
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
                Search doctors
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Doctor Info - Mobile optimized */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <Image
                    src={mockDoctor.image}
                    alt={`Dr. ${mockDoctor.firstName} ${mockDoctor.lastName}`}
                    width={128}
                    height={128}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    Dr. {mockDoctor.firstName} {mockDoctor.lastName}
                  </h1>
                  <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-4">
                    {mockDoctor.specialty}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-lg">{mockDoctor.rating}</span>
                      <span className="text-gray-500 text-sm">({mockDoctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{mockDoctor.clinic}, {mockDoctor.city}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{mockDoctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      <span className="font-bold text-blue-600">€{mockDoctor.consultationFee} per visit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About - Mobile optimized */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">About me</h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{mockDoctor.bio}</p>
            </div>

            {/* Qualifications - Mobile optimized */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Education & Qualifications</h2>
              <ul className="space-y-3 sm:space-y-4">
                {mockDoctor.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm sm:text-base leading-relaxed">{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Map */}
            <MapView
              latitude={mockDoctor.latitude}
              longitude={mockDoctor.longitude}
              title={mockDoctor.clinic}
              address={`${mockDoctor.clinic}, ${mockDoctor.city}`}
            />
          </div>

          {/* Booking Sidebar - Mobile optimized */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 sticky top-20 sm:top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Book an appointment</h2>
              
              <div className="mb-8">
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  €{mockDoctor.consultationFee}
                </p>
                <p className="text-sm sm:text-base text-gray-500 font-medium">Consultation fee</p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Next available appointments</h3>
                <div className="space-y-3">
                  {mockDoctor.availableSlots.filter(slot => slot.available).slice(0, 4).map((slot, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {new Date(slot.date).toLocaleDateString('it-IT', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-sm sm:text-base text-blue-600 font-medium">{slot.time}</p>
                        </div>
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={`/book/${mockDoctor.id}`}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center block text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 min-h-[56px] flex items-center justify-center"
              >
                Book now
              </Link>

              <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 leading-relaxed">
                Instant confirmation • Free cancellation up to 24h before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
