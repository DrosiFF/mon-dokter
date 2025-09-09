/**
 * Admin Authentication Helper
 * 
 * This module handles admin role verification and access control
 */

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin email addresses (hardcoded for initial setup)
const ADMIN_EMAILS = [
  'admin@mondokter.sc',
  'drosi@mondokter.sc', // Your email
  // Add more admin emails here
];

/**
 * Check if the current user has admin access
 */
export async function checkAdminAccess(): Promise<{
  isAdmin: boolean;
  user: any;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { isAdmin: false, user: null, error: 'Not authenticated' };
    }

    // Method 1: Check by email (immediate, works without database)
    const user = await auth();
    const userEmail = user.sessionClaims?.email as string;
    
    if (ADMIN_EMAILS.includes(userEmail)) {
      return { isAdmin: true, user: user.sessionClaims };
    }

    // Method 2: Check by database role (when database is connected)
    try {
      const profile = await prisma.profile.findUnique({
        where: { authId: userId },
        select: { role: true, name: true, email: true }
      });

      if (profile?.role === 'ADMIN') {
        return { isAdmin: true, user: profile };
      }
    } catch (dbError) {
      console.log('Database not available for role check, using email fallback');
    }

    return { isAdmin: false, user: user.sessionClaims, error: 'Admin access required' };

  } catch (error) {
    console.error('Admin access check error:', error);
    return { isAdmin: false, user: null, error: 'Authentication error' };
  }
}

/**
 * Middleware helper to protect admin routes
 */
export async function requireAdminAccess() {
  const { isAdmin, error } = await checkAdminAccess();
  
  if (!isAdmin) {
    throw new Error(error || 'Admin access required');
  }
  
  return true;
}

/**
 * Create the first admin user (run once during setup)
 */
export async function createAdminUser(email: string, name: string) {
  try {
    // This would be called during initial setup
    const profile = await prisma.profile.create({
      data: {
        authId: `admin_${Date.now()}`, // Temporary until real user signs up
        email,
        name,
        role: 'ADMIN'
      }
    });

    return profile;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}
