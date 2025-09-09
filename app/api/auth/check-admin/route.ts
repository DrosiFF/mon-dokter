import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check admin emails (fallback when database not connected)
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || ['admin@mondokter.sc'];
    const isAdminEmail = user.email && adminEmails.includes(user.email);

    // Check database role (when connected)
    const isAdminRole = user.role === 'ADMIN';

    const isAdmin = isAdminEmail || isAdminRole;

    return NextResponse.json({
      isAdmin,
      role: user.role,
      method: isAdminRole ? 'database_role' : isAdminEmail ? 'email_whitelist' : 'none'
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false, error: 'Check failed' }, { status: 500 });
  }
}
