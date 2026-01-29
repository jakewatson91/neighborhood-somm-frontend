// @ts-ignore: Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Deno namespace
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform', 
}

serve(async (req: Request) => { // Fixed: Explicit Request type
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    const systemPrompt = `
      You are a wine preferences parser. Convert description to JSON:
      - body, acidity, tannin (1-5)
      - wineStyle ('red','white','sparkling','any')
      - worldStyle ('old','new','any')
      - maxPrice (number)
      - flavorNotes (string)
      Output JSON only.
    `

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error("No content from AI")
    
    const preferences = JSON.parse(content)

    return new Response(
      JSON.stringify({ preferences }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) { // Fixed: Explicit any type for error
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})