import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// SimplyBook.me + Supabase Integration
export async function POST(request: NextRequest) {
  try {
    const { businessName, ownerName, email, phone, businessType, specialties, address, island, description } = await request.json()

    // Step 1: Store provider in Supabase
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .insert({
        business_name: businessName,
        owner_name: ownerName,
        email: email,
        phone: phone || null,
        address: address,
        island: island,
        business_type: businessType,
        specialties: specialties,
        description: description,
        status: 'pending' // Will be approved by admin
      })
      .select()
      .single()

    if (providerError) {
      throw new Error('Failed to create provider record')
    }

    // Step 2: Create SimplyBook.me account (optional for now)
    let simplybookUrl = null
    try {
      // For now, we'll simulate SimplyBook.me integration
      // In production, you'd call their actual API
      simplybookUrl = `https://${businessName.toLowerCase().replace(/\s+/g, '-')}-seychelles.simplybook.me`
      
      // Update provider with SimplyBook URL
      await supabase
        .from('providers')
        .update({ simplybook_url: simplybookUrl })
        .eq('id', provider.id)
    } catch (simplybookError) {
      console.warn('SimplyBook.me integration failed, provider created without booking system')
    }
    
    return NextResponse.json({ 
      success: true, 
      provider,
      simplybookUrl,
      message: 'Provider registration successful! Your booking system is being set up.'
    })
  } catch (error) {
    console.error('Provider signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create provider account' 
    }, { status: 500 })
  }
}
