-- Wine demo: members-only exclusive picks + gte-small search, all additive.
-- Non-destructive: the original MiniLM `embedding` column and the existing
-- `match_wines` RPC are left intact, so the old FastAPI path still works and the
-- whole change is reversible (see rollback.sql).
set search_path = public, extensions;

-- 1. Additive columns -------------------------------------------------------
alter table public.wines add column if not exists exclusive boolean not null default false;
alter table public.wines add column if not exists member_blurb text;
alter table public.wines add column if not exists embedding_v2 vector(384);

-- 2. Search RPC over the gte-small vectors. SECURITY INVOKER => RLS applies to
--    the caller, so an anonymous visitor's search never returns exclusive wines.
create or replace function public.match_wines_v2 (
  query_embedding vector(384),
  match_count int default 20
) returns table (
  id            bigint,
  title         text,
  handle        text,
  price         double precision,
  image_url     text,
  product_type  text,
  description   text,
  tags          text[],
  features      jsonb,
  member_blurb  text,
  exclusive     boolean,
  similarity    double precision
)
language sql stable security invoker
set search_path = public, extensions
as $$
  select w.id, w.title, w.handle, w.price, w.image_url, w.product_type,
         w.description, w.tags, w.features, w.member_blurb, w.exclusive,
         1 - (w.embedding_v2 <=> query_embedding) as similarity
  from public.wines w
  where w.embedding_v2 is not null
  order by w.embedding_v2 <=> query_embedding
  limit match_count;
$$;

-- 3. HNSW index for fast nearest-neighbour over the gte-small vectors
create index if not exists wines_embedding_v2_hnsw
  on public.wines using hnsw (embedding_v2 vector_cosine_ops);

-- 4. Mark a handful of premium bottles as members-only (deterministic: priciest 8)
update public.wines set exclusive = true
where id in (
  select id from public.wines order by price desc nulls last limit 8
);

-- 5. Row-Level Security: the catalog is public-read, exclusives are gated -----
alter table public.wines enable row level security;

drop policy if exists "wines_anon_select_non_exclusive" on public.wines;
create policy "wines_anon_select_non_exclusive" on public.wines
  for select to anon using (exclusive = false);

drop policy if exists "wines_member_select_all" on public.wines;
create policy "wines_member_select_all" on public.wines
  for select to authenticated using (true);

-- PostgREST roles can read the table (RLS still gates the rows) and call the RPC
grant select on public.wines to anon, authenticated;
grant execute on function public.match_wines_v2(vector, int) to anon, authenticated;
