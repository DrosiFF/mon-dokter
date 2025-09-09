# 🚀 MON DOKTER - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Required Services Setup**
- [ ] **Supabase Project** (Database)
- [ ] **Clerk Application** (Authentication) 
- [ ] **Resend Account** (Email notifications)
- [ ] **SimplyBook.me Account** (Booking system - optional)
- [ ] **Domain Name** (mondokter.sc recommended)

---

## 🔧 **Step 1: Environment Variables**

Copy `env.production.example` and set these variables in your deployment platform:

### **Database (Supabase)**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]
```

### **Authentication (Clerk)**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[PUBLISHABLE-KEY]
CLERK_SECRET_KEY=[SECRET-KEY]
```

### **Admin Access**
```env
NEXT_PUBLIC_ADMIN_EMAILS=your-email@gmail.com,admin@mondokter.sc
```

### **Email Service (Resend)**
```env
RESEND_API_KEY=[RESEND-API-KEY]
```

### **App URLs**
```env
NEXT_PUBLIC_APP_URL=https://mondokter.sc
NEXTAUTH_URL=https://mondokter.sc
```

---

## 🌐 **Step 2: Deploy to Vercel (Recommended)**

### **Option A: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

### **Option B: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

---

## 🗄️ **Step 3: Database Setup**

### **Run Migrations**
```bash
npx prisma migrate deploy
```

### **Setup Initial Data**
```bash
npx tsx scripts/setup-production-db.ts
```

---

## 🔐 **Step 4: Admin Access Setup**

### **Method 1: Email-Based (Immediate)**
1. Update `NEXT_PUBLIC_ADMIN_EMAILS` with your email
2. Sign up on your deployed site
3. Access `/admin` immediately

### **Method 2: Database Role (Secure)**
1. Complete database setup
2. Update your profile role to 'ADMIN':
```sql
UPDATE profiles SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

---

## 🛡️ **Step 5: Security Configuration**

### **Clerk Dashboard Settings**
- Set production domain
- Configure redirect URLs
- Disable phone verification for Seychelles
- Set up social login (optional)

### **Supabase Security**
- Enable RLS (Row Level Security)
- Configure authentication policies
- Set up API rate limiting

---

## 📧 **Step 6: Email Configuration**

### **Resend Setup**
1. Verify your domain in Resend
2. Set up SPF/DKIM records
3. Test email delivery

### **Email Templates**
All email templates are pre-configured for:
- Booking confirmations
- Provider notifications
- Welcome emails
- Admin notifications

---

## 🔍 **Step 7: Testing Checklist**

### **Patient Flow**
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Provider profiles accessible
- [ ] Booking system functional
- [ ] Pharmacy ordering works
- [ ] Email confirmations sent

### **Provider Flow**
- [ ] Provider signup works
- [ ] Application approval process
- [ ] Provider dashboard accessible
- [ ] Booking management functional

### **Admin Flow**
- [ ] Admin login with your email
- [ ] Provider approval system
- [ ] Clinic management
- [ ] Service management
- [ ] Pharmacy inventory

---

## 🌟 **Step 8: Go Live**

### **DNS Configuration**
Point your domain to Vercel:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### **SSL Certificate**
- Automatic with Vercel
- HTTPS enforced by default

### **Performance Optimization**
- CDN enabled automatically
- Image optimization included
- Automatic compression

---

## 📱 **PWA Installation**

Users can install MON DOKTER as a mobile app:
1. Visit site on mobile browser
2. Tap "Add to Home Screen"
3. App-like experience with offline capabilities

---

## 🎯 **Post-Deployment**

### **First Admin Login**
1. Go to `https://mondokter.sc`
2. Sign up with your admin email
3. Access `https://mondokter.sc/admin`
4. Start approving provider applications!

### **Provider Onboarding**
1. Providers apply at `/onboarding/provider`
2. You approve them in `/admin/providers`
3. They access `/provider-dashboard`
4. Start accepting bookings!

### **Patient Experience**
1. Patients find providers at `/search`
2. Book appointments with SimplyBook.me widgets
3. Order pharmacy products at `/pharmacy`
4. Receive email confirmations

---

## 🏆 **Success Metrics**

Your MON DOKTER platform is ready when:
- ✅ Providers can register and get approved
- ✅ Patients can find and book healthcare providers
- ✅ Admin can manage the entire platform
- ✅ Email notifications are working
- ✅ Pharmacy ordering is functional
- ✅ Mobile experience is optimized

**Congratulations! MON DOKTER is ready to serve the healthcare needs of Seychelles!** 🏥🇸🇨
