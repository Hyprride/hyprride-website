-- ============================================================================
-- HYPRRIDE — Lead Management System
-- Migration 0001: initial schema
--
-- Tables:  customers · emergency_contacts · bookings · activity_logs
-- Features: UUID PKs, booking_status enum, human-friendly booking references,
--           updated_at triggers, automatic activity logging, RLS, indexes.
--
-- Apply with the Supabase CLI:
--   supabase db push
-- or paste into the Supabase SQL editor.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "citext";      -- case-insensitive email

-- Enums ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum (
      'New', 'Pending', 'Confirmed', 'Completed', 'Cancelled'
    );
  end if;
end$$;

-- Shared helper: keep updated_at fresh -------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Human-friendly booking references: HR-000001, HR-000002, … ---------------
create sequence if not exists public.booking_reference_seq start 1001;

-- ============================================================================
-- customers
-- ============================================================================
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text   not null check (char_length(name) between 2 and 120),
  phone       text   not null check (char_length(phone) between 8 and 20),
  email       citext not null unique check (position('@' in email) > 1),
  address     text   not null check (char_length(address) between 4 and 400),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists customers_phone_idx      on public.customers (phone);
create index if not exists customers_created_at_idx  on public.customers (created_at desc);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ============================================================================
-- emergency_contacts  (1 customer → N contacts)
-- ============================================================================
create table if not exists public.emergency_contacts (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references public.customers (id) on delete cascade,
  contact_name  text not null check (char_length(contact_name) between 2 and 120),
  contact_phone text not null check (char_length(contact_phone) between 8 and 20),
  created_at    timestamptz not null default now()
);

create index if not exists emergency_contacts_customer_idx
  on public.emergency_contacts (customer_id);

-- ============================================================================
-- bookings
-- ============================================================================
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique
                     default 'HR-' || to_char(nextval('public.booking_reference_seq'), 'FM000000'),
  customer_id      uuid not null references public.customers (id) on delete cascade,
  start_datetime   timestamptz not null,
  end_datetime     timestamptz not null,
  total_hours      numeric(6,2) not null check (total_hours > 0),
  estimated_amount numeric(10,2),
  special_notes    text check (special_notes is null or char_length(special_notes) <= 1000),
  status           public.booking_status not null default 'New',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint bookings_valid_range check (end_datetime > start_datetime)
);

create index if not exists bookings_customer_idx    on public.bookings (customer_id);
create index if not exists bookings_status_idx      on public.bookings (status);
create index if not exists bookings_start_idx       on public.bookings (start_datetime);
create index if not exists bookings_created_at_idx  on public.bookings (created_at desc);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- activity_logs  (audit trail for every booking)
-- ============================================================================
create table if not exists public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  action      text not null,
  actor       text not null default 'system',
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_logs_booking_idx
  on public.activity_logs (booking_id, created_at desc);

-- Auto-log booking creation and status transitions -------------------------
create or replace function public.log_booking_activity()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_logs (booking_id, action, actor, metadata)
    values (new.id, 'created', 'customer',
            jsonb_build_object('status', new.status, 'reference', new.reference));
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.activity_logs (booking_id, action, actor, metadata)
    values (new.id, 'status_changed', 'admin',
            jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  return new;
end;
$$;

create trigger bookings_log_insert
  after insert on public.bookings
  for each row execute function public.log_booking_activity();

create trigger bookings_log_status
  after update on public.bookings
  for each row execute function public.log_booking_activity();

-- ============================================================================
-- Row Level Security
--
-- Default-deny for everyone. The public booking form writes through a
-- Server Action using the service-role key, which bypasses RLS. Browser
-- (anon) clients get NO access. Authenticated admins get full CRUD.
-- ============================================================================
alter table public.customers          enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.bookings           enable row level security;
alter table public.activity_logs      enable row level security;

-- Admin (authenticated) full access ----------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['customers','emergency_contacts','bookings','activity_logs']
  loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true);',
      t || '_admin_all', t
    );
  end loop;
end$$;
