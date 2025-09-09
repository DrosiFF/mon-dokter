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
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const prisma = new PrismaClient();

interface ClinicPageProps {
  params: Promise<{ slug: string }>;
}

async function getClinicData(slug: string) {
  try {
    const clinic = await prisma.clinic.findUnique({
      where: { slug },
      include: {
        providers: {
          include: {
            profile: {
              select: {
                name: true,
                phone: true
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
            }
          }
        },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    });

    if (!clinic) return null;

    // Parse specialties for each provider
    const providersWithSpecialties = clinic.providers.map(provider => ({
      ...provider,
      specialties: provider.specialties ? JSON.parse(provider.specialties) : []
    }));

    return {
      ...clinic,
      providers: providersWithSpecialties
    };
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
}

export default async function ClinicPage({ params }: ClinicPageProps) {
  const { slug } = await params;
  const clinic = await getClinicData(slug);

  if (!clinic) {
    notFound();
  }

  // Get the primary SimplyBook integration (first active one)
  const primaryIntegration = clinic.providers.find(p => p.integrations.length > 0)?.integrations[0];

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
        {/* Clinic Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{clinic.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <div>
                      <p>{clinic.address}</p>
                      {clinic.island && <p className="text-sm">{clinic.island}, Seychelles</p>}
                    </div>
                  </div>
                  
                  {clinic.phone && (
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      <a href={`tel:${clinic.phone}`} className="hover:text-cyan-600">
                        {clinic.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    <span>{clinic.providers.length} Healthcare Provider{clinic.providers.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Quick Booking CTA */}
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg p-6 text-center">
                  <CalendarIcon className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Appointment</h3>
                  <p className="text-gray-600 text-sm mb-4">Schedule with any of our providers</p>
                  {primaryIntegration ? (
                    <BookingLink company={primaryIntegration.company || 'demo'}>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Our Providers */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Healthcare Providers</h2>
              
              <div className="space-y-6">
                {clinic.providers.map((provider) => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link 
                            href={`/doctors/${provider.slug}`}
                            className="hover:text-cyan-600 transition-colors"
                          >
                            {provider.profile.name}
                          </Link>
                        </h3>
                        
                        {provider.specialties.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {provider.specialties.slice(0, 3).map((specialty: string) => (
                                <span 
                                  key={specialty}
                                  className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {provider.specialties.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                  +{provider.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {provider.bio && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {provider.bio}
                          </p>
                        )}
                        
                        {provider.services.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                            <div className="space-y-1">
                              {provider.services.slice(0, 3).map((service) => (
                                <div key={service.id} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-700">{service.name}</span>
                                  <span className="font-medium text-gray-900">€{service.price.toString()}</span>
                                </div>
                              ))}
                              {provider.services.length > 3 && (
                                <p className="text-sm text-gray-500">
                                  +{provider.services.length - 3} more services
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2">
                        <Link
                          href={`/doctors/${provider.slug}`}
                          className="px-4 py-2 border border-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-50 transition-colors text-center text-sm"
                        >
                          View Profile
                        </Link>
                        
                        {provider.integrations.length > 0 && (
                          <BookingLink 
                            company={provider.integrations[0].company || 'demo'}
                            providerId={provider.integrations[0].apiUser || undefined}
                            className="px-4 py-2 text-sm"
                          >
                            Book Appointment
                          </BookingLink>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Overview */}
            {clinic.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clinic.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="font-bold text-cyan-600">€{service.price.toString()}</span>
                      </div>
                      {service.description && (
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      )}
                      <p className="text-gray-500 text-xs">{service.durationMin} minutes</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Widget */}
            {primaryIntegration && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book an Appointment</h3>
                <BookingEmbed 
                  company={primaryIntegration.company || 'demo'}
                  height="500px"
                />
              </div>
            )}
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{clinic.address}</p>
                    {clinic.island && <p className="text-gray-600 text-sm">{clinic.island}, Seychelles</p>}
                  </div>
                </div>
                
                {clinic.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${clinic.phone}`} className="text-cyan-600 hover:text-cyan-700">
                      {clinic.phone}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-900">Mon-Fri: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 text-sm">Sat: 9:00 AM - 1:00 PM</p>
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
