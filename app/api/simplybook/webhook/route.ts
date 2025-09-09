import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import crypto from 'crypto';

const prisma = new PrismaClient();

// SimplyBook.me webhook event types
interface SimplybookWebhookEvent {
  event_type: 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'booking_rescheduled' | 'booking_completed';
  booking_id: number;
  service_id: number;
  provider_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  start_date_time: string;
  end_date_time: string;
  status: string;
  notes?: string;
  company: string;
  timestamp: number;
}

// Verify webhook signature (if SimplyBook provides one)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return true; // Skip verification if not configured
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Map SimplyBook status to our booking status
function mapBookingStatus(simplybookStatus: string): 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED' {
  const statusMap: { [key: string]: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED' } = {
    'pending': 'PENDING',
    'confirmed': 'ACCEPTED',
    'cancelled': 'CANCELLED',
    'completed': 'COMPLETED',
    'declined': 'DECLINED'
  };
  
  return statusMap[simplybookStatus.toLowerCase()] || 'PENDING';
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-simplybook-signature');
    const payload = await request.text();
    
    // Verify webhook signature if configured
    const webhookSecret = process.env.SIMPLYBOOK_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Parse the webhook event
    let event: SimplybookWebhookEvent;
    try {
      event = JSON.parse(payload);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('Received SimplyBook webhook:', event.event_type, event.booking_id);

    // Find the provider by SimplyBook integration
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'simplybook',
        company: event.company,
        isActive: true
      },
      include: {
        provider: {
          include: {
            services: true
          }
        }
      }
    });

    if (!integration || !integration.provider) {
      console.error('No provider found for SimplyBook company:', event.company);
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Find or create the service
    let service = integration.provider.services.find(s => s.name === `Service ${event.service_id}`);
    if (!service) {
      // Create a placeholder service if it doesn't exist
      service = await prisma.service.create({
        data: {
          name: `Service ${event.service_id}`,
          description: 'Imported from SimplyBook.me',
          durationMin: 30,
          price: 50, // Default price
          providerId: integration.provider.id,
          clinicId: integration.provider.clinicId
        }
      });
    }

    const bookingData = {
      simplybookId: event.booking_id.toString(),
      serviceId: service.id,
      providerId: integration.provider.id,
      clientName: event.client_name,
      clientEmail: event.client_email || '',
      clientPhone: event.client_phone || '',
      start: new Date(event.start_date_time),
      end: new Date(event.end_date_time),
      status: mapBookingStatus(event.status),
      notes: event.notes || ''
    };

    // Handle different event types
    switch (event.event_type) {
      case 'booking_created':
      case 'booking_confirmed':
        // Upsert the booking (create or update)
        await prisma.booking.upsert({
          where: {
            simplybookId: event.booking_id.toString()
          },
          update: bookingData,
          create: bookingData
        });
        break;

      case 'booking_cancelled':
        await prisma.booking.upsert({
          where: {
            simplybookId: event.booking_id.toString()
          },
          update: {
            ...bookingData,
            status: 'CANCELLED'
          },
          create: {
            ...bookingData,
            status: 'CANCELLED'
          }
        });
        break;

      case 'booking_rescheduled':
        await prisma.booking.upsert({
          where: {
            simplybookId: event.booking_id.toString()
          },
          update: {
            ...bookingData,
            status: 'ACCEPTED' // Rescheduled bookings are typically confirmed
          },
          create: {
            ...bookingData,
            status: 'ACCEPTED'
          }
        });
        break;

      case 'booking_completed':
        await prisma.booking.upsert({
          where: {
            simplybookId: event.booking_id.toString()
          },
          update: {
            ...bookingData,
            status: 'COMPLETED'
          },
          create: {
            ...bookingData,
            status: 'COMPLETED'
          }
        });
        break;

      default:
        console.log('Unhandled event type:', event.event_type);
    }

    // TODO: Send notifications to provider about booking changes
    // TODO: Send confirmation emails to patients
    // TODO: Update availability in our system

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      event_type: event.event_type,
      booking_id: event.booking_id
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Handle GET requests for webhook verification (if SimplyBook requires it)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    message: 'SimplyBook.me webhook endpoint',
    status: 'active'
  });
}
