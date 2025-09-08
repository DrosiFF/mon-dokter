'use client'

import { useState } from 'react'
import { MapPin, Navigation, Maximize2 } from 'lucide-react'

interface MapViewProps {
  latitude: number
  longitude: number
  title: string
  address: string
  className?: string
}

export default function MapView({ latitude, longitude, title, address, className = '' }: MapViewProps) {
  const [mapProvider, setMapProvider] = useState<'google' | 'apple' | 'openstreet'>('google')

  const mapUrls = {
    google: `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}&zoom=15`,
    apple: `https://maps.apple.com/?q=${latitude},${longitude}&z=15`,
    openstreet: `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`
  }

  const directionsUrls = {
    google: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    apple: `https://maps.apple.com/?daddr=${latitude},${longitude}`,
    openstreet: `https://www.openstreetmap.org/directions?to=${latitude},${longitude}`
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          
          {/* Map Provider Selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMapProvider('google')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                mapProvider === 'google' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setMapProvider('apple')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                mapProvider === 'apple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Apple
            </button>
            <button
              onClick={() => setMapProvider('openstreet')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                mapProvider === 'openstreet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              OSM
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{address}</p>
        
        <div className="flex gap-2">
          <a
            href={directionsUrls[mapProvider]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <button
            onClick={() => window.open(mapUrls[mapProvider], '_blank')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
            Full Screen
          </button>
        </div>
      </div>

      {/* Map Embed */}
      <div className="h-64 bg-gray-100 relative">
        {mapProvider === 'openstreet' ? (
          <iframe
            src={mapUrls.openstreet}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing ${title}`}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
              <p className="text-sm text-gray-600 mb-4">{address}</p>
              <p className="text-xs text-gray-500 mb-3">
                {mapProvider === 'google' ? 'Google Maps API key required' : 'Apple Maps integration pending'}
              </p>
              <div className="text-xs text-gray-400">
                Coordinates: {latitude}, {longitude}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


