// find-wine: the recommender, end to end inside Supabase.
//   1. embed the user's "vibe" with gte-small (runs in the Edge runtime, no
//      external embedding key),
//   2. pgvector + HNSW finds the closest wines via the match_wines_v2 RPC.
//      The caller's JWT is forwarded and the RPC is SECURITY INVOKER, so RLS
//      applies: a logged-out visitor never gets an exclusive (members-only) wine.
//   3. Groq writes the sommelier note (key held in Supabase secrets).
// Replaces the old FastAPI service. Same request/response shape the frontend used.
import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

// gte-small: 384-dim. Same model the catalog is embedded with, so vectors compare.
// @ts-ignore: Supabase Edge runtime global
const model = new Supabase.ai.Session("gte-small");

// DeepSeek via the OpenAI SDK (OpenAI-compatible API). Key held in Supabase secrets.
const llm = new OpenAI({
  // @ts-ignore: Deno global
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  baseURL: "https://api.deepseek.com",
});
const GEN_MODEL = "deepseek-v4-pro";

const SOMMELIER_SYSTEM_PROMPT = `
You are a hip sommelier. Be cool but not over the top.
Explain your reasoning for the recommendation as it specifically relates to the user's vibe.
Be casual and interesting. Mention the vibe, how the wine's features fit, and pairings when applicable.

IMPORTANT:
- The wine description and tags are the source of truth. Use them to explain your pick.
- Keep it tight: 3 short sentences, one compact paragraph. No walls of text.
- NEVER let your text get cut off. Plan the note so it fits the token limit.
`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
};

// @ts-ignore: Deno global
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { vibe, maxPrice = 100, shuffle = false, excludeIds = [] } =
      await req.json();
    if (!vibe || typeof vibe !== "string") {
      return json({ error: "Missing 'vibe' string" }, 400);
    }

    // 1. embed the vibe (in-runtime, no external call)
    const embedding = await model.run(vibe, { mean_pool: true, normalize: true });

    // 2. retrieve closest wines over pgvector. Forward the caller's auth header so
    // the SECURITY INVOKER RPC runs under their role and RLS gates exclusives.
    const supabase = createClient(
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const { data: matches, error } = await supabase.rpc("match_wines_v2", {
      query_embedding: embedding,
      match_count: 20,
    });
    if (error) return json({ error: error.message }, 500);

    // Exclude exclusive (members-only) bottles from regular recommendations — they
    // live only in Exclusive Picks, never in the general search.
    const candidates = (matches ?? []).filter(
      (w: { price: number; exclusive?: boolean }) =>
        Number(w.price) <= Number(maxPrice) && !w.exclusive,
    );
    if (candidates.length === 0) {
      return json({ wine: null, note: "", candidates: [] }, 200);
    }

    // 3. pick: shuffle from the pool (minus already-seen ids) or take the top match
    let wine;
    if (shuffle) {
      const pool = candidates.filter(
        (w: { id: number }) => !excludeIds.includes(w.id),
      );
      wine = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : candidates[0];
    } else {
      wine = candidates[0];
    }
    wine.match_score = wine.similarity;

    const note = await generateNote(vibe, wine);
    return json({ wine, note, candidates }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

async function generateNote(vibe: string, wine: unknown): Promise<string> {
  try {
    const completion = await llm.chat.completions.create({
      model: GEN_MODEL,
      temperature: 0.9,
      max_tokens: 400,
      // deepseek-v4-pro is a reasoning model; the note is a short creative task that
      // doesn't need it, and reasoning adds ~15s. Disable it to keep the rec snappy.
      thinking: { type: "disabled" },
      messages: [
        { role: "system", content: SOMMELIER_SYSTEM_PROMPT },
        { role: "user", content: `User Vibe: ${vibe}\nWine: ${JSON.stringify(wine)}` },
      ],
    } as never);
    return completion.choices?.[0]?.message?.content ?? `A perfect match for your vibe.`;
  } catch (_e) {
    return `A perfect match for your vibe.`;
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
