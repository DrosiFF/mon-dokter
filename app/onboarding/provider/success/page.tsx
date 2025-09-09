'use client';

import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProviderOnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your interest in joining MON DOKTER as a healthcare provider. 
            Your application has been received and is currently under review.
          </p>
          
          <div className="bg-cyan-50 border border-cyan-200 rounded-md p-4 mb-6">
            <h2 className="font-semibold text-cyan-900 mb-2">What happens next?</h2>
            <ul className="text-sm text-cyan-800 space-y-1 text-left">
              <li>• Our team will review your application within 2-3 business days</li>
              <li>• We may contact you for additional information or verification</li>
              <li>• Once approved, you'll receive access to your provider dashboard</li>
              <li>• You can then set up your services, availability, and start accepting bookings</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/profile')}
              className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Go to Profile
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@mondokter.sc" className="text-cyan-600 hover:text-cyan-700">
                support@mondokter.sc
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
