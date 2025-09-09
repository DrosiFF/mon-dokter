/**
 * SimplyBook.me API Integration Helper
 * 
 * This module provides a wrapper around SimplyBook.me's JSON-RPC API
 * for managing services, providers, and bookings.
 * 
 * API Documentation: https://simplybook.me/en/api/
 */

interface SimplybookCredentials {
  company: string;
  apiUser: string;
  apiKey: string;
}

interface SimplybookService {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  is_active: boolean;
}

interface SimplybookBooking {
  id: number;
  service_id: number;
  provider_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  start_date_time: string;
  end_date_time: string;
  status: string;
}

interface SimplybookProvider {
  id: number;
  name: string;
  email: string;
  description: string;
  is_active: boolean;
}

class SimplybookAPI {
  private company: string;
  private apiUser: string;
  private apiKey: string;
  private token: string | null = null;
  private baseUrl: string;

  constructor(credentials: SimplybookCredentials) {
    this.company = credentials.company;
    this.apiUser = credentials.apiUser;
    this.apiKey = credentials.apiKey;
    this.baseUrl = `https://user-api.simplybook.me/${this.company}`;
  }

  /**
   * Authenticate with SimplyBook.me API
   */
  async login(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'getToken',
          params: [this.apiUser, this.apiKey],
          id: 1,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`SimplyBook login error: ${data.error.message}`);
      }

      this.token = data.result;
      return this.token!;
    } catch (error) {
      console.error('SimplyBook login failed:', error);
      throw error;
    }
  }

  /**
   * Make an authenticated API call
   */
  private async apiCall(method: string, params: any[] = []): Promise<any> {
    if (!this.token) {
      await this.login();
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Login': this.company,
          'X-Token': this.token!,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: Date.now(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        // Token might be expired, try to re-login once
        if (data.error.code === -32000) {
          await this.login();
          return this.apiCall(method, params);
        }
        throw new Error(`SimplyBook API error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`SimplyBook API call failed (${method}):`, error);
      throw error;
    }
  }

  /**
   * Get all services
   */
  async getServices(): Promise<SimplybookService[]> {
    return this.apiCall('getEventList');
  }

  /**
   * Create a new service
   */
  async createService(service: Omit<SimplybookService, 'id'>): Promise<SimplybookService> {
    return this.apiCall('addEvent', [service]);
  }

  /**
   * Update an existing service
   */
  async updateService(serviceId: number, updates: Partial<SimplybookService>): Promise<boolean> {
    return this.apiCall('editEvent', [serviceId, updates]);
  }

  /**
   * Delete a service
   */
  async deleteService(serviceId: number): Promise<boolean> {
    return this.apiCall('deleteEvent', [serviceId]);
  }

  /**
   * Get all providers/performers
   */
  async getProviders(): Promise<SimplybookProvider[]> {
    return this.apiCall('getUnitList');
  }

  /**
   * Create a new provider
   */
  async createProvider(provider: Omit<SimplybookProvider, 'id'>): Promise<SimplybookProvider> {
    return this.apiCall('addUnit', [provider]);
  }

  /**
   * Update an existing provider
   */
  async updateProvider(providerId: number, updates: Partial<SimplybookProvider>): Promise<boolean> {
    return this.apiCall('editUnit', [providerId, updates]);
  }

  /**
   * Get all bookings
   */
  async getBookings(dateFrom?: string, dateTo?: string): Promise<SimplybookBooking[]> {
    const params = [];
    if (dateFrom) params.push(dateFrom);
    if (dateTo) params.push(dateTo);
    
    return this.apiCall('getBookings', params);
  }

  /**
   * Create a new booking
   */
  async createBooking(booking: Omit<SimplybookBooking, 'id'>): Promise<SimplybookBooking> {
    return this.apiCall('addBooking', [booking]);
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: number, status: string): Promise<boolean> {
    return this.apiCall('editBooking', [bookingId, { status }]);
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: number): Promise<boolean> {
    return this.apiCall('cancelBooking', [bookingId]);
  }

  /**
   * Get available time slots for a service and provider
   */
  async getAvailableSlots(serviceId: number, providerId: number, date: string): Promise<string[]> {
    return this.apiCall('getStartTimeMatrix', [date, date, serviceId, providerId]);
  }
}

/**
 * Create a SimplyBook API instance from environment variables
 */
export function createSimplybookClient(): SimplybookAPI {
  const company = process.env.SIMPLYBOOK_COMPANY;
  const apiUser = process.env.SIMPLYBOOK_API_USER;
  const apiKey = process.env.SIMPLYBOOK_API_KEY;

  if (!company || !apiUser || !apiKey) {
    throw new Error('Missing SimplyBook.me credentials in environment variables');
  }

  return new SimplybookAPI({ company, apiUser, apiKey });
}

/**
 * Create a SimplyBook API instance with custom credentials
 */
export function createSimplybookClientWithCredentials(credentials: SimplybookCredentials): SimplybookAPI {
  return new SimplybookAPI(credentials);
}

export { SimplybookAPI };
export type { SimplybookCredentials, SimplybookService, SimplybookBooking, SimplybookProvider };
