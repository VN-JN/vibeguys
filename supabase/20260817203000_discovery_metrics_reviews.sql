create schema if not exists private;
revoke all on schema private from public;

alter table public.products
  add column if not exists visit_count integer not null default 0 check (visit_count >= 0),
  add column if not exists review_count integer not null default 0 check (review_count >= 0),
  add column if not exists last_activity_at timestamptz;
update public.products set last_activity_at = coalesce(last_activity_at, published_at, created_at);

alter table public.reviews
  add column if not exists source_language text not null default 'en' check (source_language in ('ko','en')),
  add column if not exists translated_title_ko text,
  add column if not exists translated_body_ko text,
  add column if not exists translated_title_en text,
  add column if not exists translated_body_en text;

create table if not exists public.product_visits (
  product_id uuid not null references public.products(id) on delete cascade,
  visitor_key uuid not null,
  visited_on date not null default current_date,
  created_at timestamptz not null default now(),
  primary key (product_id, visitor_key, visited_on)
);
create index if not exists product_visits_product_idx on public.product_visits (product_id, visited_on desc);
alter table public.product_visits enable row level security;
grant insert on public.product_visits to anon, authenticated;
create policy "public records a daily outbound visit" on public.product_visits for insert to anon, authenticated
  with check (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));

create or replace function private.record_product_visit_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.products set visit_count = visit_count + 1, last_activity_at = now() where id = new.product_id;
  return new;
end;
$$;
revoke all on function private.record_product_visit_activity() from public;
create trigger product_visits_refresh_activity after insert on public.product_visits
  for each row execute function private.record_product_visit_activity();

create or replace function private.record_review_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.products set review_count = review_count + 1, last_activity_at = now() where id = new.product_id;
  return new;
end;
$$;
revoke all on function private.record_review_activity() from public;
create trigger reviews_refresh_activity after insert on public.reviews
  for each row execute function private.record_review_activity();

create or replace function private.archive_inactive_products()
returns integer language plpgsql security definer set search_path = '' as $$
declare changed integer;
begin
  update public.products
  set status = 'archived', moderation_status = 'hidden', moderation_note = 'Automatically archived after 7 days without visits or reviews.'
  where status = 'published' and visit_count = 0 and review_count = 0
    and published_at < now() - interval '7 days';
  get diagnostics changed = row_count;
  return changed;
end;
$$;
revoke all on function private.archive_inactive_products() from public;

create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'archive-inactive-vibeguys-products';
select cron.schedule('archive-inactive-vibeguys-products', '15 0 * * *', $$select private.archive_inactive_products();$$);
