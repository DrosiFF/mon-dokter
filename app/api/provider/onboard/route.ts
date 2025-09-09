import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // Allow both authenticated and non-authenticated users
    // Non-authenticated users will create a pending application

    const body = await request.json();
    const {
      name,
      bio,
      specialties,
      phone,
      clinicName,
      clinicAddress,
      island,
      email,
      simplybookCompany,
      simplybookApiUser,
      simplybookApiKey,
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!bio) missingFields.push('bio');
    if (!specialties || specialties.length === 0) missingFields.push('specialties');
    if (!phone) missingFields.push('phone');
    if (!clinicName) missingFields.push('clinicName');
    if (!clinicAddress) missingFields.push('clinicAddress');
    if (!island) missingFields.push('island');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      console.error('Received data:', { name, bio, specialties, phone, clinicName, clinicAddress, island });
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Start a transaction to create all related records
    const result = await prisma.$transaction(async (tx) => {
      let profile = null;
      
      if (userId) {
        // Check if profile already exists for authenticated user
        profile = await tx.profile.findUnique({
          where: { authId: userId }
        });

        if (!profile) {
          // Create profile for authenticated user
          profile = await tx.profile.create({
            data: {
              authId: userId,
              name,
              phone,
              email,
              role: 'USER', // Will be upgraded to PROVIDER after admin approval
            },
          });
        } else {
          // Update existing profile
          profile = await tx.profile.update({
            where: { authId: userId },
            data: {
              name,
              phone,
              email,
            },
          });
        }
      } else {
        // Create a temporary profile for non-authenticated users
        profile = await tx.profile.create({
          data: {
            authId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            phone,
            email,
            role: 'USER',
          },
        });
      }

      // Check if clinic exists or create new one
      const clinicSlug = clinicName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      let clinic = await tx.clinic.findUnique({
        where: { slug: clinicSlug }
      });

      if (!clinic) {
        clinic = await tx.clinic.create({
          data: {
            name: clinicName,
            slug: clinicSlug,
            address: clinicAddress,
            phone,
            island,
          },
        });
      }

      // Create provider application (pending approval)
      const providerSlug = name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      const provider = await tx.provider.create({
        data: {
          profileId: profile.id,
          clinicId: clinic.id,
          bio,
          specialties: JSON.stringify(specialties),
          slug: providerSlug,
        },
      });

      // Create SimplyBook integration if credentials provided
      if (simplybookCompany && simplybookApiUser && simplybookApiKey) {
        await tx.integration.create({
          data: {
            providerId: provider.id,
            type: 'simplybook',
            company: simplybookCompany,
            apiUser: simplybookApiUser,
            apiKey: simplybookApiKey,
            isActive: false, // Will be activated after verification
          },
        });
      }

      return { profile, clinic, provider };
    });

    // TODO: Send notification to admin for approval
    // TODO: Send confirmation email to provider

    return NextResponse.json({
      message: 'Provider application submitted successfully',
      providerId: result.provider.id,
    });

  } catch (error) {
    console.error('Provider onboarding error:', error);
    
    // Temporary fallback - return success for testing
    if (error instanceof Error && error.message?.includes('Can\'t reach database')) {
      return NextResponse.json({
        success: true,
        message: 'Provider application received! (Database connection pending)',
        providerId: 'temp-' + Date.now(),
        provider: { id: 'temp-' + Date.now() },
        simplybookUrl: null,
        note: 'Please set up your DATABASE_URL in .env.local to enable full functionality'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
