'use client';

import { useEffect } from 'react';

interface BookingEmbedProps {
  company: string;
  serviceId?: string;
  providerId?: string;
  theme?: 'light' | 'dark';
  width?: string;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    SimplybookWidget: any;
  }
}

export default function BookingEmbed({
  company,
  serviceId,
  providerId,
  theme = 'light',
  width = '100%',
  height = '600px',
  className = ''
}: BookingEmbedProps) {
  const widgetId = `simplybook-widget-${company}-${Date.now()}`;

  useEffect(() => {
    // Load SimplyBook.me widget script
    const script = document.createElement('script');
    script.src = 'https://widget.simplybook.me/v2/widget/widget.js';
    script.async = true;
    script.onload = () => {
      if (window.SimplybookWidget) {
        // Initialize the widget
        const config: any = {
          widget_type: 'iframe',
          url: `https://${company}.simplybook.me`,
          theme: theme,
          theme_settings: {
            timeline_hide_unavailable: '1',
            timeline_show_end_time: '0',
            timeline_modern_display: '1',
            calendarPrimaryColor: '#0891b2', // Cyan-600
            font_selected: 'Arial',
            sb_base_color: '#0891b2',
            display_item_mode: 'block',
            booking_nav_bg_color: '#f0f9ff', // Cyan-50
            body_bg_color: '#ffffff',
            sb_review_image: '',
            dark_font_color: '#1f2937', // Gray-800
            light_font_color: '#6b7280', // Gray-500
            sb_company_label_color: '#0891b2',
            hide_img_mode: '0',
            sb_busy: '#ef4444', // Red-500
            sb_available: '#10b981' // Emerald-500
          },
          timeline: 'modern',
          datepicker: 'top_calendar',
          is_rtl: false,
          app_config: {
            allow_switch_to_ada: 0,
            predefined: {}
          }
        };

        // Add service filter if provided
        if (serviceId) {
          config.app_config.predefined.service = serviceId;
        }

        // Add provider filter if provided
        if (providerId) {
          config.app_config.predefined.provider = providerId;
        }

        // Create widget container
        const container = document.getElementById(widgetId);
        if (container) {
          window.SimplybookWidget(config, container);
        }
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [company, serviceId, providerId, theme, widgetId]);

  return (
    <div className={`booking-embed-container ${className}`}>
      <div
        id={widgetId}
        style={{
          width,
          height,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Loading placeholder */}
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking system...</p>
          </div>
        </div>
      </div>
      
      {/* Fallback link if widget fails to load */}
      <div className="mt-4 text-center">
        <a
          href={`https://${company}.simplybook.me${serviceId ? `?service=${serviceId}` : ''}${providerId ? `&provider=${providerId}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-700 text-sm"
        >
          Open booking page in new window →
        </a>
      </div>
    </div>
  );
}

// Alternative lightweight component for simple booking links
export function BookingLink({
  company,
  serviceId,
  providerId,
  children,
  className = ''
}: {
  company: string;
  serviceId?: string;
  providerId?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const bookingUrl = `https://${company}.simplybook.me${serviceId ? `?service=${serviceId}` : ''}${providerId ? `&provider=${providerId}` : ''}`;

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-emerald-700 transition-all duration-200 ${className}`}
    >
      {children}
    </a>
  );
}
