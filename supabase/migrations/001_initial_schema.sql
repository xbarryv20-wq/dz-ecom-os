-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  store_name text,
  phone text,
  preferred_currency text not null default 'DZD',
  preferred_niche text,
  unique(user_id)
);

-- signals
create table public.signals (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  raw_text text not null,
  source_link text,
  signal_type text not null,
  niche text not null,
  engagement_estimate integer,
  tags text[] default '{}',
  is_analyzed boolean default false
);

-- signal_ai_analysis
create table public.signal_ai_analysis (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  signal_id uuid not null references public.signals(id) on delete cascade,
  pain_point text not null,
  buying_motive text not null,
  target_persona text not null,
  suggested_products text[] default '{}',
  opportunity_score integer not null check (opportunity_score between 1 and 10),
  explanation text not null,
  model_used text not null
);

-- products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  niche text not null,
  description text not null default '',
  source_link text,
  cost_price numeric(10,2) not null default 0,
  sell_price numeric(10,2) not null default 0,
  delivery_cost numeric(10,2) not null default 0,
  confirmation_cost numeric(10,2) not null default 0,
  ad_spend_estimate numeric(10,2) not null default 0,
  notes text not null default '',
  status text not null default 'draft',
  image_url text
);

-- product_variants
create table public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  model text not null default '',
  color text not null default '',
  storage text not null default '',
  quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  notes text not null default ''
);

-- inventory_movements
create table public.inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_variant_id uuid not null references public.product_variants(id) on delete cascade,
  movement_type text not null,
  quantity integer not null,
  unit_cost numeric(10,2),
  reference_id text,
  notes text not null default ''
);

-- product_ai_reviews
create table public.product_ai_reviews (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 10),
  strengths text[] default '{}',
  weaknesses text[] default '{}',
  recommendations text[] default '{}',
  market_fit_score integer not null check (market_fit_score between 1 and 10),
  explanation text not null,
  model_used text not null
);

-- marketing_angles
create table public.marketing_angles (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  signal_id uuid references public.signals(id) on delete set null,
  hooks text[] default '{}',
  angles text[] default '{}',
  tiktok_scripts text[] default '{}',
  facebook_posts text[] default '{}',
  upsell_ideas text[] default '{}',
  bundle_ideas text[] default '{}',
  is_favorite boolean default false
);

-- scripts
create table public.scripts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  angle_id uuid not null references public.marketing_angles(id) on delete cascade,
  platform text not null,
  content text not null,
  duration_seconds integer,
  is_active boolean default true
);

-- campaigns
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  platform text not null,
  product_id uuid references public.products(id) on delete set null,
  angle_used text not null default '',
  hook_used text not null default '',
  launch_date date,
  spend numeric(10,2) not null default 0,
  messages integer not null default 0,
  confirmed_orders integer not null default 0,
  delivered_orders integer not null default 0,
  cancellations integer not null default 0,
  notes text not null default '',
  status text not null default 'draft'
);

-- campaign_metrics (daily tracking)
create table public.campaign_metrics (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  date date not null default current_date,
  impressions integer not null default 0,
  clicks integer not null default 0,
  spend numeric(10,2) not null default 0,
  messages integer not null default 0,
  confirmed_orders integer not null default 0,
  delivered_orders integer not null default 0,
  cancellations integer not null default 0
);

-- prompts
create table public.prompts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'other',
  is_favorite boolean default false,
  usage_count integer not null default 0
);

-- knowledge_entries
create table public.knowledge_entries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  niche text not null default '',
  tags text[] default '{}',
  category text not null default 'other',
  is_pinned boolean default false
);

-- tags
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  unique(user_id, name)
);

-- Indexes
create index idx_signals_user_id on public.signals(user_id);
create index idx_products_user_id on public.products(user_id);
create index idx_product_variants_product_id on public.product_variants(product_id);
create index idx_inventory_movements_variant_id on public.inventory_movements(product_variant_id);
create index idx_marketing_angles_product_id on public.marketing_angles(product_id);
create index idx_campaigns_user_id on public.campaigns(user_id);
create index idx_prompts_user_id on public.prompts(user_id);
create index idx_knowledge_entries_user_id on public.knowledge_entries(user_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.signals enable row level security;
alter table public.signal_ai_analysis enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.product_ai_reviews enable row level security;
alter table public.marketing_angles enable row level security;
alter table public.scripts enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.prompts enable row level security;
alter table public.knowledge_entries enable row level security;
alter table public.tags enable row level security;

-- Owner-based policies for all tables
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);

create policy "Users can view own signals" on public.signals for select using (auth.uid() = user_id);
create policy "Users can insert own signals" on public.signals for insert with check (auth.uid() = user_id);
create policy "Users can update own signals" on public.signals for update using (auth.uid() = user_id);
create policy "Users can delete own signals" on public.signals for delete using (auth.uid() = user_id);

create policy "Users can view own analysis" on public.signal_ai_analysis for select using (
  exists (select 1 from public.signals where signals.id = signal_ai_analysis.signal_id and signals.user_id = auth.uid())
);
create policy "Users can insert analysis" on public.signal_ai_analysis for insert with check (
  exists (select 1 from public.signals where signals.id = signal_ai_analysis.signal_id and signals.user_id = auth.uid())
);

create policy "Users can view own products" on public.products for select using (auth.uid() = user_id);
create policy "Users can insert own products" on public.products for insert with check (auth.uid() = user_id);
create policy "Users can update own products" on public.products for update using (auth.uid() = user_id);
create policy "Users can delete own products" on public.products for delete using (auth.uid() = user_id);

create policy "Users can view own variants" on public.product_variants for select using (
  exists (select 1 from public.products where products.id = product_variants.product_id and products.user_id = auth.uid())
);
create policy "Users can manage own variants" on public.product_variants for all using (
  exists (select 1 from public.products where products.id = product_variants.product_id and products.user_id = auth.uid())
);

create policy "Users can view own movements" on public.inventory_movements for select using (auth.uid() = user_id);
create policy "Users can insert own movements" on public.inventory_movements for insert with check (auth.uid() = user_id);

create policy "Users can view own reviews" on public.product_ai_reviews for select using (
  exists (select 1 from public.products where products.id = product_ai_reviews.product_id and products.user_id = auth.uid())
);
create policy "Users can insert reviews" on public.product_ai_reviews for insert with check (
  exists (select 1 from public.products where products.id = product_ai_reviews.product_id and products.user_id = auth.uid())
);

create policy "Users can view own angles" on public.marketing_angles for select using (auth.uid() = user_id);
create policy "Users can manage own angles" on public.marketing_angles for all using (auth.uid() = user_id);

create policy "Users can view own scripts" on public.scripts for select using (
  exists (select 1 from public.marketing_angles where marketing_angles.id = scripts.angle_id and marketing_angles.user_id = auth.uid())
);
create policy "Users can manage own scripts" on public.scripts for all using (
  exists (select 1 from public.marketing_angles where marketing_angles.id = scripts.angle_id and marketing_angles.user_id = auth.uid())
);

create policy "Users can view own campaigns" on public.campaigns for select using (auth.uid() = user_id);
create policy "Users can manage own campaigns" on public.campaigns for all using (auth.uid() = user_id);

create policy "Users can view own metrics" on public.campaign_metrics for select using (
  exists (select 1 from public.campaigns where campaigns.id = campaign_metrics.campaign_id and campaigns.user_id = auth.uid())
);
create policy "Users can manage own metrics" on public.campaign_metrics for all using (
  exists (select 1 from public.campaigns where campaigns.id = campaign_metrics.campaign_id and campaigns.user_id = auth.uid())
);

create policy "Users can view own prompts" on public.prompts for select using (auth.uid() = user_id);
create policy "Users can manage own prompts" on public.prompts for all using (auth.uid() = user_id);

create policy "Users can view own knowledge" on public.knowledge_entries for select using (auth.uid() = user_id);
create policy "Users can manage own knowledge" on public.knowledge_entries for all using (auth.uid() = user_id);

create policy "Users can view own tags" on public.tags for select using (auth.uid() = user_id);
create policy "Users can manage own tags" on public.tags for all using (auth.uid() = user_id);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.signals for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.signal_ai_analysis for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.products for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.product_variants for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.product_ai_reviews for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.marketing_angles for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.scripts for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.campaigns for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.prompts for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.knowledge_entries for each row execute function public.handle_updated_at();
