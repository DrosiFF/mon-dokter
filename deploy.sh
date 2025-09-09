#!/bin/bash

# MON DOKTER Deployment Script
echo "🚀 Deploying MON DOKTER Healthcare Platform..."

# Check if required tools are installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Setup initial data: npm run db:setup"
echo "4. Access your admin panel at: https://your-domain.com/admin"
echo ""
echo "🎉 MON DOKTER is now live!"
