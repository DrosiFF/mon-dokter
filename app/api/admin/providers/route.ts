import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '../../../../lib/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require admin access
    await requireAdminAccess();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let whereClause: any = {};
    
    // Filter by status if provided
    if (statusFilter) {
      if (statusFilter === 'pending') {
        whereClause.profile = { role: 'USER' };
      } else if (statusFilter === 'approved') {
        whereClause.profile = { role: 'PROVIDER' };
      }
    }

    const providers = await prisma.provider.findMany({
      where: whereClause,
      include: {
        profile: {
          select: {
            name: true,
            email: true,
            phone: true,
            role: true
          }
        },
        clinic: {
          select: {
            name: true,
            address: true,
            island: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse specialties and add status
    const providersWithStatus = providers.map(provider => {
      let specialties: string[] = [];
      try {
        specialties = provider.specialties ? JSON.parse(provider.specialties) : [];
      } catch (e) {
        specialties = [];
      }

      const status = provider.profile.role === 'PROVIDER' ? 'approved' : 'pending';

      return {
        ...provider,
        specialties,
        status
      };
    });

    return NextResponse.json(providersWithStatus);

  } catch (error) {
    console.error('Admin providers list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
