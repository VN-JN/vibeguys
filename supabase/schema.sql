-- Run in Supabase SQL Editor before connecting the browser app.
-- Never expose a secret/service_role key in the client.
create extension if not exists pgcrypto;

create type public.product_platform as enum ('web', 'app', 'both');
create type public.product_status as enum ('pending', 'published', 'rejected', 'archived');
create type public.pricing_type as enum ('free', 'freemium', 'paid');
create type public.report_reason as enum ('scam', 'broken', 'misleading', 'copyright', 'offensive', 'spam', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  locale text not null default 'en' check (locale in ('en', 'ko')),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  platform public.product_platform not null,
  category text not null,
  pricing public.pricing_type not null default 'free',
  name_en text not null check (char_length(name_en) between 1 and 100),
  name_ko text,
  tagline_en text not null check (char_length(tagline_en) between 1 and 180),
  tagline_ko text,
  description_en text not null check (char_length(description_en) between 1 and 5000),
  description_ko text,
  website_url text not null check (website_url ~ '^https://'),
  thumbnail_url text,
  tags text[] not null default '{}',
  status public.product_status not null default 'pending',
  featured boolean not null default false,
  staff_pick boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_public_feed_idx on public.products (status, platform, category, published_at desc);
create index products_owner_idx on public.products (owner_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 1 and 140),
  body text not null check (char_length(body) between 1 and 3000),
  pros text,
  cons text,
  use_case text,
  recommended boolean not null default true,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index reviews_product_idx on public.reviews (product_id, created_at desc);

create table public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  funding_goal numeric(12,2) not null check (funding_goal > 0),
  deadline timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'closed')),
  created_at timestamptz not null default now()
);
create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  platform_fee numeric(12,2) not null check (platform_fee = round(amount * 0.10, 2)),
  creator_amount numeric(12,2) not null check (creator_amount = amount - platform_fee),
  payment_status text not null default 'demo' check (payment_status in ('demo', 'pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);
create index contributions_project_idx on public.contributions (project_id, created_at desc);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason public.report_reason not null,
  note text check (char_length(note) <= 1500),
  created_at timestamptz not null default now(),
  unique (product_id, reporter_id, reason)
);

-- Auth trigger only creates a profile; it does not grant administrative privileges.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Vibe person'), new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Exposed tables: enable RLS before grants/policies.
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.bookmarks enable row level security;
alter table public.projects enable row level security;
alter table public.contributions enable row level security;
alter table public.reports enable row level security;
grant select on public.profiles, public.products, public.reviews, public.projects to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert, update, delete on public.products, public.reviews, public.bookmarks, public.contributions, public.reports to authenticated;
grant select on public.bookmarks, public.contributions, public.reports to authenticated;

create policy "public profiles are visible" on public.profiles for select to anon, authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "published products are public" on public.products for select to anon, authenticated using (status = 'published' or (select auth.uid()) = owner_id);
create policy "users submit own products" on public.products for insert to authenticated with check ((select auth.uid()) = owner_id and status = 'pending');
create policy "owners update own products" on public.products for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id and status = 'pending');
create policy "owners delete own pending products" on public.products for delete to authenticated using ((select auth.uid()) = owner_id and status = 'pending');
create policy "published product reviews are public" on public.reviews for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "users insert reviews" on public.reviews for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "users update own reviews" on public.reviews for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own reviews" on public.reviews for delete to authenticated using ((select auth.uid()) = user_id);
create policy "users manage own bookmarks" on public.bookmarks for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "active projects are public" on public.projects for select to anon, authenticated using (status = 'active');
create policy "users create their own demo contributions" on public.contributions for insert to authenticated with check ((select auth.uid()) = user_id and payment_status = 'demo');
create policy "users see their own contributions" on public.contributions for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create reports" on public.reports for insert to authenticated with check ((select auth.uid()) = reporter_id);
create policy "users see their own reports" on public.reports for select to authenticated using ((select auth.uid()) = reporter_id);
