import { NextRequest, NextResponse } from 'next/server';
import { requireProviderAccess } from '../../../../lib/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require provider access and get provider ID
    const { providerId } = await requireProviderAccess();

    // Get ONLY this provider's services (strict privacy)
    const services = await prisma.service.findMany({
      where: {
        providerId: providerId // Only services for THIS authenticated provider
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(services);

  } catch (error) {
    console.error('Provider services error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, durationMin, price, isActive } = body;

    // Validate required fields
    if (!name || !durationMin || !price) {
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
      }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Create new service
    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        durationMin: parseInt(durationMin),
        price: parseFloat(price),
        isActive: isActive !== false, // Default to true
        providerId: provider.id,
        clinicId: provider.clinicId
      }
    });

    return NextResponse.json(service);

  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
