// search-wines: pure semantic search (no LLM) for the browser-vs-database compare.
// Embeds the query with gte-small in the Edge runtime, then match_wines_v2 ranks via
// pgvector + HNSW in one round trip. RLS applies (forwarded JWT), same as find-wine.
import { createClient } from "jsr:@supabase/supabase-js@2";

// @ts-ignore: Supabase Edge runtime global
const model = new Supabase.ai.Session("gte-small");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
};

// @ts-ignore: Deno global
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { query, match_count = 5 } = await req.json();
    if (!query || typeof query !== "string") return json({ error: "Missing 'query'" }, 400);

    const embedding = await model.run(query, { mean_pool: true, normalize: true });

    const supabase = createClient(
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const { data, error } = await supabase.rpc("match_wines_v2", {
      query_embedding: embedding,
      match_count,
    });
    if (error) return json({ error: error.message }, 500);
    return json({ results: data ?? [] }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
