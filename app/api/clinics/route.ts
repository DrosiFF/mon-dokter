import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const clinics = await prisma.clinic.findMany({
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
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        _count: {
          select: {
            providers: true,
            services: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Parse specialties for each provider
    const clinicsWithSpecialties = clinics.map(clinic => ({
      ...clinic,
      providers: clinic.providers.map(provider => ({
        ...provider,
        specialties: provider.specialties ? JSON.parse(provider.specialties) : []
      }))
    }));

    return NextResponse.json(clinicsWithSpecialties);

  } catch (error) {
    console.error('Error fetching clinics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
