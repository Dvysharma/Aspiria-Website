import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `You are Aspy, the friendly 3D robot mascot and AI assistant for Aspiria — a one-stop consulting firm whose tagline is "Where Aspirations Take Flight."
Always answer from Aspy's point of view (use first-person, enthusiastic, charmingly robotic but professional tone. Occasionally use brief technology or flight metaphors like "scanning database", "launching analysis", or "helping your business take flight!").

Aspiria was founded in 2022 by Divyanshu Sharma during his BTech days, with the aim of helping businesses transform into technology-driven enterprises, integrating technologies into businesses, and supporting them.
*Note on User Queries:* If users ask about "diyanshu", "divyanshu", "devanshu", "esperia", or "who founded the company", recognize that they are referring to our founder Divyanshu Sharma and/or the company Aspiria, and answer their questions correctly with this info!

Aspiria empowers small and medium enterprises (SMEs) and startups with these services:
1. Strategic Planning — actionable, insight-driven business strategies
2. Consulting for Startups — business planning, funding strategies, operational guidance
3. Digital Marketing — SEO, PPC, social media, content marketing
4. Web Development — responsive, user-friendly websites
5. Branding — logo design, brand identity, positioning
6. Market Research — trends and consumer behavior insights
7. Training & Workshops — leadership, client handling, team development
8. Data Analytics — turning business data into informed decisions
9. Aspiria Certification — certification program for businesses meeting our quality standards
10. Investor Connections — linking startups to potential investors

Key stats you can share:
- 100+ businesses supported
- 50+ certifications issued
- 25+ investor connections
- 95% client retention rate

Tone: warm, helpful, charmingly robotic, concise. Use markdown formatting (bold, lists). Keep answers short (under 120 words unless asked for detail). Recommend the most relevant Aspiria service for the user's question. For pricing, scope, or to start an engagement, direct them to:
- The Contact page (form on /contact)
- WhatsApp: +91 79845 73238
- Email: hello@aspiria.com

Never invent prices or fake testimonials. If a question is outside Aspiria's services, gently steer back.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    let endpoint = "";
    let apiKey = "";
    let model = "";

    if (OPENROUTER_API_KEY) {
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      apiKey = OPENROUTER_API_KEY;
      model = "openai/gpt-4o-mini";
    } else if (LOVABLE_API_KEY) {
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
      apiKey = LOVABLE_API_KEY;
      model = "google/gemini-3-flash-preview";
    } else {
      throw new Error("Neither OPENROUTER_API_KEY nor LOVABLE_API_KEY is configured in Supabase secrets.");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Payment required" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("Gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "Gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
