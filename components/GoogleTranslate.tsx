'use client'

import { useEffect, useState } from 'react'

interface GoogleTranslateConfig {
  pageLanguage: string
  includedLanguages: string
  layout: string
  autoDisplay: boolean
  multilanguagePage: boolean
}

interface GoogleTranslateElement {
  InlineLayout: {
    SIMPLE: string
  }
  new (config: GoogleTranslateConfig, elementId: string): unknown
}

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: GoogleTranslateElement
      }
    }
    googleTranslateElementInit: () => void
  }
}

interface GoogleTranslateProps {
  selectedLanguage: { code: string; name: string; country: string }
}

const TranslationIndicator = ({ isTranslating, language }: { isTranslating: boolean; language: string }) => {
  if (!isTranslating || language === 'en') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      <span className="text-sm font-medium">Translating to {language}...</span>
    </div>
  )
}

export default function GoogleTranslate({ selectedLanguage }: GoogleTranslateProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  useEffect(() => {
    // Load Google Translate script
    const addScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.type = 'text/javascript'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        document.body.appendChild(script)
      }
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,es,de,it,pt,ru,ja,ko,zh,hi,ar,tr,nl,sv,pl,th,vi,id',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        )
      }
    }

    addScript()
  }, [])

  // Trigger translation when language changes
  useEffect(() => {
    const triggerTranslation = () => {
      setIsTranslating(true)
      
      const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (googleTranslateCombo && selectedLanguage.code !== 'en') {
        // Map our language codes to Google Translate codes
        const languageMap: { [key: string]: string } = {
          'fr': 'fr',
          'es': 'es', 
          'de': 'de',
          'it': 'it',
          'pt': 'pt',
          'ru': 'ru',
          'ja': 'ja',
          'ko': 'ko',
          'zh': 'zh',
          'hi': 'hi',
          'ar': 'ar',
          'tr': 'tr',
          'nl': 'nl',
          'sv': 'sv',
          'pl': 'pl',
          'th': 'th',
          'vi': 'vi',
          'id': 'id',
          'crs': 'fr' // Fallback Seychellois Creole to French
        }
        
        const googleLangCode = languageMap[selectedLanguage.code]
        if (googleLangCode) {
          googleTranslateCombo.value = googleLangCode
          googleTranslateCombo.dispatchEvent(new Event('change'))
        }
      } else if (googleTranslateCombo && selectedLanguage.code === 'en') {
        // Reset to English
        googleTranslateCombo.value = ''
        googleTranslateCombo.dispatchEvent(new Event('change'))
      }
      
      // Hide translation indicator after delay
      setTimeout(() => setIsTranslating(false), 2000)
    }

    // Wait a bit for Google Translate to load
    const timer = setTimeout(triggerTranslation, 1000)
    return () => clearTimeout(timer)
  }, [selectedLanguage])

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Translation Indicator */}
      <TranslationIndicator 
        isTranslating={isTranslating} 
        language={selectedLanguage.name} 
      />
      
      {/* Custom CSS to hide Google Translate UI */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-menu-frame {
          display: none !important;
        }
        
        .goog-te-combo {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .goog-te-balloon-frame {
          display: none !important;
        }
        
        .goog-te-ftab {
          display: none !important;
        }
        
        /* Hide the "Powered by Google Translate" */
        .goog-logo-link {
          display: none !important;
        }
        
        .goog-te-gadget {
          color: transparent !important;
        }
        
        .goog-te-gadget > span > a {
          display: none !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          color: transparent !important;
        }

        /* Smooth translation transition */
        body {
          transition: opacity 0.3s ease-in-out;
        }
        
        .goog-te-combo {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  )
}
