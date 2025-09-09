'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Shield, Settings } from 'lucide-react';

export default function AdminLink({ variant = 'header' }: { variant?: 'header' | 'sidebar' | 'button' }) {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkAdminAccess();
    } else if (isLoaded) {
      setChecking(false);
    }
  }, [user, isLoaded]);

  const checkAdminAccess = async () => {
    try {
      const userEmail = user?.emailAddresses[0]?.emailAddress;
      
      // Check admin emails from environment
      const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@mondokter.sc,drosi@mondokter.sc';
      const adminEmails = adminEmailsEnv.split(',').map(email => email.trim());
      
      // Check if user email is in admin list
      const isAdminEmail = userEmail && adminEmails.includes(userEmail);
      
      if (isAdminEmail) {
        setIsAdmin(true);
      } else {
        // Try to check database role
        try {
          const response = await fetch('/api/auth/check-admin');
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.isAdmin);
          }
        } catch (error) {
          console.log('Database role check failed, using email fallback');
        }
      }
    } catch (error) {
      console.error('Admin check error:', error);
    } finally {
      setChecking(false);
    }
  };

  // Don't show anything while checking or if not admin
  if (checking || !isAdmin) {
    return null;
  }

  // Header variant (for main navigation)
  if (variant === 'header') {
    return (
      <Link 
        href="/admin"
        className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 text-sm font-medium border border-white/20 flex items-center"
      >
        <Shield className="w-4 h-4 mr-1" />
        Admin
      </Link>
    );
  }

  // Button variant (for profile pages, etc.)
  if (variant === 'button') {
    return (
      <Link
        href="/admin"
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        <Settings className="w-4 h-4 mr-2" />
        Admin Dashboard
      </Link>
    );
  }

  // Sidebar variant (for dashboard sidebars)
  if (variant === 'sidebar') {
    return (
      <Link
        href="/admin"
        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200"
      >
        <Shield className="h-5 w-5 shrink-0" />
        Admin Panel
      </Link>
    );
  }

  return null;
}
