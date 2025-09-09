/**
 * Email Notification System
 * 
 * Handles all email communications for the MON DOKTER platform
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingConfirmationEmailData {
  patientName: string;
  patientEmail: string;
  providerName: string;
  clinicName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicAddress: string;
  clinicPhone: string;
  bookingId: string;
}

interface ProviderNotificationEmailData {
  providerName: string;
  providerEmail: string;
  patientName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  bookingId: string;
  action?: 'new_booking' | 'booking_cancelled' | 'booking_rescheduled';
}

interface ProviderApprovalEmailData {
  providerName: string;
  providerEmail: string;
  clinicName: string;
  status: 'approved' | 'rejected';
  dashboardUrl: string;
}

/**
 * Send booking confirmation email to patient
 */
export async function sendBookingConfirmationEmail(data: BookingConfirmationEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'MON DOKTER <noreply@mondokter.sc>',
      to: [data.patientEmail],
      subject: `Appointment Confirmed - ${data.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Appointment Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .info-box { background: #f0f9ff; border: 1px solid #0891b2; border-radius: 6px; padding: 20px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏥 MON DOKTER</h1>
                <h2>Appointment Confirmed!</h2>
              </div>
              
              <div class="content">
                <p>Dear <strong>${data.patientName}</strong>,</p>
                
                <p>Your appointment has been successfully confirmed. Here are your appointment details:</p>
                
                <div class="info-box">
                  <h3>📅 Appointment Details</h3>
                  <p><strong>Service:</strong> ${data.serviceName}</p>
                  <p><strong>Provider:</strong> ${data.providerName}</p>
                  <p><strong>Date:</strong> ${data.appointmentDate}</p>
                  <p><strong>Time:</strong> ${data.appointmentTime}</p>
                  <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                </div>
                
                <div class="info-box">
                  <h3>📍 Clinic Information</h3>
                  <p><strong>Clinic:</strong> ${data.clinicName}</p>
                  <p><strong>Address:</strong> ${data.clinicAddress}</p>
                  <p><strong>Phone:</strong> ${data.clinicPhone}</p>
                </div>
                
                <h3>📝 Important Notes:</h3>
                <ul>
                  <li>Please arrive 15 minutes before your appointment</li>
                  <li>Bring a valid ID and any relevant medical records</li>
                  <li>If you need to reschedule, please call the clinic at least 24 hours in advance</li>
                </ul>
                
                <p>We look forward to seeing you!</p>
                
                <p>Best regards,<br>
                The MON DOKTER Team</p>
              </div>
              
              <div class="footer">
                <p>Need help? Contact us at support@mondokter.sc or +248 4 123 456</p>
                <p>This email was sent regarding your booking with MON DOKTER Healthcare Platform</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Booking confirmation email sent:', result?.id);
    return { success: true, emailId: result?.id };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

/**
 * Send notification email to provider about new booking
 */
export async function sendProviderNotificationEmail(data: ProviderNotificationEmailData) {
  try {
    const actionText = {
      'new_booking': 'New Appointment Booking',
      'booking_cancelled': 'Appointment Cancelled',
      'booking_rescheduled': 'Appointment Rescheduled'
    };

    const { data: result, error } = await resend.emails.send({
      from: 'MON DOKTER <noreply@mondokter.sc>',
      to: [data.providerEmail],
      subject: `${actionText[data.action || 'new_booking']} - ${data.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Provider Notification</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .info-box { background: #f0f9ff; border: 1px solid #0891b2; border-radius: 6px; padding: 20px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏥 MON DOKTER</h1>
                <h2>${actionText[data.action || 'new_booking']}</h2>
              </div>
              
              <div class="content">
                <p>Dear <strong>Dr. ${data.providerName}</strong>,</p>
                
                <p>You have a ${data.action === 'new_booking' ? 'new appointment booking' : 'booking update'}:</p>
                
                <div class="info-box">
                  <h3>📅 Appointment Details</h3>
                  <p><strong>Patient:</strong> ${data.patientName}</p>
                  <p><strong>Service:</strong> ${data.serviceName}</p>
                  <p><strong>Date:</strong> ${data.appointmentDate}</p>
                  <p><strong>Time:</strong> ${data.appointmentTime}</p>
                  <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                </div>
                
                ${data.action === 'new_booking' ? `
                  <p><strong>Action Required:</strong> Please review and confirm this appointment in your provider dashboard.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider-dashboard" class="button">
                      Review Booking
                    </a>
                  </div>
                ` : ''}
                
                <p>Best regards,<br>
                The MON DOKTER Team</p>
              </div>
              
              <div class="footer">
                <p>Manage your appointments at ${process.env.NEXT_PUBLIC_APP_URL}/provider-dashboard</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Provider notification email failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Provider notification email sent:', result?.id);
    return { success: true, emailId: result?.id };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

/**
 * Send provider approval/rejection notification
 */
export async function sendProviderApprovalEmail(data: ProviderApprovalEmailData) {
  try {
    const isApproved = data.status === 'approved';
    
    const { data: result, error } = await resend.emails.send({
      from: 'MON DOKTER <noreply@mondokter.sc>',
      to: [data.providerEmail],
      subject: `Provider Application ${isApproved ? 'Approved' : 'Update'} - MON DOKTER`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Provider Application ${data.status}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, ${isApproved ? '#10b981' : '#f59e0b'} 0%, ${isApproved ? '#0891b2' : '#ef4444'} 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .success-box { background: #f0fdf4; border: 1px solid #10b981; border-radius: 6px; padding: 20px; margin: 20px 0; }
              .warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏥 MON DOKTER</h1>
                <h2>Provider Application ${isApproved ? 'Approved!' : 'Update'}</h2>
              </div>
              
              <div class="content">
                <p>Dear <strong>Dr. ${data.providerName}</strong>,</p>
                
                ${isApproved ? `
                  <div class="success-box">
                    <h3>🎉 Congratulations!</h3>
                    <p>Your provider application has been <strong>approved</strong>! You are now an official healthcare provider on the MON DOKTER platform.</p>
                  </div>
                  
                  <h3>🚀 What's Next?</h3>
                  <ol>
                    <li>Access your provider dashboard</li>
                    <li>Set up your services and pricing</li>
                    <li>Configure your availability</li>
                    <li>Start accepting patient bookings</li>
                  </ol>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${data.dashboardUrl}" class="button">
                      Access Your Dashboard
                    </a>
                  </div>
                  
                  <p><strong>Your Clinic:</strong> ${data.clinicName}</p>
                ` : `
                  <div class="warning-box">
                    <h3>Application Under Review</h3>
                    <p>Thank you for your interest in joining MON DOKTER. Your application is currently under review.</p>
                    <p>We may contact you for additional information or documentation.</p>
                  </div>
                `}
                
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br>
                The MON DOKTER Team</p>
              </div>
              
              <div class="footer">
                <p>Contact us: support@mondokter.sc | +248 4 123 456</p>
                <p>MON DOKTER - Healthcare Platform for Seychelles</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Provider approval email failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Provider approval email sent:', result?.id);
    return { success: true, emailId: result?.id };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'MON DOKTER <welcome@mondokter.sc>',
      to: [userEmail],
      subject: 'Welcome to MON DOKTER - Healthcare Made Easy',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to MON DOKTER</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .feature { background: #f0f9ff; border-radius: 6px; padding: 15px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏥 Welcome to MON DOKTER</h1>
                <p>Healthcare Made Easy in Seychelles</p>
              </div>
              
              <div class="content">
                <p>Dear <strong>${userName}</strong>,</p>
                
                <p>Welcome to MON DOKTER, the leading healthcare platform for Seychelles! We're excited to have you join our community.</p>
                
                <h3>🌟 What you can do:</h3>
                
                <div class="feature">
                  <h4>🔍 Find Healthcare Providers</h4>
                  <p>Search for doctors, specialists, and clinics across all Seychelles islands</p>
                </div>
                
                <div class="feature">
                  <h4>📅 Book Appointments Online</h4>
                  <p>Schedule appointments 24/7 with your preferred healthcare providers</p>
                </div>
                
                <div class="feature">
                  <h4>💊 Pharmacy Services</h4>
                  <p>Browse and order medications from local pharmacies</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">
                    Start Exploring
                  </a>
                </div>
                
                <p>If you're a healthcare provider interested in joining our platform, you can apply at any time through our provider onboarding process.</p>
                
                <p>Thank you for choosing MON DOKTER!</p>
                
                <p>Best regards,<br>
                The MON DOKTER Team</p>
              </div>
              
              <div class="footer">
                <p>Contact us: support@mondokter.sc | +248 4 123 456</p>
                <p>MON DOKTER - Connecting Seychelles with Quality Healthcare</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Welcome email failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Welcome email sent:', result?.id);
    return { success: true, emailId: result?.id };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(testEmail: string) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'MON DOKTER <test@mondokter.sc>',
      to: [testEmail],
      subject: 'MON DOKTER - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto;">
          <h2>✅ Email Configuration Test</h2>
          <p>If you received this email, your MON DOKTER email notifications are working correctly!</p>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p>You can now enable email notifications for your healthcare platform.</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, emailId: result?.id };
  } catch (error) {
    return { success: false, error: 'Email service unavailable' };
  }
}
