-- Reverse 20260609160640_wine_member_picks.sql. The original `embedding` column
-- and `match_wines` RPC were never touched, so this restores the prior state.
set search_path = public, extensions;

drop policy if exists "wines_anon_select_non_exclusive" on public.wines;
drop policy if exists "wines_member_select_all" on public.wines;
alter table public.wines disable row level security;

drop function if exists public.match_wines_v2(vector, int);
drop index if exists public.wines_embedding_v2_hnsw;

alter table public.wines drop column if exists exclusive;
alter table public.wines drop column if exists member_blurb;
alter table public.wines drop column if exists embedding_v2;
