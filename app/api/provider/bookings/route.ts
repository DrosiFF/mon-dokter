import { NextRequest, NextResponse } from 'next/server';
import { requireProviderAccess } from '../../../../lib/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require provider access and get provider ID
    const { providerId } = await requireProviderAccess();

    // Get ONLY this provider's bookings (strict privacy)
    const bookings = await prisma.booking.findMany({
      where: {
        providerId: providerId // Only bookings for THIS authenticated provider
      },
      include: {
        service: {
          select: {
            name: true,
            durationMin: true,
            price: true
          }
        }
      },
      orderBy: {
        start: 'desc'
      },
      take: 50 // Limit to recent 50 bookings
    });

    return NextResponse.json(bookings);

  } catch (error) {
    console.error('Provider bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
