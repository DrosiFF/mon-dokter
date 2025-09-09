import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types for MON DOKTER
export interface Provider {
  id: string
  business_name: string
  owner_name: string
  email: string
  phone?: string
  address: string
  island: string
  business_type: 'clinic' | 'pharmacy' | 'wellness'
  specialties: string[]
  description?: string
  simplybook_url?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  provider_id: string
  service_type: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  patient_notes?: string
  provider_notes?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  user_id: string // Clerk user ID
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  emergency_contact?: string
  medical_conditions?: string[]
  allergies?: string[]
  created_at: string
  updated_at: string
}

