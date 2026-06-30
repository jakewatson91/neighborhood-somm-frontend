-- Stop the 384-dim wine vectors from being served over the public REST API.
--
-- public.wines grants `select` on ALL columns to anon/authenticated, and the
-- anon key ships in the frontend bundle, so /rest/v1/wines?select=* returns all
-- ~803 rows WITH both vector columns (embedding ~4.7KB + embedding_v2 ~4.7KB,
-- serialized as JSON text) = ~10.3KB/row. 92% of that payload is vectors no
-- client needs. One full-table scrape is ~8.3MB; bots hitting the public
-- endpoint were driving ~489MB/day of Supabase egress with the app barely used.
--
-- Fix: revoke the blanket grant, re-grant every column EXCEPT the two vector
-- columns. PostgREST expands `select=*` to only the columns the role can read,
-- so a scrape drops from ~10.3KB/row to ~0.8KB/row (~8.3MB -> ~0.6MB full table).

revoke select on public.wines from anon, authenticated;

grant select (id, title, handle, price, image_url, product_type,
              description, tags, features, exclusive, member_blurb)
  on public.wines to anon, authenticated;

-- match_wines_v2 reads embedding_v2 in its body, so after the revoke a
-- SECURITY INVOKER call would fail with "permission denied for column
-- embedding_v2". Flip to SECURITY DEFINER so the function (owned by a
-- privileged role) can read the vectors even though callers can't select the
-- column directly over REST.
--
-- The previous version was SECURITY INVOKER specifically so RLS would hide
-- members-only ("exclusive") wines from anonymous search. That gating is no
-- longer needed, so plain SECURITY DEFINER is fine and no exclusive filter is
-- required in the body.
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
language sql stable security definer
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

grant execute on function public.match_wines_v2(vector, int) to anon, authenticated;
