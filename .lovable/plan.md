## Aspiria — "Where Aspirations Take Flight"

A premium, modern multi-page website for your consulting firm with light/dark mode, smooth animations, and a working backend.

### Design system
- **Palette**: Royal blue primary (#1E3A8A family) with subtle gradients to a lighter sky tone, white surfaces, and elegant grays. Dark mode uses deep navy backgrounds with the same royal-blue accents.
- **Typography**: Clean modern sans (Inter for body, a display sans for headlines).
- **Motion**: Subtle fade-ins on scroll, parallax on hero, hover lifts on cards, animated counters, smooth section transitions. Nothing flashy — premium and restrained.
- **Light/dark toggle** in the navbar, persisted in localStorage, system preference as default.

### Pages & navigation
A sticky top nav (logo "Aspiria" + tagline, links, theme toggle, "Book Consultation" CTA) and a rich footer (quick links, social handles, privacy policy, newsletter signup) on every page.

1. **Home** — Parallax hero with animated tagline, dual CTAs (Get Started / Book Consultation), animated service icons grid, mini "Why Aspiria" strip, testimonials carousel, newsletter band, final CTA.
2. **About Us** — Company story, mission/vision cards, values grid, team/leadership placeholder section with hover effects.
3. **Services** — 10 animated service cards (Strategic Planning, Startup Consulting, Digital Marketing, Web Development, Branding, Market Research, Training & Workshops, Data Analytics, Aspiria Certification, Investor Connections), each with icon, short description, and hover reveal of key offerings.
4. **Why Choose Us** — Differentiators, animated counters (+100 Businesses Supported, +50 Certifications Issued, +25 Investor Connections, 95% Client Retention — adjustable), process timeline, comparison highlights.
5. **Contact** — Phone +91 7984573238 (click-to-call), email, validated contact form, embedded Google Maps iframe (no API key), and WhatsApp quick-link. Closing CTA: "Let's Turn Your Aspirations Into Reality."
6. **Privacy Policy** — Standard policy page linked from footer.
7. **404** — Branded not-found page.

### Backend (Lovable Cloud)
- **`contact_submissions` table** — every form entry stored with name, email, phone, service interest, message, timestamp. RLS locks reads to admins; inserts open to public.
- **`newsletter_subscribers` table** — email + timestamp, with duplicate protection.
- **Email notifications** — on form submission, an edge function emails you instantly at an address you'll provide (I'll prompt for it and set up Lovable Email infrastructure when we get there). Submissions are also saved to the database as a backup.
- Testimonials remain hardcoded sample content (3–4 polished quotes) that you can edit later.

### Instant chat (both options)
- **Floating WhatsApp button** (bottom-right) deep-linking to +91 7984573238 with a pre-filled greeting.
- **AI chatbot widget** (bottom-right, separate launcher) powered by Lovable AI. It's pre-prompted as the "Aspiria Assistant" — it knows your services, tone, and pricing approach, and can answer SME/startup questions, suggest the right service, and direct visitors to the contact form or WhatsApp for follow-up. Streaming responses, markdown rendering, conversation kept in-session.

### Quality, SEO & accessibility
- Per-page meta tags (title, description, canonical, Open Graph) and JSON-LD `Organization` + `LocalBusiness` schema.
- Semantic HTML, keyboard-navigable, focus rings, sufficient color contrast in both themes, alt text on all imagery.
- Lazy-loaded images, code-split routes, optimized fonts.
- **Google Analytics 4** wired in — you'll provide the GA4 Measurement ID and I'll plug it into `index.html`.
- Responsive layouts tuned for mobile, tablet, and desktop.

### After approval, I'll ask you for
1. The email address that should receive contact form submissions.
2. Your GA4 Measurement ID (optional — can be added later).
3. Any social media handles you want in the footer (LinkedIn, Instagram, X, Facebook, YouTube).
4. Office address for the Google Maps embed.

You can also send these now if you'd like; otherwise I'll proceed with sensible placeholders you can swap.