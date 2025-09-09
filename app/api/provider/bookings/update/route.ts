import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { createSimplybookClient } from '../../../../../lib/simplybook';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    // Validate required fields
    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find provider by auth ID
    const provider = await prisma.provider.findFirst({
      where: {
        profile: {
          authId: userId
        }
      },
      include: {
        integrations: {
          where: {
            type: 'simplybook',
            isActive: true
          }
        }
      }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Find the booking - STRICT CHECK: only this provider's bookings
    const booking = await prisma.booking.findFirst({
      where: {
        AND: [
          { id: bookingId },
          { providerId: provider.id } // SECURITY: Only allow updates to OWN bookings
        ]
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status in our database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    // If there's a SimplyBook integration, update the booking there too
    if (booking.simplybookId && provider.integrations.length > 0) {
      try {
        const integration = provider.integrations[0];
        const simplybookClient = createSimplybookClient();
        
        // Update booking status in SimplyBook
        await simplybookClient.updateBookingStatus(
          parseInt(booking.simplybookId),
          status.toLowerCase()
        );
      } catch (error) {
        console.error('Error updating SimplyBook booking:', error);
        // Continue even if SimplyBook update fails - our DB is the source of truth
      }
    }

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
