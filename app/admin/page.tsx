'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  Stethoscope, 
  Pill, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalProviders: number;
  pendingProviders: number;
  totalClinics: number;
  totalServices: number;
  totalBookings: number;
  recentActivity: Array<{
    id: string;
    type: 'provider_application' | 'booking' | 'service_created';
    message: string;
    timestamp: string;
    status?: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProviders: 0,
    pendingProviders: 0,
    totalClinics: 0,
    totalServices: 0,
    totalBookings: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Show empty state for real testing
        setStats({
          totalProviders: 0,
          pendingProviders: 0,
          totalClinics: 0,
          totalServices: 0,
          totalBookings: 0,
          recentActivity: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Providers',
      value: stats.totalProviders,
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'cyan',
      href: '/admin/providers'
    },
    {
      name: 'Pending Applications',
      value: stats.pendingProviders,
      change: stats.pendingProviders > 0 ? 'Needs attention' : 'All clear',
      changeType: stats.pendingProviders > 0 ? 'warning' : 'success',
      icon: Clock,
      color: 'orange',
      href: '/admin/providers?status=pending'
    },
    {
      name: 'Active Clinics',
      value: stats.totalClinics,
      change: '+8%',
      changeType: 'increase',
      icon: Building2,
      color: 'emerald',
      href: '/admin/clinics'
    },
    {
      name: 'Total Services',
      value: stats.totalServices,
      change: '+23%',
      changeType: 'increase',
      icon: Stethoscope,
      color: 'purple',
      href: '/admin/services'
    },
    {
      name: 'Total Bookings',
      value: stats.totalBookings,
      change: '+18%',
      changeType: 'increase',
      icon: Calendar,
      color: 'blue',
      href: '#'
    },
    {
      name: 'Pharmacy Products',
      value: 156,
      change: '+5%',
      changeType: 'increase',
      icon: Pill,
      color: 'pink',
      href: '/admin/pharmacy'
    }
  ];

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your healthcare platform and monitor key metrics
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/providers?status=pending"
            className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
          >
            Review Applications
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
          >
            <div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon 
                    className={`h-6 w-6 text-${stat.color}-600`}
                    aria-hidden="true" 
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' 
                          ? 'text-green-600'
                          : stat.changeType === 'warning'
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== stats.recentActivity.length - 1 ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.status === 'pending' 
                              ? 'bg-orange-500'
                              : activity.status === 'confirmed' || activity.status === 'active'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}>
                            {activity.type === 'provider_application' ? (
                              <Users className="h-4 w-4 text-white" />
                            ) : activity.type === 'booking' ? (
                              <Calendar className="h-4 w-4 text-white" />
                            ) : (
                              <Stethoscope className="h-4 w-4 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">{activity.message}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link
                href="/admin/providers?status=pending"
                className="w-full flex items-center justify-between p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="font-medium text-gray-900">Review Provider Applications</span>
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {stats.pendingProviders} pending
                </span>
              </Link>

              <Link
                href="/admin/clinics"
                className="w-full flex items-center justify-between p-4 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-cyan-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Clinics</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {stats.totalClinics} active
                </span>
              </Link>

              <Link
                href="/admin/services"
                className="w-full flex items-center justify-between p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center">
                  <Stethoscope className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Services</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {stats.totalServices} services
                </span>
              </Link>

              <Link
                href="/admin/pharmacy"
                className="w-full flex items-center justify-between p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center">
                  <Pill className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Pharmacy Inventory</span>
                </div>
                <span className="text-gray-500 text-sm">
                  156 products
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Platform Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Authentication</p>
                  <p className="text-sm text-gray-500">Clerk - Active</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-500">Connection pending</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Booking System</p>
                  <p className="text-sm text-gray-500">SimplyBook.me ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
