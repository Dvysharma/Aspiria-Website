sb_publishable_Z01wa8LBi9L8_BY_6C3Dpw_Tvibg4Gi
# Supabase Setup Instructions

If the contact form and newsletter submissions are not appearing in Supabase, follow these steps:

## Option 1: Manual Setup (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select project: `pmujkebyxcgspjdcbary`
3. Go to **SQL Editor**
4. Create a new query and paste the SQL from `supabase/migrations/create_tables.sql`
5. Run the query
6. Verify tables exist in **Table Editor**

## Option 2: Using Supabase CLI

```bash
# Install Supabase CLI via supported package manager or use the local CLI
npm install --save-dev @supabase/cli

# Set your Supabase access token before running commands
# (replace with your own token from Supabase Settings → API)
export SUPABASE_ACCESS_TOKEN="your_token_here"

# Link the project and push migrations
npx supabase link --project-ref pmujkebyxcgspjdcbary --yes
npx supabase db push
```

On Windows PowerShell:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "your_token_here"
npx supabase link --project-ref pmujkebyxcgspjdcbary --yes
npx supabase db push
```

Alternatively, save your CLI token in a local file named `.supabase_token` at the repository root and run the helper script:

```powershell
Set-Location .\scripts
.\run-supabase-push.ps1
```

If you do not have a CLI token, you can also apply the migration directly through the Supabase SQL editor using the SQL in `supabase/migrations/20260515103000_add_read_policies.sql`.

## Troubleshooting

- **401 Unauthorized**: The API key may be invalid. Go to Supabase Settings → API to regenerate keys.
- **404 Not Found**: Tables don't exist. Run the SQL migration above.
- **RLS Policy Error**: Ensure the policies allow anonymous insert and read:
  ```sql
  ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Allow anonymous insert" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow anonymous select" ON public.contact_submissions
  FOR SELECT USING (true);
  ```

## Required Tables

1. **contact_submissions**: name, email, phone, service, message
2. **newsletter_subscribers**: email (unique)

Both tables automatically get `id` (UUID primary key) and `created_at` timestamps.
