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

    // Find provider by auth ID
    const provider = await prisma.provider.findFirst({
      where: {
        profile: {
          authId: userId
        }
      },
      include: {
        profile: {
          select: {
            name: true,
            phone: true,
            email: true,
            role: true
          }
        },
        clinic: {
          select: {
            name: true,
            address: true,
            island: true,
            phone: true
          }
        }
      }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Check if user has PROVIDER role
    if (provider.profile.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Provider access not approved' }, { status: 403 });
    }

    // Parse specialties from JSON string
    let specialties: string[] = [];
    try {
      specialties = provider.specialties ? JSON.parse(provider.specialties) : [];
    } catch (e) {
      console.error('Error parsing specialties:', e);
      specialties = [];
    }

    const providerData = {
      id: provider.id,
      profile: provider.profile,
      specialties,
      bio: provider.bio,
      clinic: provider.clinic,
      slug: provider.slug
    };

    return NextResponse.json(providerData);

  } catch (error) {
    console.error('Provider profile error:', error);
    
    // Temporary fallback for database connection issues
    if (error.message?.includes('Can\'t reach database')) {
      return NextResponse.json({ 
        error: 'Provider not found',
        note: 'Database connection pending - please set up DATABASE_URL' 
      }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
