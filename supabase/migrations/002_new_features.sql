-- Content Studio
create table public.content_pieces (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content_type text not null default 'ad_copy',
  content text not null,
  source_product_id uuid references public.products(id) on delete set null,
  source_campaign_id uuid references public.campaigns(id) on delete set null,
  overall_score numeric(5,2),
  scores jsonb default '{}',
  feedback jsonb default '{}',
  optimized_version text,
  status text not null default 'draft'
);

-- CRO Audits
create table public.cro_audits (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  url text,
  headline_score numeric(5,2),
  clarity_score numeric(5,2),
  urgency_score numeric(5,2),
  trust_score numeric(5,2),
  cta_score numeric(5,2),
  mobile_score numeric(5,2),
  speed_score numeric(5,2),
  design_score numeric(5,2),
  overall_score numeric(5,2),
  letter_grade text,
  recommendations text[] default '{}',
  benchmark_percentile numeric(5,2)
);

-- Experiments / A/B Tests
create table public.experiments (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  hypothesis text not null,
  variable text not null,
  metric text not null default 'ctr',
  platform text,
  campaign_id uuid references public.campaigns(id) on delete set null,
  status text not null default 'running',
  winner_id uuid,
  confidence numeric(5,2),
  lift numeric(5,2),
  started_at timestamptz,
  concluded_at timestamptz
);

create table public.experiment_variants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  name text not null,
  description text not null default '',
  impressions integer not null default 0,
  conversions integer not null default 0,
  spend numeric(10,2) not null default 0,
  is_control boolean default false,
  is_winner boolean default false
);

-- Indexes
create index idx_content_pieces_user_id on public.content_pieces(user_id);
create index idx_cro_audits_user_id on public.cro_audits(user_id);
create index idx_experiments_user_id on public.experiments(user_id);
create index idx_experiment_variants_experiment_id on public.experiment_variants(experiment_id);

-- RLS
alter table public.content_pieces enable row level security;
alter table public.cro_audits enable row level security;
alter table public.experiments enable row level security;
alter table public.experiment_variants enable row level security;

create policy "Users can manage own content" on public.content_pieces for all using (auth.uid() = user_id);
create policy "Users can manage own audits" on public.cro_audits for all using (auth.uid() = user_id);
create policy "Users can manage own experiments" on public.experiments for all using (auth.uid() = user_id);
create policy "Users can manage own variants" on public.experiment_variants for all using (
  exists (select 1 from public.experiments where experiments.id = experiment_variants.experiment_id and experiments.user_id = auth.uid())
);

-- Triggers
create trigger set_updated_at before update on public.content_pieces for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.cro_audits for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.experiments for each row execute function public.handle_updated_at();
