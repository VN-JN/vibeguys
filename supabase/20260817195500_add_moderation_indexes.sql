create index if not exists products_reviewed_by_idx on public.products (reviewed_by);
create index if not exists legal_acceptances_registrant_idx on public.legal_acceptances (registrant_id);
