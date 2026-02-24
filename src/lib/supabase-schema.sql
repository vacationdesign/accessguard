-- ============================================================================
-- AccessGuard Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- Users table
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  stripe_customer_id text unique,
  plan text default 'free' check (plan in ('free', 'pro', 'agency')),
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

-- Scan logs table (for rate limiting and analytics)
create table scan_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  ip_address text not null,
  url text not null,
  score integer,
  violations_count integer default 0,
  scan_duration_ms integer,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_scan_logs_ip_created on scan_logs(ip_address, created_at desc);
create index idx_scan_logs_user_created on scan_logs(user_id, created_at desc);
create index idx_subscriptions_user on subscriptions(user_id);
create index idx_subscriptions_stripe_id on subscriptions(stripe_subscription_id);
create index idx_users_stripe_customer on users(stripe_customer_id);
create index idx_users_email on users(email);

-- Enable RLS (policies are not added because we use the service role key
-- server-side, which bypasses RLS. This keeps the tables locked down if
-- anyone tries to access them with the anon key.)
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table scan_logs enable row level security;

-- updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Auto-update updated_at on users
create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

-- Auto-update updated_at on subscriptions
create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();
