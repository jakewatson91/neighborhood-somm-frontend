// generate-blurb: writes a members-only tasting blurb for an exclusive wine.
// Fired by a Database Webhook when a wine is marked exclusive (or called by id to
// backfill). Reads the row, asks Groq for a short club-style note, writes it back to
// member_blurb. The "the database writes its own marketing copy" beat.
import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

// DeepSeek via the OpenAI SDK (OpenAI-compatible API). Key held in Supabase secrets.
const llm = new OpenAI({
  // @ts-ignore: Deno global
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  baseURL: "https://api.deepseek.com",
});
const GEN_MODEL = "deepseek-v4-pro";

const BLURB_SYSTEM_PROMPT = `
You write short, evocative members-only tasting notes for an exclusive wine club.
Exactly two short sentences, warm and confident, a touch of insider flattery ("our members
reach for this when..."). Ground it in the wine's description, grape, and pairings.
Plain language, no purple excess. NEVER get cut off mid-sentence.
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
    const payload = await req.json();
    // accept {id} (backfill) or a webhook envelope {record:{id,...}}
    const id = payload.id ?? payload.record?.id;
    if (id === undefined || id === null) {
      return json({ error: "Missing 'id'" }, 400);
    }

    // service role: this function writes back, and runs server-side only
    const supabase = createClient(
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore: Deno global
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: wine, error: readErr } = await supabase
      .from("wines")
      .select("id, title, description, tags, features, exclusive")
      .eq("id", id)
      .single();
    if (readErr || !wine) return json({ error: readErr?.message ?? "not found" }, 404);
    if (!wine.exclusive) return json({ ok: true, skipped: "not exclusive" }, 200);

    const completion = await llm.chat.completions.create({
      model: GEN_MODEL,
      temperature: 0.8,
      max_tokens: 400,
      // deepseek-v4-pro is a reasoning model; disable reasoning for this short
      // creative task to keep it fast (reasoning otherwise eats the token budget).
      thinking: { type: "disabled" },
      messages: [
        { role: "system", content: BLURB_SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(wine) },
      ],
    } as never);
    const blurb = completion.choices?.[0]?.message?.content ?? "";

    const { error: updErr } = await supabase
      .from("wines")
      .update({ member_blurb: blurb })
      .eq("id", id);
    if (updErr) return json({ error: updErr.message }, 500);

    return json({ ok: true, id, blurb }, 200);
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
