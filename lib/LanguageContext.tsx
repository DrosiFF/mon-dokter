'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Language interface
interface Language {
  code: string
  name: string
  country: string
}

// Available languages
export const languages: Language[] = [
  { code: 'en', name: 'English', country: 'UK' },
  { code: 'fr', name: 'Français', country: 'FR' },
  { code: 'crs', name: 'Kreol Seselwa', country: 'SC' },
  { code: 'zh', name: '中文', country: 'CN' },
  { code: 'es', name: 'Español', country: 'ES' },
  { code: 'hi', name: 'हिन्दी', country: 'IN' },
  { code: 'ar', name: 'العربية', country: 'AE' },
  { code: 'pt', name: 'Português', country: 'PT' },
  { code: 'ru', name: 'Русский', country: 'RU' },
  { code: 'de', name: 'Deutsch', country: 'DE' },
  { code: 'it', name: 'Italiano', country: 'IT' },
  { code: 'ja', name: '日本語', country: 'JP' },
  { code: 'ko', name: '한국어', country: 'KR' },
  { code: 'tr', name: 'Türkçe', country: 'TR' },
  { code: 'nl', name: 'Nederlands', country: 'NL' },
  { code: 'sv', name: 'Svenska', country: 'SE' },
  { code: 'pl', name: 'Polski', country: 'PL' },
  { code: 'th', name: 'ไทย', country: 'TH' },
  { code: 'vi', name: 'Tiếng Việt', country: 'VN' },
  { code: 'id', name: 'Bahasa Indonesia', country: 'ID' }
]

// Context interface
interface LanguageContextType {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  showLanguageDropdown: boolean
  setShowLanguageDropdown: (show: boolean) => void
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(languages[0])
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load saved language from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedLanguageCode = localStorage.getItem('monDokterLanguage')
    if (savedLanguageCode) {
      const savedLanguage = languages.find(lang => lang.code === savedLanguageCode)
      if (savedLanguage) {
        setSelectedLanguageState(savedLanguage)
      }
    }
  }, [])

  // Save language to localStorage when changed
  const setSelectedLanguage = (language: Language) => {
    setSelectedLanguageState(language)
    if (mounted) {
      localStorage.setItem('monDokterLanguage', language.code)
    }
  }

  // Don't render children until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{
        selectedLanguage: languages[0],
        setSelectedLanguage: () => {},
        showLanguageDropdown: false,
        setShowLanguageDropdown: () => {}
      }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguage,
      showLanguageDropdown,
      setShowLanguageDropdown
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Return default values if context is not available (during SSR or initial load)
    return {
      selectedLanguage: languages[0],
      setSelectedLanguage: () => {},
      showLanguageDropdown: false,
      setShowLanguageDropdown: () => {}
    }
  }
  return context
}
