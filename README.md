# DZ Ecom OS

A production-ready internal dashboard for solo/small Algerian e-commerce operators. Built with Next.js 16, TypeScript, Tailwind CSS v4, Supabase, and AI-powered analysis.

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** (`/dashboard`) | Summary metrics, recent activity, quick actions |
| **Market Signals** (`/signals`) | Capture & analyze complaints, desires, competitor observations |
| **Product Lab** (`/products`) | Product database with AI evaluation for Algeria market fit |
| **Angle Generator** (`/angles`) | AI-powered hooks, TikTok scripts, Facebook posts, bundles |
| **Inventory** (`/inventory`) | SKU management, variants, stock tracking, movement logging |
| **Campaigns** (`/campaigns`) | Track ad campaigns with derived metrics (CPL, cancellation rate) |
| **Prompt Vault** (`/prompts`) | Save, organize, and reuse AI prompts |
| **Knowledge Base** (`/knowledge`) | Store lessons learned, niche insights, what works in Algeria |
| **Settings** (`/settings`) | Profile, API status, preferences |

### AI Features

- **Signal Analysis** — DeepSeek API: extract pain points, personas, opportunity scores
- **Product Evaluation** — DeepSeek API: market fit, strengths, weaknesses for Algeria
- **Angle Generation** — OpenRouter (MiniMax M2.5): hooks, scripts, posts in Darija

### Technical Features

- English/Arabic language toggle with full RTL/LTR support
- Supabase Auth with session management
- Row Level Security (RLS) on all tables
- Zod validation on all forms
- Loading skeletons, empty states, error handling
- Responsive (mobile + desktop)
- Real Supabase CRUD on all modules

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **AI:** DeepSeek API + OpenRouter (MiniMax)
- **Validation:** Zod
- **Icons:** Lucide React

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/dz-ecom-os.git
cd dz-ecom-os
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values. The app works in demo mode without Supabase credentials — all pages show mock data.

### 3. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Paste contents of `supabase/migrations/001_initial_schema.sql`
3. Execute
4. (Optional) Run `supabase/seed-fixed.sql` for demo data with your auth user

### 4. Run

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/              # Login page
│   ├── (dashboard)/               # All dashboard pages
│   │   ├── dashboard/             # Main dashboard
│   │   ├── signals/               # Market signals
│   │   ├── products/              # Product lab
│   │   ├── angles/                # Angle generator
│   │   ├── inventory/             # Inventory management
│   │   ├── campaigns/             # Campaign tracker
│   │   ├── prompts/               # Prompt vault
│   │   ├── knowledge/             # Knowledge base
│   │   └── settings/              # Settings
│   └── api/ai/                    # AI API routes
├── components/                    # UI components (20+ shadcn/ui)
├── hooks/                         # Supabase CRUD hooks
├── lib/
│   ├── supabase/                  # Client, server, middleware, mappers
│   ├── ai/                        # DeepSeek, OpenRouter, prompts
│   ├── i18n/                      # Translation system (en/ar)
│   ├── constants.ts
│   ├── validators.ts
│   └── utils.ts
├── types/
│   └── database.ts
└── middleware.ts
```

## Database Schema

14 tables with RLS: `profiles`, `signals`, `signal_ai_analyses`, `products`, `product_variants`, `inventory_movements`, `product_ai_reviews`, `marketing_angles`, `scripts`, `campaigns`, `campaign_metrics`, `prompts`, `knowledge_entries`, `tags`

## License

Private — Internal use only
