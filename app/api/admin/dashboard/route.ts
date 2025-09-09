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

    // Get dashboard statistics
    const [
      totalProviders,
      pendingProviders,
      totalClinics,
      totalServices,
      totalBookings,
      recentBookings
    ] = await Promise.all([
      prisma.provider.count(),
      prisma.provider.count({
        where: {
          profile: {
            role: 'USER' // Pending providers have USER role
          }
        }
      }),
      prisma.clinic.count(),
      prisma.service.count({
        where: { isActive: true }
      }),
      prisma.booking.count(),
      prisma.booking.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          provider: {
            include: {
              profile: {
                select: { name: true }
              }
            }
          },
          service: {
            select: { name: true }
          }
        }
      })
    ]);

    // Format recent activity from bookings
    const recentActivity = recentBookings.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      message: `New booking: ${booking.service.name} with ${booking.provider.profile.name}`,
      timestamp: formatTimeAgo(booking.createdAt),
      status: booking.status.toLowerCase()
    }));

    const dashboardData = {
      totalProviders,
      pendingProviders,
      totalClinics,
      totalServices,
      totalBookings,
      recentActivity
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}
