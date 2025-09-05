'use client'

import { useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage, languages } from '../lib/LanguageContext'

interface LanguagePickerProps {
  variant?: 'header' | 'hero'
  className?: string
}

export default function LanguagePicker({ variant = 'header', className = '' }: LanguagePickerProps) {
  const { selectedLanguage, setSelectedLanguage, showLanguageDropdown, setShowLanguageDropdown } = useLanguage()
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowLanguageDropdown])

  if (variant === 'hero') {
    // Hero version - large, prominent, colorful
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl touch-manipulation"
          >
            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-200" />
            <span className="font-semibold text-base sm:text-lg">{selectedLanguage.name}</span>
            <span className="text-xs sm:text-sm text-cyan-200">({selectedLanguage.country})</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-200" />
          </button>
          
          {/* Mobile-optimized Language Dropdown */}
          {showLanguageDropdown && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 sm:p-4">
                <div className="text-center py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl mb-3">
                  <h3 className="font-bold text-base sm:text-lg">Choose Your Language</h3>
                  <p className="text-xs sm:text-sm text-cyan-100">Select your preferred language • 20 languages available</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 sm:max-h-80 overflow-y-auto">
                  {languages.map((language, index) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500', 
                      'from-orange-500 to-red-500',
                      'from-purple-500 to-pink-500',
                      'from-yellow-500 to-orange-500',
                      'from-indigo-500 to-purple-500',
                      'from-green-500 to-emerald-500',
                      'from-pink-500 to-rose-500',
                      'from-red-500 to-pink-500',
                      'from-teal-500 to-cyan-500',
                      'from-violet-500 to-purple-500',
                      'from-sky-500 to-blue-500',
                      'from-rose-500 to-pink-500',
                      'from-amber-500 to-orange-500',
                      'from-lime-500 to-green-500',
                      'from-cyan-500 to-blue-500',
                      'from-fuchsia-500 to-purple-500',
                      'from-emerald-500 to-cyan-500',
                      'from-orange-500 to-yellow-500',
                      'from-blue-500 to-indigo-500'
                    ]
                    return (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language)
                          setShowLanguageDropdown(false)
                        }}
                        className={`p-2.5 sm:p-3 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg touch-manipulation active:scale-95 ${
                          selectedLanguage.code === language.code 
                            ? `bg-gradient-to-r ${colors[index % colors.length]} ring-2 ring-white shadow-lg scale-105` 
                            : `bg-gradient-to-r ${colors[index % colors.length]} opacity-80 hover:opacity-100`
                        }`}
                      >
                        <div className="text-sm sm:text-base font-bold">{language.name}</div>
                        <div className="text-xs opacity-90">{language.country}</div>
                      </button>
                    )
                  })}
                </div>
                <div className="text-center mt-3 py-2 text-xs text-gray-600">
                  Your language preference will be remembered
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Header version - compact
  return (
    <div className={`relative ${className}`} ref={languageDropdownRef}>
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:bg-emerald-50 rounded-lg"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Minimal Language Dropdown */}
      {showLanguageDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-56 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="text-center py-2 mb-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg">
              <h4 className="font-semibold text-sm">Select Language</h4>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setSelectedLanguage(language)
                    setShowLanguageDropdown(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-150 hover:bg-emerald-50 hover:scale-[1.02] ${
                    selectedLanguage.code === language.code 
                      ? 'bg-emerald-100 text-emerald-700 font-medium' 
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{language.name}</span>
                    <span className="text-xs text-gray-400">{language.country}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
