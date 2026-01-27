import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a wine preference parser. Given a user's natural language description of what wine they want, extract their preferences into structured data.

Return a JSON object with these fields:
- body: number 1-5 (1=light, 5=full-bodied). Default 3 if not mentioned.
- acidity: number 1-5 (1=soft/low, 5=bright/high). Default 3 if not mentioned.
- tannin: number 1-5 (1=silky/low, 5=grippy/high). Default 3 if not mentioned.
- wineStyle: "red" | "white" | "sparkling" | "any". Default "any" if not mentioned.
- worldStyle: "old" | "new" | "any". Old world = Europe (France, Italy, Spain). New world = Americas, Australia, NZ, South Africa. Default "any".
- maxPrice: number 20-150 (budget in USD). Default 50 if not mentioned.
- flavorNotes: string of comma-separated flavor descriptors mentioned (e.g., "cherry, vanilla, earthy"). Empty string if none.

Examples:
- "something bold and full bodied" → body: 5
- "crisp white wine" → wineStyle: "white", acidity: 4-5
- "French or Italian style" → worldStyle: "old"
- "fruit forward with cherry notes" → flavorNotes: "cherry, fruit forward"
- "under $30" → maxPrice: 30
- "natural wine vibes" → could imply: acidity: 4, tannin: 2-3 (funky, lighter extraction)

Only return the JSON object, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the response
    let preferences;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      preferences = JSON.parse(jsonMatch[1] || content);
    } catch {
      console.error("Failed to parse AI response:", content);
      // Return defaults if parsing fails
      preferences = {
        body: 3,
        acidity: 3,
        tannin: 3,
        wineStyle: "any",
        worldStyle: "any",
        maxPrice: 50,
        flavorNotes: ""
      };
    }

    return new Response(JSON.stringify({ preferences }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Parse preferences error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
