-- Create contact_submissions table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null
);

-- Create newsletter_subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null unique
);

-- Enable RLS
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Create policies for anonymous insert
create policy "Allow anonymous insert"
on public.contact_submissions
for insert
with check (true);

create policy "Allow anonymous select"
on public.contact_submissions
for select
using (true);

create policy "Allow anonymous insert"
on public.newsletter_subscribers
for insert
with check (true);

create policy "Allow anonymous select"
on public.newsletter_subscribers
for select
using (true);

-- Create indexes for better query performance
create index if not exists contact_submissions_email_idx on public.contact_submissions(email);
create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers(email);
