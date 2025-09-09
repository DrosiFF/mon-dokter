import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '../../../../lib/supabase'
import { sendBookingConfirmationEmail, sendProviderNotificationEmail } from '../../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      providerId, 
      serviceType, 
      selectedDate, 
      selectedTime, 
      patientNotes 
    } = await request.json()

    // Step 1: Get or create patient record
    let { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (patientError && patientError.code === 'PGRST116') {
      // Patient doesn't exist, create one
      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          user_id: userId,
          first_name: 'Patient', // You'll get this from Clerk user data
          last_name: 'User',
          email: 'patient@example.com' // You'll get this from Clerk
        })
        .select()
        .single()

      if (createError) {
        throw new Error('Failed to create patient record')
      }
      patient = newPatient
    } else if (patientError) {
      throw new Error('Failed to fetch patient record')
    }

    // Step 2: Check if time slot is available
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('provider_id', providerId)
      .eq('appointment_date', selectedDate)
      .eq('appointment_time', selectedTime)
      .eq('status', 'confirmed')
      .single()

    if (existingAppointment) {
      return NextResponse.json({ 
        success: false, 
        error: 'This time slot is already booked' 
      }, { status: 400 })
    }

    // Step 3: Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        provider_id: providerId,
        service_type: serviceType,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'pending',
        patient_notes: patientNotes
      })
      .select()
      .single()

    if (appointmentError) {
      throw new Error('Failed to create appointment')
    }

    // Step 4: Send email notifications
    try {
      // Send confirmation email to patient
      await sendBookingConfirmationEmail({
        patientName: patient.full_name,
        patientEmail: patient.email,
        providerName: `Dr. ${appointment.provider_name}`,
        clinicName: appointment.clinic_name || 'Healthcare Clinic',
        serviceName: appointment.service_name,
        appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(),
        appointmentTime: appointment.appointment_time,
        clinicAddress: 'Victoria, Mahé, Seychelles', // TODO: Get from provider data
        clinicPhone: '+248 4 123 456', // TODO: Get from provider data
        bookingId: appointment.id
      });

      // Send notification email to provider
      await sendProviderNotificationEmail({
        providerName: appointment.provider_name,
        providerEmail: 'provider@example.com', // TODO: Get from provider data
        patientName: patient.full_name,
        serviceName: appointment.service_name,
        appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(),
        appointmentTime: appointment.appointment_time,
        bookingId: appointment.id,
        action: 'new_booking'
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({ 
      success: true, 
      appointment,
      message: 'Appointment booked successfully! Confirmation email sent.'
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to book appointment' 
    }, { status: 500 })
  }
}
