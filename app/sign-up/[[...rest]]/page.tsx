'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useLanguage } from '../../../lib/LanguageContext'
import { getTranslation } from '../../../lib/translations'

export default function SignUpPage() {
  const { selectedLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                MON DOKTER
              </span>
            </Link>
            <Link 
              href="/sign-in" 
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {getTranslation(selectedLanguage.code, 'signIn') || 'Sign In'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {getTranslation(selectedLanguage.code, 'createAccount') || 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {getTranslation(selectedLanguage.code, 'signUpSubtitle') || 'Join MON DOKTER and manage your healthcare'}
            </p>
          </div>

          {/* Seychelles Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 mt-0.5">🇸🇨</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Welcome to MON DOKTER Seychelles!</p>
                <p>Sign up is simple - just your email and password. No phone verification required for our island community.</p>
              </div>
            </div>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105',
                  card: 'shadow-none border-none bg-transparent',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 
                    'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200',
                  formFieldInput: 
                    'rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500',
                  footerActionLink: 
                    'text-emerald-600 hover:text-emerald-700',
                }
              }}
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              afterSignUpUrl="/profile"
              redirectUrl="/profile"
              // Force skip phone verification
            />
          </div>

          {/* Additional Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {getTranslation(selectedLanguage.code, 'haveAccount') || 'Already have an account?'}{' '}
              <Link 
                href="/sign-in" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {getTranslation(selectedLanguage.code, 'signInHere') || 'Sign in here'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a1"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="m-100 0 200 200-200 200Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a1)" />
        </svg>
      </div>
    </div>
  )
}
