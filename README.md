This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
# Mon Dokter (Seychelles)

MVP: Local clinic & specialist booking (MioDottore style).

## Stack
- Next.js (App Router), TypeScript, Tailwind
- Booking engine: SimplyBook.me (MVP) or Cal.com (Phase 2)
- n8n for WhatsApp reminders (webhook driven)
- Prisma + Postgres (Supabase ok), no PHI at booking

## Setup
1. `cp .env.example .env.local` and fill values.
2. `npm i`
3. `npx prisma migrate dev`
4. `npm run dev`

## Environment

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
What you have (quick audit)
It’s a Next.js (App Router) + TS + Tailwind 
Your goal requires two control planes:


Admin CMS (you): create clinics, doctors, services, prices, pharmacy products.


Provider dashboard (each clinic/doctor): manage services, prices, booking decisions.
 The public site should show /clinics/[slug], /doctors/[slug], /pharmacies, each with a profile page.


You’ve embedded or started wiring SimplyBook. Note: SimplyBook provides embeddable widgets and a JSON-RPC user API for bookings/services/providers. You can either (a) fully lean on SimplyBook for booking + availability and mirror data into your DB, or (b) switch to a self-hosted booking core (e.g., Cal.com) later. SimplyBook.me Help CenterSimplyBook.me



Best-practice architecture (fits your MVP + future growth)
Auth & Roles (Supabase Auth)
Roles: ADMIN, PROVIDER, STAFF, USER.


Keep RLS on all content tables; expose only what each role needs.


“Provider onboarding” = a form that collects legal name, clinic, phone, etc., then flags their profile as PROVIDER.


Data model (Prisma)
 Keep bookings in SimplyBook for MVP, but mirror them locally for dashboards & analytics.
profiles (id ↔ auth.uid, role, phone, display_name)


clinics (name, slug, address, contact, logo_url)


providers (person linked to profiles, linked to clinic_id, bio, specialties)


services (belongs to clinic or provider, name, description, duration_min, price)


pharmacy_products (clinic_id optional, name, sku, price, stock, category)


bookings (local mirror: simplybook_id, service_id, provider_id, client_name/email/phone, start/end, status)


integrations (provider_id/clinic_id, type: 'simplybook', credentials: company_key, api_key, etc.)


Booking flow
Public pages embed SimplyBook widget for selecting service/provider and time.


Webhook endpoint receives booking events from SimplyBook and writes them into bookings so your dashboards always show the truth.


Admin/Providers never change the booking in your DB directly; they take actions that call SimplyBook API, then you update local mirror.


Why this split?
 You get reliable availability + reminders from SimplyBook now, but keep data ownership + dashboards. If later you move to Cal.com (open-source), you only swap the booking adapter, not your entire app. (Reviews show SimplyBook strong on “follow-ups”; Cal.com stronger on control/integrations — so your hybrid is sensible.) G2

Fix the current confusion: make the app actually work end-to-end
1) Finish environment + DB
Create .env.local and fill:

 NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only usage
SIMPLYBOOK_COMPANY=your-company-alias
SIMPLYBOOK_API_USER=...
SIMPLYBOOK_API_KEY=...
NEXTAUTH_URL=http://localhost:3000
 (Use your real SimplyBook company alias & API credentials from their panel.)


Apply your schema:


If you prefer Prisma: ensure schema.prisma matches the models below (or add them); then:

 npx prisma migrate dev


If you want to start from your supabase-schema.sql, run it in Supabase SQL editor, then generate Prisma from DB later.


Minimal Prisma models (drop these into prisma/schema.prisma and adjust names to your taste)
model Profile {
  id        String  @id @default(uuid())
  authId    String  @unique            // supabase auth user id
  role      Role    @default(USER)
  phone     String?
  name      String?
  provider  Provider?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  PROVIDER
  STAFF
  USER
}

model Clinic {
  id        String  @id @default(uuid())
  name      String
  slug      String  @unique
  address   String?
  phone     String?
  logoUrl   String?
  providers Provider[]
  services  Service[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Provider {
  id         String  @id @default(uuid())
  profileId  String  @unique
  clinicId   String?
  bio        String?
  specialties String?
  profile    Profile @relation(fields: [profileId], references: [id])
  clinic     Clinic? @relation(fields: [clinicId], references: [id])
  services   Service[]
  bookings   Booking[]
  integrations Integration[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Service {
  id          String  @id @default(uuid())
  clinicId    String?
  providerId  String?
  name        String
  description String?
  durationMin Int      @default(30)
  price       Decimal  @db.Numeric(10,2)
  clinic      Clinic?  @relation(fields: [clinicId], references: [id])
  provider    Provider? @relation(fields: [providerId], references: [id])
  bookings    Booking[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PharmacyProduct {
  id        String  @id @default(uuid())
  clinicId  String?
  name      String
  sku       String?  @unique
  price     Decimal  @db.Numeric(10,2)
  stock     Int      @default(0)
  category  String?
  clinic    Clinic?  @relation(fields: [clinicId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Booking {
  id            String  @id @default(uuid())
  simplybookId  String? @unique
  serviceId     String
  providerId    String
  clientName    String
  clientEmail   String?
  clientPhone   String?
  start         DateTime
  end           DateTime
  status        BookingStatus @default(PENDING)
  service       Service  @relation(fields: [serviceId], references: [id])
  provider      Provider @relation(fields: [providerId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum BookingStatus {
  PENDING
  ACCEPTED
  DECLINED
  CANCELLED
  COMPLETED
}

model Integration {
  id          String  @id @default(uuid())
  providerId  String?
  clinicId    String?
  type        String   // 'simplybook'
  company     String?  // simplybook company alias
  apiUser     String?
  apiKey      String?
  provider    Provider? @relation(fields: [providerId], references: [id])
  clinic      Clinic?   @relation(fields: [clinicId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

2) Clear roles + routing
Middleware (middleware.ts): protect /admin/** for ADMIN, /provider/** for PROVIDER|STAFF.


On signup: ordinary users get USER. A provider onboarding page (/onboarding/provider) lets you request upgrade; you flip their Profile.role to PROVIDER in Admin.


3) Public pages
/clinics/[slug]: list staff & services (read from DB).


/doctors/[slug]: show provider profile + services.


Embed SimplyBook booking widget for each clinic/provider section (copy widget code from SimplyBook panel). SimplyBook.me Help Center


Example: a small component like components/BookingEmbed.tsx that accepts company and serviceId and renders the script snippet they give you.
4) Provider dashboard (the piece you’re missing)
Create a simple, working GUI now; refine later:
Route: /provider with tabs: Bookings, Services, Prices.


Bookings: read from your bookings mirror table (so providers always see everything).


Services/Prices: CRUD against your services table. When a change is made, also call SimplyBook API to update the canonical service, then update your DB.


SimplyBook’s User API is JSON-RPC 2.0; you can manage services, performers (providers), and bookings programmatically. Build a thin server-side helper (e.g., lib/simplybook.ts) to authenticate and call methods. SimplyBook.me Help CenterSimplyBook.me
5) Webhooks: keep your DB in sync
In SimplyBook admin, set webhook to POST /api/simplybook/webhook. Handle booking.create, booking.change_status, booking.cancel, etc., and upsert into bookings. (You can also poll if your plan doesn’t include webhooks.)


This makes the dashboards reflect reality even if someone books via the embedded widget.


6) Admin CMS
Route: /admin with sections Clinics, Providers, Services, Pharmacy.


Use simple CRUD tables (TanStack Table or straightforward forms). Only ADMIN can:


Create a clinic, add logo/contact, generate slug.


Approve a provider (flip profile role + link to clinic).


Bulk import pharmacy products (CSV → pharmacy_products).



Why your current “provider login → nothing” happens
Simply logging in to your site does not automatically grant a provider GUI. You need:


A role (PROVIDER) attached to that auth user.


A dashboard route that uses that role and shows the UI.


A linked integration (SimplyBook credentials for that provider/clinic) so actions can hit the SimplyBook API.


Embedding a widget alone won’t create a provider control panel — that’s why you’re not seeing controls. The widget is only for clients to book. The user API is what gives you provider/admin control. SimplyBook.me Help Center+1



Concrete to-dos (Cursor-friendly)
Create roles + onboarding


Add the Prisma models (or extend yours) and npx prisma migrate dev.


Pages:


app/onboarding/provider/page.tsx — simple form; on submit sets profiles.role = 'PROVIDER' (admin approves).


app/provider/page.tsx — gate with role; show tabs.


Add SimplyBook helper


lib/simplybook.ts — functions: login(), listServices(), updateService(), listBookings(), changeBookingStatus(). Use the JSON-RPC endpoints from docs. SimplyBook.me Help Center


Embed widget on public pages


components/BookingEmbed.tsx — paste the exact widget snippet generated in your SimplyBook panel (per clinic/provider). SimplyBook.me Help Center


Webhook endpoint


app/api/simplybook/webhook/route.ts — verify signature (if provided), parse event, upsert into bookings.


Admin pages


app/admin/clinics, app/admin/providers, app/admin/services, app/admin/pharmacy — scaffold CRUD with server actions.


Provider actions


In /provider/services: update service fields → call simplybook.updateService → update your DB.


In /provider/bookings: action buttons to accept/decline → call simplybook.changeBookingStatus → update mirror.



Optional: when to consider Cal.com instead
If you need full control, multi-org dashboards, custom rules, and want to avoid a third-party SaaS for core booking, Cal.com is a strong alternative (self-hostable, rich webhooks). For now, your hybrid (SimplyBook + local DB + dashboards) gets you live fastest in Seychelles, and you can swap later. (Comparisons back this split.) SlashdotG2

Docs you’ll use
SimplyBook widgets (how to embed). SimplyBook.me Help Center


SimplyBook User API (JSON-RPC) for services/providers/bookings. SimplyBook.me Help CenterSimplyBook.me



If you’d like, I can draft the exact files (routes + helper + minimal UI) against your repo structure so you can paste into Cursor and run right away.
ChatGPT can make mistakes. Check important info.
