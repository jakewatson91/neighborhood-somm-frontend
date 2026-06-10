import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { embedInBrowser, preloadEmbedder } from "@/lib/embed";

const TOP_K = 5;
const DEFAULT_QUERY = "a bold, structured red for a steak dinner";

type WineHit = { id: number; title: string; similarity?: number; product_type?: string };
type Timings = Record<string, number>;
type PathResult = { results: WineHit[]; timings: Timings; error?: string };

function dot(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

const PAGE_SIZE = 1000;

async function pullAllVectors(): Promise<{ id: number; embedding_v2: unknown }[]> {
  const all: { id: number; embedding_v2: unknown }[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("wines")
      .select("id, embedding_v2")
      .not("embedding_v2", "is", null)
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    all.push(...(data as { id: number; embedding_v2: unknown }[]));
    if (data.length < PAGE_SIZE) break;
  }
  return all;
}

/** pgvector comes back as text like "[0.1,0.2,...]" over PostgREST. */
function parseEmbedding(raw: unknown): Float32Array {
  if (Array.isArray(raw)) return Float32Array.from(raw as number[]);
  const str = String(raw).replace(/^\[|\]$/g, "");
  return Float32Array.from(str.split(",").map(Number));
}

/** Path A: embed in the browser, pull every vector, rank locally, fetch details. */
async function clientSideSearch(query: string): Promise<PathResult> {
  const timings: Timings = {};

  let t0 = performance.now();
  const qvec = await embedInBrowser(query);
  timings["1. embed query (browser)"] = performance.now() - t0;

  t0 = performance.now();
  const rows = await pullAllVectors();
  timings[`2. pull ${rows.length} vectors (network)`] = performance.now() - t0;

  t0 = performance.now();
  const scored = rows.map((r) => ({ id: r.id, score: dot(qvec, parseEmbedding(r.embedding_v2)) }));
  scored.sort((a, b) => b.score - a.score);
  const topIds = scored.slice(0, TOP_K).map((s) => s.id);
  timings["3. cosine rank (browser CPU)"] = performance.now() - t0;

  t0 = performance.now();
  const { data: details, error } = await supabase
    .from("wines").select("id, title, product_type").in("id", topIds);
  if (error) return { results: [], timings, error: error.message };
  timings["4. fetch top-k details (2nd trip)"] = performance.now() - t0;

  const byId = new Map((details ?? []).map((d) => [d.id, d]));
  const scoreById = new Map(scored.map((s) => [s.id, s.score]));
  const results: WineHit[] = topIds.map((id) => ({
    id,
    title: byId.get(id)?.title ?? "",
    product_type: byId.get(id)?.product_type,
    similarity: scoreById.get(id),
  }));
  return { results, timings };
}

/** Path B: send raw text to an Edge Function — embeds + searches server-side, one trip. */
async function serverSideSearch(query: string): Promise<PathResult> {
  const timings: Timings = {};
  const t0 = performance.now();
  const { data, error } = await supabase.functions.invoke("search-wines", {
    body: { query, match_count: TOP_K },
  });
  timings["1. embed + pgvector search (Edge Function, 1 trip)"] = performance.now() - t0;
  if (error) return { results: [], timings, error: error.message };
  return { results: data?.results ?? [], timings };
}

const total = (t: Timings) => Object.values(t).reduce((a, b) => a + b, 0);

export default function Compare() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<PathResult | null>(null);
  const [server, setServer] = useState<PathResult | null>(null);
  const warmed = useRef(false);

  useEffect(() => {
    if (!warmed.current) {
      warmed.current = true;
      preloadEmbedder();
    }
  }, []);

  async function run() {
    setLoading(true);
    setClient(null);
    setServer(null);
    await Promise.all([
      clientSideSearch(query).then(setClient),
      serverSideSearch(query).then(setServer),
    ]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold">Vector search: browser vs. database</h1>
          <p className="text-sm text-foreground/75 mt-2">
            Same semantic search over the ~800-bottle wine catalog, two ways, timed live in your browser.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by meaning, not just keywords..."
            className="flex-1 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30" />
          <button type="submit" disabled={loading}
            className="rounded-md bg-foreground text-background px-5 py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
            {loading ? "Searching..." : "Compare"}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultPanel
            title="A. Client-side (browser embeds + searches)"
            subtitle="Cost grows with the catalog — 10x the bottles means 10x the bytes pulled and 10x the dot products."
            steps={[
              "Embed the query in the browser.",
              "Pull every wine's 384-dim vector over the wire, paged 1,000 rows at a time.",
              "Reconstruct each vector and run one dot product per row on a single CPU thread before anything can rank.",
              "Second round trip to fetch the winning rows' details.",
            ]}
            result={client} loading={loading} />
          <ResultPanel
            title="B. Server-side (Edge Function does everything)"
            subtitle="Flat latency whether the cellar holds 800 bottles or 50,000 — same ranking, no table scan."
            steps={[
              "Send the raw query text once.",
              "An Edge Function embeds it server-side.",
              <>One SQL query — <code className="px-1 rounded bg-foreground/10 text-xs">ORDER BY embedding_v2 &lt;=&gt; query LIMIT 5</code> — Postgres walks the HNSW index straight to the nearest neighbors.</>,
              "One round trip back with the results.",
            ]}
            result={server} loading={loading} />
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ title, subtitle, steps, result, loading }: {
  title: string; subtitle: string; steps: React.ReactNode[]; result: PathResult | null; loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-foreground/20 p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="text-xs text-foreground/85 mt-1">{subtitle}</p>
      </div>

      <ol className="list-decimal pl-5 flex flex-col gap-1 text-xs text-foreground/75 marker:text-foreground/50">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
      {loading && !result && <p className="text-sm text-foreground/75">Running...</p>}
      {result?.error && <p className="text-sm text-red-500">Error: {result.error}</p>}
      {result && !result.error && (
        <>
          <div className="rounded-md bg-foreground/5 px-3 py-2 text-xs font-mono flex flex-col gap-1">
            {Object.entries(result.timings).map(([label, ms]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-foreground/75">{label}</span>
                <span>{ms.toFixed(1)}ms</span>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-foreground/20 font-semibold">
              <span>total</span><span>{total(result.timings).toFixed(1)}ms</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {result.results.map((w) => (
              <div key={w.id} className="text-sm flex items-center justify-between gap-2">
                <span className="font-medium">{w.title}</span>
                {w.similarity !== undefined && (
                  <span className="text-xs text-foreground/85 shrink-0">{Math.round(w.similarity * 100)}%</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
