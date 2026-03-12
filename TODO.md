# Husbandry Tool – Phase To-Do Lists

Use this file to track progress through each phase. Check off items as you complete them.

---

## Phase 1: Foundation

- [ ] **1.1 Project bootstrap**
  - [ ] Next.js app with TypeScript, App Router, Tailwind, `src/` directory
  - [ ] Prisma initialized; `DATABASE_URL` set (Supabase Postgres, pooler for serverless)
  - [ ] Supabase JS client and `@supabase/ssr` installed
  - [ ] Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **1.2 Auth and tenant model**
  - [ ] Supabase Auth enabled (email/password)
  - [ ] Session + cookies for “remember me” and protected routes
  - [ ] `facilities` and `facility_members` tables; all app data scoped by `facility_id`
  - [ ] Middleware: protect `/app/**` and `/dashboard/**`; redirect unauthenticated to login
  - [ ] Optional: redirect to facility selector when user has multiple facilities

- [ ] **1.3 Core schema (first slice)**
  - [ ] `User` (linked to Supabase auth via `auth_id`)
  - [ ] `Facility`, `FacilityMember` (role: Admin, Staff, Viewer)
  - [ ] `Team` (for chat)
  - [ ] `Section` (tree: `parent_id`, `sort_order`, `daily_reports_enabled`, status)
  - [ ] `SectionMember` (section, user, designation)
  - [ ] Migrations applied; RLS or API enforcement by `facility_id` and membership

- [ ] **1.4 Section management (basic)**
  - [ ] GET/POST/PATCH/DELETE `/api/sections`
  - [ ] POST/DELETE `/api/sections/:id/members`
  - [ ] Sections UI: tree list, expand/collapse, add section, add subsection

---

## Phase 2: Core app – Animals, sections, medical, daily reports

- [ ] **2.1 Section management (full)**
  - [ ] Reorder sections (update `sort_order`)
  - [ ] Assign staff to sections (SectionMember)
  - [ ] Optional: drag-and-drop reorder

- [ ] **2.2 Animal inventory**
  - [ ] Prisma: `Animal`, `Species`, identifiers/labels; custom list references
  - [ ] `CustomListType` and `CustomListItem` (disposition, gender, breeding status, etc.)
  - [ ] GET/POST `/api/animals`; GET/PATCH/DELETE `/api/animals/:id`
  - [ ] Species typeahead: GET/POST `/api/species`
  - [ ] UI: list with filters (disposition, section), search; summary cards
  - [ ] Add/edit animal form (all key fields)
  - [ ] Attachments → Supabase Storage; store keys in DB

- [ ] **2.3 Medical records**
  - [ ] Prisma: `MedicalRecord`, drugs/vaccines sub-tables; link to `Business` (vets)
  - [ ] GET/POST `/api/medical`; GET/PATCH/DELETE `/api/medical/:id`
  - [ ] UI: list with filters (section); add/edit form; link to animal and vet (business)

- [ ] **2.4 Daily reports**
  - [ ] Prisma: `DailyReport` (one per section per date); staff entries, weather, notes
  - [ ] GET/POST `/api/daily-reports`; GET/PATCH/DELETE `/api/daily-reports/:id`
  - [ ] UI: calendar by section (bold/orange/red by importance); click day → view or create
  - [ ] Optional: World Weather Online API for default weather

- [ ] **2.5 App shell**
  - [ ] Layout: sidebar/top nav (Animals, Medical, Daily reports, Sections, Chat, Admin)
  - [ ] Breadcrumbs and facility context where relevant

---

## Phase 3: Internal team chat

- [ ] **3.1 Data model**
  - [ ] `Team` (facility_id, name, slug)
  - [ ] `TeamMember` (team_id, user_id)
  - [ ] `ChatMessage` (team_id, sender_id, body, created_at)

- [ ] **3.2 Real-time and API**
  - [ ] GET/POST `/api/teams`
  - [ ] GET/POST `/api/teams/:id/messages` (paginated)
  - [ ] Supabase Realtime: subscribe to new messages for current team (broadcast or Postgres changes)
  - [ ] Enforce: only TeamMembers can read/write messages for that team

- [ ] **3.3 UI**
  - [ ] Team selector (dropdown or sidebar) when user has multiple teams
  - [ ] Message list (scroll to bottom, load older); input and send
  - [ ] Show sender name and timestamp
  - [ ] Optional: typing indicator, read receipts
  - [ ] Mobile-friendly layout

---

## Phase 4: Administration

- [ ] **4.1 App settings**
  - [ ] Facility settings: start_of_week, system_of_measurement, date_format, time_format, primary_animal_identifier_type
  - [ ] UI: `/app/admin/settings`

- [ ] **4.2 Labels**
  - [ ] `Label` (facility_id, type, text, color); types: general, section, medical, business, animal, daily_report
  - [ ] Admin CRUD for labels; use on animals, sections, medical, daily reports, businesses

- [ ] **4.3 Custom lists**
  - [ ] Admin UI: list types (disposition, gender, drugs, vaccines, note types, etc.)
  - [ ] Per-type editor: add/remove/reorder (drag) values

- [ ] **4.4 User and role management**
  - [ ] List facility members; invite by email (Supabase invite or magic link)
  - [ ] Assign role (Admin, Staff, Viewer)
  - [ ] Optional: Roles & Permissions matrix; section-scoped permissions (e.g. Edit Animals within assigned sections)

- [ ] **4.5 Facility setup**
  - [ ] Edit facility: name, DBA, contact, addresses
  - [ ] Optional: Google Places typeahead for addresses
  - [ ] Professional organizations, permits (multi-entry)

- [ ] **4.6 Business directory**
  - [ ] `Business` (facility_id, type, name, contact, address, labels, etc.)
  - [ ] Admin list + CRUD
  - [ ] Use as veterinarian, acquisition source, transfer destination in animals/medical

---

## Phase 5: Marketing website and polish

- [ ] **5.1 Public site**
  - [ ] Routes: `/`, `/features`, `/pricing`, `/faq`, `/about`
  - [ ] Content and layout (hero, feature blocks, pricing table, CTA)
  - [ ] Links to `/login`, `/register`

- [ ] **5.2 Register / onboarding**
  - [ ] Sign up flow; after first login, create or join facility
  - [ ] Redirect to app or facility selector

- [ ] **5.3 Security and hardening**
  - [ ] RLS or strict API checks on all tables; service role only on server
  - [ ] Validate file types and size for Storage
  - [ ] Rate limit auth and chat endpoints
  - [ ] Password policy and “change password” flow (Supabase Auth)

- [ ] **5.4 Reporting (minimal v1)**
  - [ ] At least one report (e.g. animal count by section, medical records in date range)
  - [ ] “View Reports” entry in app nav

---

## Optional / later

- [ ] Native mobile app (PWA is in scope; React Native/Expo later)
- [ ] Full reporting suite beyond minimal v1
- [ ] Multi-language (i18n)
- [ ] Integrations (e.g. external zoo registries)
- [ ] Section-scoped permissions (Edit Animals only within assigned sections)
- [ ] Drag-and-drop section reorder in Section management
