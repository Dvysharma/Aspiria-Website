-- Add anonymous insert and select policies for Supabase tables

alter table public.contact_submissions enable row level security;
create policy if not exists "Allow anonymous insert" 
  on public.contact_submissions 
  for insert 
  with check (true);
create policy if not exists "Allow anonymous select" 
  on public.contact_submissions 
  for select 
  using (true);

alter table public.newsletter_subscribers enable row level security;
create policy if not exists "Allow anonymous insert" 
  on public.newsletter_subscribers 
  for insert 
  with check (true);
create policy if not exists "Allow anonymous select" 
  on public.newsletter_subscribers 
  for select 
  using (true);
