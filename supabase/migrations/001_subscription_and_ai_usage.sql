-- Migration 001: subscription tier + AI usage tracking
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- ─── profiles table (extends auth.users) ───────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text,
  subscription_tier   text not null default 'free'   check (subscription_tier in ('free','family','pro')),
  subscription_status text not null default 'inactive' check (subscription_status in ('active','inactive','past_due','cancelled')),
  stripe_customer_id  text,
  stripe_subscription_id text,
  updated_at          timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile row on new signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── ai_usage table ─────────────────────────────────────────────────────────
create table if not exists public.ai_usage (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  action      text not null check (action in ('story','puzzle')),
  created_at  timestamptz not null default now()
);

create index if not exists ai_usage_user_day_idx
  on public.ai_usage (user_id, action, created_at);

alter table public.ai_usage enable row level security;

create policy "Users can read own ai_usage"
  on public.ai_usage for select using (auth.uid() = user_id);

-- Service role (API routes) inserts via service key — no user RLS needed for insert
create policy "Service role can insert ai_usage"
  on public.ai_usage for insert with check (true);
