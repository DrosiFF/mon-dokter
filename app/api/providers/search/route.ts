import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const island = searchParams.get('island')
    const businessType = searchParams.get('type') || 'clinic'

    let query = supabase
      .from('providers')
      .select('*')
      .eq('status', 'approved')
      .eq('business_type', businessType)

    // Filter by specialty if provided
    if (specialty) {
      query = query.contains('specialties', [specialty])
    }

    // Filter by island if provided
    if (island) {
      query = query.eq('island', island)
    }

    const { data: providers, error } = await query

    if (error) {
      throw new Error('Failed to fetch providers')
    }

    // Transform data for frontend compatibility
    const transformedProviders = providers.map(provider => ({
      id: provider.id,
      firstName: provider.owner_name.split(' ')[0] || 'Doctor',
      lastName: provider.owner_name.split(' ').slice(1).join(' ') || 'Provider',
      specialty: provider.specialties[0] || 'General Practice',
      services: provider.specialties,
      clinic: provider.business_name,
      city: provider.island,
      rating: 4.8, // Mock rating for now
      image: '/images/placeholders/doctor-male.svg',
      simplybookUrl: provider.simplybook_url
    }))

    return NextResponse.json({ 
      success: true, 
      providers: transformedProviders 
    })
  } catch (error) {
    console.error('Provider search error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search providers' 
    }, { status: 500 })
  }
}

// GET all providers for admin dashboard
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'approve') {
      const { providerId } = await request.json()
      
      const { error } = await supabase
        .from('providers')
        .update({ status: 'approved' })
        .eq('id', providerId)

      if (error) {
        throw new Error('Failed to approve provider')
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('Provider action error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process action' 
    }, { status: 500 })
  }
}
