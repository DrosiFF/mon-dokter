import { MapPin, Star, Calendar, Clock, Euro } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../../components/Logo'
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
  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
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

interface PageProps {
  params: {
    slug: string
  }
}

export default function DoctorProfilePage({ params }: PageProps) {
  // Note: params is required by Next.js but not used in this component
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
              <Link href="/search" className="text-gray-700 hover:text-blue-600">
                Search doctors
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start gap-6">
                <Image
                  src={mockDoctor.image}
                  alt={`Dr. ${mockDoctor.firstName} ${mockDoctor.lastName}`}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Dr. {mockDoctor.firstName} {mockDoctor.lastName}
                  </h1>
                  <p className="text-xl text-blue-600 font-medium mb-3">
                    {mockDoctor.specialty}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{mockDoctor.rating}</span>
                      <span className="text-gray-500">({mockDoctor.reviewCount} recensioni)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mockDoctor.clinic}, {mockDoctor.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{mockDoctor.experience} anni di esperienza</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      <span>€{mockDoctor.consultationFee} a visita</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About me</h2>
              <p className="text-gray-600 leading-relaxed">{mockDoctor.bio}</p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education & Qualifications</h2>
              <ul className="space-y-2">
                {mockDoctor.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{qualification}</span>
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

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book an appointment</h2>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  €{mockDoctor.consultationFee}
                </p>
                <p className="text-sm text-gray-500">Consultation fee</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Next available appointments</h3>
                <div className="space-y-2">
                  {mockDoctor.availableSlots.filter(slot => slot.available).slice(0, 4).map((slot, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString('it-IT', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-sm text-gray-500">{slot.time}</p>
                        </div>
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={`/book/${mockDoctor.id}`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
              >
                Book now
              </Link>

              <p className="text-xs text-gray-500 text-center mt-3">
                Instant confirmation • Free cancellation up to 24h before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
