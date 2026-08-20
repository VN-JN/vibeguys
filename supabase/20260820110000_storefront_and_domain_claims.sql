alter table public.products
  add column if not exists canonical_domain text unique,
  add column if not exists developer_name text,
  add column if not exists header_image_url text check (header_image_url is null or header_image_url ~ '^https://'),
  add column if not exists screenshot_urls text[] not null default '{}',
  add column if not exists release_stage text not null default 'released' check (release_stage in ('released','early_access','in_development')),
  add column if not exists site_verified_at timestamptz,
  add column if not exists site_verified_by uuid references public.profiles(id);

create or replace function private.set_canonical_domain()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.website_url is null then new.canonical_domain := null; return new; end if;
  new.canonical_domain := lower(regexp_replace(split_part(regexp_replace(new.website_url, '^https?://', ''), '/', 1), '^www\\.', ''));
  return new;
end;
$$;
revoke all on function private.set_canonical_domain() from public;
drop trigger if exists products_set_canonical_domain on public.products;
create trigger products_set_canonical_domain before insert or update of website_url on public.products
  for each row execute function private.set_canonical_domain();
update public.products set website_url = website_url where website_url is not null and canonical_domain is null;

create table if not exists public.product_domain_claims (
  product_id uuid primary key references public.products(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade,
  verification_token uuid not null,
  status text not null default 'pending' check (status in ('pending','verified','expired')),
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.product_domain_claims enable row level security;
grant select on public.product_domain_claims to authenticated;
create policy "claimants read own domain claims" on public.product_domain_claims for select to authenticated
  using (claimant_id = (select auth.uid()) or (select public.is_vibeguys_admin()));
create index if not exists products_canonical_domain_idx on public.products (canonical_domain);
