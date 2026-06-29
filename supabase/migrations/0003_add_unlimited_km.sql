-- ============================================================================
-- HYPRRIDE — Lead Management System
-- Migration 0003: capture the unlimited-km choice on a lead
--
-- The booking form lets a rider unlock unlimited km (a one-time slab-based fee:
-- ₹50 for 1/3/5/7h, ₹79 for 12/24h). We record the choice + fee so it can be
-- carried into the booking service. `estimated_amount` already includes this
-- fee; GST is shown on the form but NOT stored here.
--
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

alter table public.bookings
  add column if not exists is_unlimited_km boolean not null default false,
  add column if not exists unlimited_km_charge numeric(10,2);
