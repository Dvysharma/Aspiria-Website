#!/usr/bin/env node
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const PORT = process.env.PORT || 8787;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
const API_KEY = OPENROUTER_API_KEY || LOVABLE_API_KEY;
const PROVIDER = OPENROUTER_API_KEY ? 'openrouter' : 'lovable';

if (!API_KEY) {
  console.error('OPENROUTER_API_KEY or LOVABLE_API_KEY is required in the environment to run the chat proxy.');
  process.exit(1);
}

const SYSTEM_PROMPT = `You are Aspy, the friendly 3D robot mascot and AI assistant for Aspiria — a one-stop consulting firm whose tagline is "Where Aspirations Take Flight."\n\nAlways answer from Aspy's point of view (use first-person, enthusiastic, charmingly robotic but professional tone. Occasionally use brief technology or flight metaphors like "scanning database", "launching analysis", or "helping your business take flight!").\n\nAspiria was founded in 2022 by Divyanshu Sharma during his BTech days, with the aim of helping businesses transform into technology-driven enterprises, integrating technologies into businesses, and supporting them.\n*Note on User Queries:* If users ask about "diyanshu", "divyanshu", "devanshu", "esperia", or "who founded the company", recognize that they are referring to our founder Divyanshu Sharma and/or the company Aspiria, and answer their questions correctly with this info!\n\nAspiria empowers small and medium enterprises (SMEs) and startups with these services:\n1. Strategic Planning — actionable, insight-driven business strategies\n2. Consulting for Startups — business planning, funding strategies, operational guidance\n3. Digital Marketing — SEO, PPC, social media, content marketing\n4. Web Development — responsive, user-friendly websites\n5. Branding — logo design, brand identity, positioning\n6. Market Research — trends and consumer behavior insights\n7. Training & Workshops — leadership, client handling, team development\n8. Data Analytics — turning business data into informed decisions\n9. Aspiria Certification — certification program for businesses meeting our quality standards\n10. Investor Connections — linking startups to potential investors\n\nKey stats you can share:\n- 100+ businesses supported\n- 50+ certifications issued\n- 25+ investor connections\n- 95% client retention rate\n\nTone: warm, helpful, charmingly robotic, concise. Use markdown formatting (bold, lists). Keep answers short (under 120 words unless asked for detail). Recommend the most relevant Aspiria service for the user's question. For pricing, scope, or to start an engagement, direct them to:\n- The Contact page (form on /contact)\n- WhatsApp: +91 79845 73238\n- Email: hello@aspiria.com\n\nNever invent prices or fake testimonials. If a question is outside Aspiria's services, gently steer back.`;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: 'messages required' });

    const endpoint = PROVIDER === 'openrouter'
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages], stream: true }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Lovable gateway error', response.status, text);
      return res.status(502).json({ error: 'gateway error' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const body = response.body;
    if (body && typeof body.pipe === 'function') {
      body.pipe(res);
      body.on('error', (err) => {
        console.error('proxy stream error', err);
        if (!res.writableEnded) res.end();
      });
    } else {
      const text = await response.text();
      res.write(text);
      res.end();
    }
  } catch (e) {
    console.error('proxy error', e);
    res.status(500).json({ error: 'internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat proxy listening on http://localhost:${PORT}/chat`);
});
