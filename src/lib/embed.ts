import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Same model the catalog is embedded with (gte-small, 384-dim) — vectors compare.
const MODEL = "Xenova/gte-small";

// The overloaded pipeline() signature is too large for tsc; pin the narrow one.
const buildPipeline = pipeline as unknown as (
  task: "feature-extraction",
  model: string,
  opts: { dtype: string },
) => Promise<FeatureExtractionPipeline>;

let extractor: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  if (!extractor) extractor = buildPipeline("feature-extraction", MODEL, { dtype: "fp32" });
  return extractor;
}

/** Embed one string in the browser, normalized for cosine similarity. */
export async function embedInBrowser(text: string): Promise<Float32Array> {
  const model = await getExtractor();
  const output = await model(text, { pooling: "mean", normalize: true });
  return output.data as Float32Array;
}

/** Pre-warm the model so the first real search isn't paying download/compile cost. */
export function preloadEmbedder() {
  void getExtractor();
}
