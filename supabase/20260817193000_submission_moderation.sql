-- Two submission tracks, recorded policy acceptance, automated URL pre-check,
-- and a human-only moderation queue.

alter table public.products
  add column if not exists listing_type text not null default 'live'
    check (listing_type in ('live', 'funding')),
  add column if not exists terms_version text,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists moderation_status text not null default 'scan_pending'
    check (moderation_status in ('scan_pending', 'awaiting_admin', 'needs_review', 'approved', 'rejected', 'hidden')),
  add column if not exists security_scan_status text not null default 'queued'
    check (security_scan_status in ('queued', 'passed', 'flagged', 'error')),
  add column if not exists security_scan_summary text,
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists reviewed_at timestamptz,
  add column if not exists moderation_note text check (char_length(moderation_note) <= 2000);

alter table public.products alter column website_url drop not null;
alter table public.products drop constraint if exists products_website_url_check;
alter table public.products add constraint products_website_url_https_check
  check (website_url is null or website_url ~ '^https://');

alter table public.projects
  add column if not exists reward_tiers jsonb not null default '[]'::jsonb
    check (jsonb_typeof(reward_tiers) = 'array'),
  add column if not exists reward_summary text
    check (char_length(reward_summary) <= 2000),
  add column if not exists prototype_url text
    check (prototype_url is null or prototype_url ~ '^https://');

create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.security_scans (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  scanner_version text not null,
  status text not null check (status in ('passed', 'flagged', 'error')),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  checks jsonb not null default '[]'::jsonb,
  summary text not null,
  scanned_at timestamptz not null default now()
);

create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  registrant_id uuid not null references public.profiles(id) on delete cascade,
  policy_version text not null,
  accepted_at timestamptz not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_vibeguys_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_vibeguys_admin() from public;
grant execute on function public.is_vibeguys_admin() to authenticated;

create or replace function public.record_submission_acceptance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.terms_version is null or new.terms_accepted_at is null then
    raise exception 'Submission terms must be accepted before registration';
  end if;
  insert into public.legal_acceptances (product_id, registrant_id, policy_version, accepted_at)
  values (new.id, new.owner_id, new.terms_version, new.terms_accepted_at);
  return new;
end;
$$;
revoke all on function public.record_submission_acceptance() from public;
revoke execute on function public.record_submission_acceptance() from anon, authenticated;

drop trigger if exists products_record_submission_acceptance on public.products;
create trigger products_record_submission_acceptance
  after insert on public.products
  for each row execute procedure public.record_submission_acceptance();

alter table public.admin_users enable row level security;
alter table public.security_scans enable row level security;
alter table public.legal_acceptances enable row level security;

revoke update on public.products from authenticated;
grant insert on public.projects to authenticated;
grant select on public.security_scans, public.legal_acceptances to authenticated;

drop policy if exists "users submit own products" on public.products;
drop policy if exists "owners update own products" on public.products;
create policy "users submit policy-accepted products" on public.products for insert to authenticated
  with check (
    (select auth.uid()) = owner_id
    and status = 'pending'
    and moderation_status = 'scan_pending'
    and security_scan_status = 'queued'
    and terms_version = '2026-08-17'
    and terms_accepted_at is not null
  );
create policy "admins read every product" on public.products for select to authenticated
  using ((select public.is_vibeguys_admin()));
create policy "admins update products" on public.products for update to authenticated
  using ((select public.is_vibeguys_admin()))
  with check ((select public.is_vibeguys_admin()));

create policy "owners create funding projects" on public.projects for insert to authenticated
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.owner_id = (select auth.uid())
        and p.listing_type = 'funding' and p.status = 'pending'
    )
  );
create policy "admins read all projects" on public.projects for select to authenticated
  using ((select public.is_vibeguys_admin()));
create policy "admins update projects" on public.projects for update to authenticated
  using ((select public.is_vibeguys_admin()))
  with check ((select public.is_vibeguys_admin()));

create policy "owners read own scan" on public.security_scans for select to authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.owner_id = (select auth.uid())));
create policy "admins read all scans" on public.security_scans for select to authenticated
  using ((select public.is_vibeguys_admin()));
create policy "owners read own legal acceptance" on public.legal_acceptances for select to authenticated
  using (registrant_id = (select auth.uid()));
create policy "admins read all legal acceptances" on public.legal_acceptances for select to authenticated
  using ((select public.is_vibeguys_admin()));

-- Bootstrap the verified project owner as the first moderator.
insert into public.admin_users (user_id)
values ('786f8166-e4ad-4447-8840-859633c81d5c')
on conflict (user_id) do nothing;

create index if not exists products_moderation_queue_idx
  on public.products (moderation_status, security_scan_status, created_at desc);
