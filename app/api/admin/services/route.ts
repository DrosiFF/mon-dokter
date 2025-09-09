import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check when database is connected

    const services = await prisma.service.findMany({
      include: {
        clinic: {
          select: {
            name: true,
            id: true
          }
        },
        provider: {
          include: {
            profile: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response to include booking count
    const servicesWithBookings = services.map(service => ({
      ...service,
      bookingCount: service._count.bookings
    }));

    return NextResponse.json(servicesWithBookings);

  } catch (error) {
    console.error('Admin services list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
