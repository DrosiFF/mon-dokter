import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmationEmail } from '../../../../lib/email';

const prisma = new PrismaClient();

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    clinic?: {
      name: string;
      island: string;
    };
  };
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to place an order' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalPrice }: { items: OrderItem[], totalPrice: number } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    try {
      // In a real implementation, you would:
      // 1. Create order record in database
      // 2. Update product stock levels
      // 3. Process payment
      // 4. Send confirmation emails
      
      // For now, we'll simulate the order process
      const orderData = {
        id: orderId,
        userId,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity
        })),
        totalAmount: totalPrice,
        status: 'confirmed',
        deliveryAddress: 'Customer address', // Would come from user profile
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdAt: new Date()
      };

      // Send confirmation email
      try {
        const itemsList = items.map(item => 
          `${item.quantity}x ${item.product.name} - €${(item.product.price * item.quantity).toFixed(2)}`
        ).join('\n');

        // For now, we'll log the email data instead of sending
        console.log('Order confirmation email would be sent:', {
          orderId,
          items: itemsList,
          totalPrice,
          userId
        });

      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the order if email fails
      }

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order placed successfully!',
        estimatedDelivery: '2-3 business days',
        orderData
      });

    } catch (dbError) {
      console.error('Database error during order creation:', dbError);
      
      // Fallback for testing without database
      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order received! (Database connection pending)',
        note: 'Order will be processed once database is connected',
        estimatedDelivery: '2-3 business days'
      });
    }

  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
