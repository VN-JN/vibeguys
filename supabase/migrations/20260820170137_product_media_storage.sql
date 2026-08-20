insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-media',
  'product-media',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product media insert own folder" on storage.objects;
create policy "product media insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "product media delete own folder" on storage.objects;
create policy "product media delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
