-- ============================================================================
-- HYPRRIDE — Lead Management System
-- Migration 0002: align the lead-gen schema with the in-house booking service
--
-- Prepares website leads to map cleanly onto a booking-service booking later,
-- WITHOUT adopting the 25-table operational schema. Three groups of changes:
--
--   1. Identity → phone (+91 E.164), like the booking service (email demoted).
--   2. Lead capture → vehicle interest + preferred slab (+ reuse estimated_amount).
--   3. Integration link → external_booking_id / external_reference / sync_status.
--
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Phone-first identity, in +91 E.164 (matches booking service `customers`)
-- ----------------------------------------------------------------------------
-- Normalize any existing phones to "+91XXXXXXXXXX" before enforcing uniqueness.
update public.customers
set phone = '+91' || right(regexp_replace(phone, '\D', '', 'g'), 10)
where phone !~ '^\+91';

update public.emergency_contacts
set contact_phone = '+91' || right(regexp_replace(contact_phone, '\D', '', 'g'), 10)
where contact_phone !~ '^\+91';

-- Phone becomes the unique customer key (the booking service matches on phone).
-- Replaces the old non-unique lookup index.
drop index if exists public.customers_phone_idx;
create unique index if not exists customers_phone_key on public.customers (phone);

-- Email demoted to an ordinary, optional field (the service keeps email nullable).
alter table public.customers alter column email drop not null;
alter table public.customers drop constraint if exists customers_email_key;

-- ----------------------------------------------------------------------------
-- 2. Lead capture: which bike + which slab the customer wants
-- ----------------------------------------------------------------------------
-- `estimated_amount` already exists (was unused) — we now populate it from the
-- website's indicative pricing. These two columns make a lead actionable and
-- let us pre-fill a booking-service draft (vehicle type + slab).
alter table public.bookings
  add column if not exists vehicle_interest text,          -- bike slug from src/lib/data.ts
  add column if not exists preferred_slab_hours integer
    check (preferred_slab_hours is null
           or preferred_slab_hours in (1, 3, 5, 7, 12, 24));

-- ----------------------------------------------------------------------------
-- 3. Integration link to the booking service (system of record)
-- ----------------------------------------------------------------------------
-- When staff promote a lead, we push it to the booking service's API and store
-- the returned id/reference here, so the dashboard can link out and we never
-- double-push.
alter table public.bookings
  add column if not exists external_booking_id uuid,
  add column if not exists external_reference  text,
  add column if not exists sync_status text not null default 'not_pushed'
    check (sync_status in ('not_pushed', 'pushed', 'failed'));

create index if not exists bookings_sync_status_idx on public.bookings (sync_status);
