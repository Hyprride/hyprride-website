-- ============================================================================
-- HYPRRIDE — Lead Management System
-- Migration 0004: app_settings (dashboard-editable business configuration)
--
-- A single-row table holding operational settings the admin can edit from
-- Settings: business info, pricing & tax, and notification preferences. The
-- singleton is enforced with a boolean primary key (id = true).
--
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

create table if not exists public.app_settings (
  id                boolean primary key default true check (id),
  business_name     text not null default 'HYPRRIDE',
  legal_name        text not null default 'HYPRRIDE Bike Rentals',
  business_phone    text not null default '+91 7032887133',
  business_email    text not null default 'hyprride@gmail.com',
  business_address  text not null default 'Vittal Rao Nagar, Madhapur, Hyderabad, 500081',
  operating_hours   text not null default '7:00 AM – 12:00 AM',
  gst_rate          numeric(5,2)  not null default 18   check (gst_rate between 0 and 100),
  security_deposit  numeric(10,2) not null default 0    check (security_deposit >= 0),
  dynamic_pricing   boolean not null default false,
  notify_whatsapp   boolean not null default true,
  notify_email      boolean not null default true,
  notify_instagram  boolean not null default false,
  updated_at        timestamptz not null default now()
);

-- Keep updated_at fresh (reuses the shared helper from migration 0001).
drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- Seed the single row (id defaults to true; no-op if it already exists).
insert into public.app_settings (id) values (true)
  on conflict (id) do nothing;

-- Row Level Security: anon blocked, authenticated admins get full access
-- (matches customers/bookings/etc. from migration 0001).
alter table public.app_settings enable row level security;

drop policy if exists app_settings_admin_all on public.app_settings;
create policy app_settings_admin_all
  on public.app_settings
  for all
  to authenticated
  using (true)
  with check (true);
