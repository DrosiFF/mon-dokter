import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import BookingEmbed, { BookingLink } from '../../../components/BookingEmbed';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  StarIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const prisma = new PrismaClient();

interface DoctorPageProps {
  params: Promise<{ slug: string }>;
}

async function getDoctorData(slug: string) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        profile: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        },
        clinic: {
          select: {
            name: true,
            address: true,
            island: true,
            phone: true,
            slug: true
          }
        },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        },
        integrations: {
          where: {
            type: 'simplybook',
            isActive: true
          }
        },
        bookings: {
          where: {
            status: 'COMPLETED',
            start: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          select: { id: true }
        }
      }
    });

    if (!provider) return null;

    // Parse specialties
    const specialties = provider.specialties ? JSON.parse(provider.specialties) : [];

    return {
      ...provider,
      specialties,
      recentBookingsCount: provider.bookings.length
    };
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { slug } = await params;
  const doctor = await getDoctorData(slug);

  if (!doctor) {
    notFound();
  }

  const primaryIntegration = doctor.integrations[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              MON DOKTER
            </Link>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <Link href="/sign-in" className="text-cyan-600 hover:text-cyan-700">
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-cyan-600">Home</Link>
            <span>/</span>
            <Link href={`/clinics/${doctor.clinic?.slug}`} className="hover:text-cyan-600">
              {doctor.clinic?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{doctor.profile.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Doctor Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-full flex items-center justify-center mr-6">
                      <span className="text-2xl font-bold text-cyan-700">
                        {(doctor.profile.name || 'Dr').split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{doctor.profile.name}</h1>
                      <p className="text-gray-600 text-lg">Healthcare Provider</p>
                      {doctor.clinic && (
                        <Link 
                          href={`/clinics/${doctor.clinic.slug}`}
                          className="text-cyan-600 hover:text-cyan-700 text-sm"
                        >
                          @ {doctor.clinic.name}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  {doctor.specialties.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialties.map((specialty: string) => (
                          <span 
                            key={specialty}
                            className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-600">{doctor.services.length}</div>
                      <div className="text-sm text-gray-600">Services Offered</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600">{doctor.recentBookingsCount}</div>
                      <div className="text-sm text-gray-600">Recent Patients</div>
                    </div>
                  </div>
                </div>

                {/* Quick Booking CTA */}
                <div className="mt-6 sm:mt-0 sm:ml-8">
                  <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg p-6 text-center">
                    <CalendarIcon className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Appointment</h3>
                    <p className="text-gray-600 text-sm mb-4">Schedule directly with {doctor.profile.name}</p>
                    {primaryIntegration ? (
                      <BookingLink 
                        company={primaryIntegration.company || 'demo'}
                        providerId={primaryIntegration.apiUser || undefined}
                      >
                        Book Now
                      </BookingLink>
                    ) : (
                      <button className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                        Booking Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            {doctor.bio && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>
              </div>
            )}

            {/* Services & Pricing */}
            {doctor.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h2>
                
                <div className="space-y-4">
                  {doctor.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 mb-4 sm:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                          {service.description && (
                            <p className="text-gray-600 mb-2">{service.description}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>{service.durationMin} minutes</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                             <div className="text-2xl font-bold text-cyan-600">€{service.price.toString()}</div>
                            <div className="text-sm text-gray-500">per session</div>
                          </div>
                          
                          {primaryIntegration && (
                            <BookingLink 
                              company={primaryIntegration.company || 'demo'}
                              providerId={primaryIntegration.apiUser || undefined}
                              serviceId={service.id}
                              className="px-4 py-2 text-sm"
                            >
                              Book This Service
                            </BookingLink>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Information */}
            {doctor.clinic && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Information</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Link 
                      href={`/clinics/${doctor.clinic.slug}`}
                      className="hover:text-cyan-600 transition-colors"
                    >
                      {doctor.clinic.name}
                    </Link>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{doctor.clinic.address}</p>
                        <p className="text-gray-600 text-sm">{doctor.clinic.island}, Seychelles</p>
                      </div>
                    </div>
                    
                    {doctor.clinic.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <a href={`tel:${doctor.clinic.phone}`} className="text-cyan-600 hover:text-cyan-700">
                          {doctor.clinic.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href={`/clinics/${doctor.clinic.slug}`}
                      className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                    >
                      View full clinic details →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Widget */}
            {primaryIntegration && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book with {doctor.profile.name}</h3>
                <BookingEmbed 
                  company={primaryIntegration.company || 'demo'}
                  providerId={primaryIntegration.apiUser || undefined}
                  height="500px"
                />
              </div>
            )}
            
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Professional Healthcare Provider</span>
                </div>
                
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Online Booking Available</span>
                </div>
                
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Same-day Appointments</span>
                </div>
                
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">SMS Reminders</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              
              <div className="space-y-3">
                {doctor.profile.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${doctor.profile.phone}`} className="text-cyan-600 hover:text-cyan-700">
                      {doctor.profile.phone}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-900">Mon-Fri: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 text-sm">Appointments available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
