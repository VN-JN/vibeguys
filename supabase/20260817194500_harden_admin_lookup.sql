-- Let signed-in users discover only their own administrator role.
-- This keeps the UI check working without a publicly executable SECURITY DEFINER RPC.
create policy "users read own administrator role" on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_vibeguys_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_vibeguys_admin() from public, anon;
grant execute on function public.is_vibeguys_admin() to authenticated;

drop policy if exists "admins read every product" on public.products;
drop policy if exists "published products are public" on public.products;
create policy "public published products" on public.products for select to anon
  using (status = 'published');
create policy "members see published own and admin products" on public.products for select to authenticated
  using (status = 'published' or (select auth.uid()) = owner_id or (select public.is_vibeguys_admin()));

drop policy if exists "admins read all projects" on public.projects;
drop policy if exists "active projects are public" on public.projects;
create policy "public active projects" on public.projects for select to anon
  using (status = 'active');
create policy "members see active and admin projects" on public.projects for select to authenticated
  using (status = 'active' or (select public.is_vibeguys_admin()));

drop policy if exists "owners read own scan" on public.security_scans;
drop policy if exists "admins read all scans" on public.security_scans;
create policy "owners and admins read scans" on public.security_scans for select to authenticated
  using (
    (select public.is_vibeguys_admin())
    or exists (select 1 from public.products p where p.id = product_id and p.owner_id = (select auth.uid()))
  );

drop policy if exists "owners read own legal acceptance" on public.legal_acceptances;
drop policy if exists "admins read all legal acceptances" on public.legal_acceptances;
create policy "registrants and admins read legal acceptances" on public.legal_acceptances for select to authenticated
  using (registrant_id = (select auth.uid()) or (select public.is_vibeguys_admin()));
