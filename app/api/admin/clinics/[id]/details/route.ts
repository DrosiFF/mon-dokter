import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get detailed clinic information
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        providers: {
          include: {
            profile: {
              select: {
                name: true
              }
            },
            services: {
              select: {
                id: true
              }
            },
            bookings: {
              where: {
                start: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
              },
              select: {
                id: true
              }
            }
          }
        },
        services: {
          include: {
            _count: {
              select: {
                bookings: true
              }
            }
          }
        }
      }
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Get recent bookings for this clinic (ADMIN ONLY - anonymized patient data)
    const recentBookings = await prisma.booking.findMany({
      where: {
        provider: {
          clinicId: id
        },
        start: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        start: 'desc'
      },
      take: 10
    });

    // Format providers with specialties and stats
    const providersWithStats = clinic.providers.map(provider => {
      let specialties: string[] = [];
      try {
        specialties = provider.specialties ? JSON.parse(provider.specialties) : [];
      } catch (e) {
        specialties = [];
      }

      return {
        id: provider.id,
        profile: provider.profile,
        specialties,
        services: provider.services.length,
        recentBookings: provider.bookings.length
      };
    });

    // Format services with booking counts
    const servicesWithBookings = clinic.services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
      isActive: service.isActive,
      bookings: service._count.bookings
    }));

    // Format recent bookings (ANONYMIZE patient data for admin view)
    const formattedBookings = recentBookings.map(booking => ({
      id: booking.id,
      patientName: booking.clientName ? booking.clientName.charAt(0) + '***' : 'Anonymous', // Anonymize patient names
      serviceName: booking.service.name,
      date: booking.start.toISOString().split('T')[0],
      status: booking.status.toLowerCase()
    }));

    const clinicDetails = {
      providers: providersWithStats,
      services: servicesWithBookings,
      recentBookings: formattedBookings
    };

    return NextResponse.json(clinicDetails);

  } catch (error) {
    console.error('Clinic details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
