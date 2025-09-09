/**
 * Production Database Setup Script
 * 
 * Run this script after deployment to set up the production database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up MON DOKTER production database...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Run migrations
    console.log('📦 Running database migrations...');
    // Migrations will be run automatically by Prisma

    // Create initial admin user if specified
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',')[0];
    if (adminEmail) {
      const existingAdmin = await prisma.profile.findFirst({
        where: { 
          email: adminEmail.trim(),
          role: 'ADMIN'
        }
      });

      if (!existingAdmin) {
        console.log(`👑 Creating admin user for: ${adminEmail}`);
        await prisma.profile.create({
          data: {
            authId: `admin_setup_${Date.now()}`, // Temporary, will be updated when user signs up
            email: adminEmail.trim(),
            name: 'Platform Administrator',
            role: 'ADMIN'
          }
        });
        console.log('✅ Admin user created');
      } else {
        console.log('✅ Admin user already exists');
      }
    }

    console.log('✅ Database setup complete - ready for real data!');

    console.log('🎉 Production database setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update NEXT_PUBLIC_ADMIN_EMAILS with your email');
    console.log('2. Sign up on your deployed site with your admin email');
    console.log('3. Access /admin to manage the platform');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupProductionDatabase();
