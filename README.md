# Husbandry Tool

Animal care and facility management platform with internal team chat. Built with Next.js 14 (App Router), TypeScript, Supabase (Auth, Postgres, Storage, Realtime), and Prisma.

## Features

- **Marketing site**: Home, Features, Pricing, FAQ, About
- **Auth**: Email/password sign up and login (Supabase Auth), facility created on first sign-up
- **App**: Dashboard, Sections (tree), Animals, Medical records, Daily reports (calendar), Team chat, Reports, Admin
- **Admin**: App settings, Facility setup, Labels, Custom lists, User management (roles), Business directory

## Setup

1. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In Project Settings → Database, copy the connection string (use the pooler URL for serverless, port 6543).
   - In Project Settings → API, copy `Project URL` and `anon` key; create a `service_role` key for server-side.

2. **Environment**
   - Copy `.env.example` to `.env.local`.
   - Set:
     - `DATABASE_URL` – Supabase Postgres connection string (pooler recommended for Vercel).
     - `NEXT_PUBLIC_SUPABASE_URL` – Project URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon key.
     - `SUPABASE_SERVICE_ROLE_KEY` – service role key.

3. **Database**
   - Run migrations (or push schema):
     - `npx prisma db push` (development), or
     - `npx prisma migrate dev` (with migration history).

4. **Run**
   - `npm install`
   - `npm run dev` – app at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint
- `npm run db:generate` – generate Prisma client
- `npm run db:push` – push schema to DB (no migrations)
- `npm run db:migrate` – run migrations
- `npm run db:studio` – open Prisma Studio

## Routes

- `/` – marketing home
- `/features`, `/pricing`, `/faq`, `/about` – marketing
- `/login`, `/register` – auth
- `/app` – app home (requires auth)
- `/app/sections`, `/app/animals`, `/app/medical`, `/app/daily-reports`, `/app/chat`, `/app/reports`, `/app/admin` – app areas
