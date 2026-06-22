# Run the Project Again

If you restart this laptop and want to run the website again on the same machine, follow these steps.

## 1. Open the project folder

Open a terminal in:

```bash
c:\Users\delld\OneDrive\Documents\Desktop\aspire-to-flight-site-main\aspire-to-flight-site-main
```

> Make sure you are in the inner folder that contains `package.json`.

## 2. Install dependencies (only if needed)

If `node_modules/` still exists, skip this step.

```bash
npm install
```

## 3. Start the frontend

```bash
npm run dev
```

Then open the site in your browser at the local URL shown by Vite.

## 4. Start the chat proxy (only if you use it locally)

If your setup uses the local chat proxy instead of Supabase functions, open a second terminal and run:

```bash
npm run chat:proxy
```

## 5. Environment variables

The chat and Supabase features require env variables to be available:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_CHAT_PROXY_URL` (optional)
- `OPENROUTER_API_KEY` or `LOVABLE_API_KEY` (for local proxy)
- `LOVABLE_API_KEY` (if using the Supabase Edge Function)

If these are already set in `.env.local`, you do not need to change anything.

## Notes

- On the same machine, you generally do not need to reinstall dependencies each time.
- If the project was moved, cloned fresh, or `node_modules/` was deleted, run `npm install` first.
