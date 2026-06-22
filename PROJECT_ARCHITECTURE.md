# Aspiria Website — Project Architecture

## Overview
This project is a Vite-powered React + TypeScript website built with Tailwind CSS and shadcn/ui-style components. It includes a marketing site with pages for Home, About, Services, Why Us, Contact, and Privacy. It also contains a chat assistant integration backed by a Supabase Edge Function or a local Express chat proxy.

## Root Files and Folders

### `package.json`
- Defines npm scripts, dependencies, and dev dependencies.
- Key scripts:
  - `dev`: starts the Vite dev server
  - `build`: bundles the app for production
  - `preview`: serves the production build locally
  - `test`: runs Vitest tests
  - `supabase:push`: pushes Supabase project changes via PowerShell script
  - `chat:proxy`: starts the local chat proxy server

### `vite.config.ts`
- Configures Vite for React with SWC.
- Defines build and development behavior.

### `tailwind.config.ts`
- Tailwind CSS configuration.
- Controls theme, custom colors, and utility classes.

### `postcss.config.js`
- PostCSS setup for Tailwind CSS.

### `index.html`
- The app shell HTML that mounts the React app into `<div id="root"></div>`.
- Includes metadata and title tags.

### `README.md`
- Project documentation entry point.
- Currently a placeholder but can be extended with setup and deployment instructions.

### `.env.local.example`
- Example environment variable file.
- Used to document the expected runtime variables for Supabase and the chat proxy.

### `public/`
- Static assets that are copied as-is to the build output.
- Contains files like `robots.txt`.

## `src/`
This is the main application source code.

### `src/main.tsx`
- Bootstraps the React application.
- Imports global styles from `src/index.css`.
- Renders the `<App />` component into the root DOM node.

### `src/App.tsx`
- Sets up application-wide providers and routing.
- Providers:
  - `QueryClientProvider` from React Query
  - `ThemeProvider` for theme state
  - `TooltipProvider` for Radix tooltip support
  - `Toaster` and `Sonner` for toast notifications
- Uses `BrowserRouter` and `Routes` from React Router DOM to render pages.

### `src/components/`
Contains reusable React components that compose the page layout and UI.

- `Layout.tsx`
  - Global page wrapper used by every screen.
  - Includes `Navbar`, `Footer`, `WhatsAppButton`, and `ChatBot`.

- `Navbar.tsx`
  - Top navigation bar with links to all main pages.
  - Supports mobile menu toggle and scroll style changes.
  - Uses theme and iconography from `lucide-react`.

- `Footer.tsx`
  - Site footer content with navigation, contact details, and newsletter form.

- `Hero3D.tsx`
  - 3D visual hero component built using `@react-three/fiber` and `@react-three/drei`.
  - Adds a premium animated section to the homepage.

- `ChatBot.tsx`
  - Chat assistant widget.
  - Supports opening/closing, message streaming, and a small conversation UI.
  - Sends chat payloads to a proxy URL or Supabase function based on environment variables.

- `NavLink.tsx`
  - Likely a small wrapper around React Router links, but not essential for architecture.

- `WhatsAppButton.tsx`
  - Floating WhatsApp contact button.
  - Provides quick lead capture / chat contact.

### `src/components/ui/`
A library of shared UI primitives and wrappers.
- This folder contains components such as `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `toast.ts`, `tooltip.ts`, and many others.
- These are most likely built from the `shadcn/ui` pattern and provide consistent styling and accessibility for the app.

### `src/pages/`
Contains the top-level site pages.
Each page imports `Layout` and page-specific content.

- `Home.tsx`
  - Main landing page.
  - Includes hero section, service cards, value proposition, testimonials, and CTA.
  - Uses `useSEO` for meta tags and `useReveal` for scroll animation.

- `About.tsx`
  - Company/about page.
  - Likely describes Aspiria’s mission and team.

- `Services.tsx`
  - Full services listing page.
  - Likely renders data from `src/data/services.ts`.

- `WhyUs.tsx`
  - Page explaining why the company is a strong choice.

- `Contact.tsx`
  - Contact page with a form or direct contact details.

- `Privacy.tsx`
  - Privacy policy page.

- `NotFound.tsx`
  - 404 fallback page when a URL does not match any route.

- `Index.tsx`
  - Possibly a helper export or alternate route entry.

### `src/data/`
Contains structured content used by pages.
- `services.ts`
  - Defines the list of Aspiria service offerings and their icons.
  - Used to render the services section on the homepage and services page.

### `src/hooks/`
Custom React hooks for UI behavior and metadata.

- `useTheme.tsx`
  - Provides theme state for the app.
  - Currently forces `dark` mode and persists it in localStorage.

- `useSEO.tsx`
  - Sets page title, description, canonical URL, and metadata.
  - Used on each page to improve SEO and social sharing.

- `useReveal.tsx`
  - Adds scroll-based reveal animations for page elements.

- `useCountUp.tsx`
  - Likely provides animated counting numbers for stats.

- `use-mobile.tsx`
  - Detects mobile layout or touch device state.

- `use-toast.ts`
  - Custom toast helper for the notification system.

### `src/integrations/`
Integration adapters for external services.

- `supabase/client.ts`
  - Creates a typed Supabase client with `@supabase/supabase-js`.
  - Pulls `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from environment variables.
  - Configures auth storage and session persistence.

- `supabase/types.ts`
  - Generated Supabase type definitions for the database schema.

### `src/lib/`
Utility helpers used throughout the app.

- `utils.ts`
  - Contains `cn()` helper for conditional class names using `clsx` + `tailwind-merge`.

### `src/test/`
- Contains test setup and example tests.
- `setup.ts` is likely the Vitest or test-library setup.

## `server/`
Contains a local backend proxy for the chat assistant.

- `chat-proxy.js`
  - Express server that forwards chat requests to an AI provider.
  - Supports `OPENROUTER_API_KEY` or `LOVABLE_API_KEY` environment variables.
  - Adds a system prompt for the Aspiria Assistant persona.
  - Streams responses back to the browser.

## `scripts/`
Utility and automation scripts.

- `run-supabase-push.ps1`
  - PowerShell script to push Supabase configuration and database changes.
  - Likely runs the Supabase CLI with local project config.

- `test-supabase.js`
  - A helper script for validating or testing Supabase behavior.

## `supabase/`
Contains Supabase project configuration, functions, and database migrations.

- `config.toml`
  - Supabase project configuration.

- `functions/chat/index.ts`
  - Supabase Edge Function for chat.
  - Accepts POST requests from the frontend.
  - Forwards requests to a Lovable AI gateway.
  - Streams the response back to the client.

- `migrations/`
  - SQL migration files for database schema and policies.
  - `create_tables.sql`: defines tables used by Supabase.
  - `add_read_policies.sql`: adds read access policies for authenticated/public data.

## Environment Variables
The project depends on the following environment keys:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_CHAT_PROXY_URL` (optional, if using local proxy instead of Supabase function)
- `OPENROUTER_API_KEY` or `LOVABLE_API_KEY` (for `server/chat-proxy.js`)
- `LOVABLE_API_KEY` (for Supabase Edge Function)

## How It Runs

### Local development
1. Install dependencies: `npm install`
2. Start Vite: `npm run dev`
3. Optional chat proxy: `npm run chat:proxy`
4. Optional Supabase push: `npm run supabase:push`

### Restarting after shutdown
1. Open terminal in the project root:
   `c:\Users\delld\OneDrive\Documents\Desktop\aspire-to-flight-site-main\aspire-to-flight-site-main`
2. If `node_modules/` already exists, run:
   `npm run dev`
3. If you cloned the repo fresh or `node_modules/` is missing, run:
   `npm install`
   then `npm run dev`
4. If you use the local chat proxy, start it in a separate terminal:
   `npm run chat:proxy`

### Chat and Supabase setup notes
- The website will load without extra work if the dependencies are installed and env vars are configured.
- The chat bot requires either:
  - the Supabase Edge Function setup with `LOVABLE_API_KEY`, or
  - the local proxy server with `OPENROUTER_API_KEY` or `LOVABLE_API_KEY`.
- The frontend uses these variables to connect:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_CHAT_PROXY_URL` (optional)
- If you use the local proxy, you must start it manually each time with `npm run chat:proxy`.
- If you depend on Supabase functions, make sure the project still has valid Supabase config and the env vars are set.

### Application flow
- `src/main.tsx` renders `App`.
- `App.tsx` wraps routes with providers and renders pages.
- Pages use `Layout` to add the navbar, footer, WhatsApp button, and chat widget.
- `ChatBot.tsx` calls the chat backend via the configured proxy or Supabase function.
- `services.ts` holds the structured service list used by homepage and services pages.

## Technology Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-style component primitives
- React Router DOM
- React Query
- Radix UI / Tooltip and UI primitives
- Supabase for backend integration and Edge Functions
- Optional Express chat proxy for AI chat streaming
- `lucide-react` for icons
- `@react-three/fiber` and `@react-three/drei` for hero 3D section

## Notes
- The project is largely static marketing content with a dynamic chat assistant.
- UI components in `src/components/ui/` are reusable primitives; they are best inspected as a library rather than individual feature files.
- The chat assistant can be run using a Supabase Edge Function or the local Express proxy depending on environment configuration.

---

This document is a folder-wise architecture summary of the Aspiria website. If you want, I can also generate a second version with a visual tree diagram or a more detailed file-by-file description.