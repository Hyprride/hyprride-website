-- ============================================================================
-- HYPRRIDE — Lead Management System
-- Migration 0005: messages (per-customer message log)
--
-- Backs the Messages inbox. For now the dashboard logs outbound messages and
-- internal notes (WhatsApp is delivered via a wa.me deep link and recorded
-- here). The `direction`/`channel` shape is ready for real WhatsApp/Instagram
-- inbound once those integrations are connected.
--
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers(id) on delete cascade,
  channel      text not null check (channel in ('whatsapp', 'instagram', 'note')),
  direction    text not null default 'out' check (direction in ('in', 'out')),
  body         text not null check (char_length(body) between 1 and 4000),
  created_at   timestamptz not null default now()
);

create index if not exists messages_customer_created_idx
  on public.messages (customer_id, created_at);

-- Row Level Security: anon blocked, authenticated admins get full access
-- (matches customers/bookings/etc. from migration 0001).
alter table public.messages enable row level security;

drop policy if exists messages_admin_all on public.messages;
create policy messages_admin_all
  on public.messages
  for all
  to authenticated
  using (true)
  with check (true);
