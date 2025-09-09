/**
 * Authorization Utilities
 * 
 * Centralized authorization logic for data privacy and security
 */

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthUser {
  userId: string;
  email?: string;
  role?: string;
  providerId?: string;
  clinicId?: string;
}

/**
 * Get authenticated user with role and provider information
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // Try to get user profile with role
    try {
      const profile = await prisma.profile.findUnique({
        where: { authId: userId },
        include: {
          provider: {
            select: {
              id: true,
              clinicId: true
            }
          }
        }
      });

      return {
        userId,
        email: profile?.email || undefined,
        role: profile?.role || 'USER',
        providerId: profile?.provider?.id || undefined,
        clinicId: profile?.provider?.clinicId || undefined
      };
    } catch (dbError) {
      // Database not connected - return basic auth info
      return {
        userId,
        role: 'USER'
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Check if user has admin access (throws error if not)
 */
export async function requireAdminAccess(): Promise<AuthUser> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  // Check admin emails (fallback when database not connected)
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  const isAdminEmail = user.email && adminEmails.includes(user.email);

  // Check database role (when connected)
  const isAdminRole = user.role === 'ADMIN';

  if (!isAdminEmail && !isAdminRole) {
    throw new Error('Admin access required');
  }

  return user;
}

/**
 * Check if user has provider access
 */
export async function requireProviderAccess(): Promise<AuthUser & { providerId: string }> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== 'PROVIDER' || !user.providerId) {
    throw new Error('Provider access required');
  }

  return {
    ...user,
    providerId: user.providerId
  };
}

/**
 * Check if user can access specific provider data
 */
export async function canAccessProviderData(targetProviderId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return false;
  }

  // Admin can access all data
  if (user.role === 'ADMIN') {
    return true;
  }

  // Provider can only access their own data
  if (user.role === 'PROVIDER' && user.providerId === targetProviderId) {
    return true;
  }

  return false;
}

/**
 * Check if user can access specific clinic data
 */
export async function canAccessClinicData(targetClinicId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return false;
  }

  // Admin can access all data
  if (user.role === 'ADMIN') {
    return true;
  }

  // Provider can only access their own clinic data
  if (user.role === 'PROVIDER' && user.clinicId === targetClinicId) {
    return true;
  }

  return false;
}
