-- ============================================================================
-- A11yScope Supabase Schema
-- Run this in your Supabase SQL Editor for a new environment.
-- Existing environments should apply equivalent ALTER TABLE migrations.
-- ============================================================================

create extension if not exists pgcrypto;

-- Users table
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  stripe_customer_id text unique,
  plan text default 'free' check (plan in ('free', 'pro', 'agency')),
  auth_id uuid unique,
  brand_name text,
  onboarding_day1_sent_at timestamptz,
  onboarding_day3_sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscriptions table
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  status text not null default 'active',
  plan text not null check (plan in ('pro', 'agency')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sites registered for paid monitoring
create table sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  url text not null,
  name text,
  last_scan_score integer,
  last_scan_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, url)
);

-- Scan logs for rate limiting, history, analytics, and site monitoring
create table scan_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  ip_address text not null,
  url text not null,
  score integer,
  violations_count integer default 0,
  scan_duration_ms integer,
  violations jsonb,
  passes integer,
  incomplete integer,
  site_id uuid references sites(id) on delete set null,
  created_at timestamptz default now()
);

-- Outbound email events for abuse prevention and funnel analysis
create table email_events (
  id uuid default gen_random_uuid() primary key,
  kind text not null,
  recipient text not null,
  ip_address text,
  created_at timestamptz default now()
);

-- Crawl batches: aggregate summary of a multi-page full-site crawl. Each
-- per-page result is still in scan_logs but linked back to its batch via
-- scan_logs.crawl_batch_id below.
create table crawl_batches (
  id                 uuid default gen_random_uuid() primary key,
  user_id            uuid references users(id) on delete cascade not null,
  site_id            uuid references sites(id) on delete set null,
  root_url           text not null,
  pages_scanned      integer not null default 0,
  aggregate_score    integer,
  total_violations   integer not null default 0,
  duration_ms        integer,
  status             text not null default 'completed' check (status in ('running','completed','failed')),
  error_message      text,
  created_at         timestamptz not null default now()
);

-- Backfill scan_logs to point at its batch when produced inside a crawl
alter table scan_logs
  add column if not exists crawl_batch_id uuid references crawl_batches(id) on delete set null;

-- Funnel telemetry. One row per measurable user/system event. Anonymous
-- events have null user_id; ip is always recorded so we can stitch
-- pre-signup activity into the same session-like view later.
create table analytics_events (
  id          uuid default gen_random_uuid() primary key,
  kind        text not null,
  user_id     uuid references users(id) on delete set null,
  ip_address  text,
  url         text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

-- Indexes for performance
create index idx_scan_logs_ip_created on scan_logs(ip_address, created_at desc);
create index idx_scan_logs_user_created on scan_logs(user_id, created_at desc);
create index idx_scan_logs_site_created on scan_logs(site_id, created_at desc);
create index idx_scan_logs_url on scan_logs(url);
create index idx_subscriptions_user on subscriptions(user_id);
create index idx_subscriptions_stripe_id on subscriptions(stripe_subscription_id);
create index idx_users_stripe_customer on users(stripe_customer_id);
create index idx_users_email on users(email);
create index idx_users_auth_id on users(auth_id);
create index idx_sites_user on sites(user_id);
create index idx_email_events_ip_created on email_events(ip_address, created_at desc);
create index idx_email_events_recipient_created on email_events(recipient, created_at desc);
create index idx_crawl_batches_user_created on crawl_batches(user_id, created_at desc);
create index idx_crawl_batches_site_created on crawl_batches(site_id, created_at desc);
create index idx_scan_logs_crawl_batch on scan_logs(crawl_batch_id);
create index idx_analytics_events_kind_created on analytics_events(kind, created_at desc);
create index idx_analytics_events_user_created on analytics_events(user_id, created_at desc);
create index idx_analytics_events_ip_created   on analytics_events(ip_address, created_at desc);

-- Optional admin helper used by src/lib/admin.ts. The app falls back when this
-- RPC is absent, but creating it avoids N+1 count queries in the admin UI.
create or replace function get_scan_counts_by_users(user_ids uuid[])
returns table(user_id uuid, scan_count bigint)
language sql
stable
as $$
  select scan_logs.user_id, count(*) as scan_count
  from scan_logs
  where scan_logs.user_id = any(user_ids)
  group by scan_logs.user_id;
$$;

-- Enable RLS. The application uses the service role server-side; these tables
-- should remain inaccessible to the anon client unless explicit policies are
-- added later.
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table sites enable row level security;
alter table scan_logs enable row level security;
alter table email_events enable row level security;
alter table crawl_batches enable row level security;
alter table analytics_events enable row level security;

-- updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

create trigger sites_updated_at
  before update on sites
  for each row execute function update_updated_at();
