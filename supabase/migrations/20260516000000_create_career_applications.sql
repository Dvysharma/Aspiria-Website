-- Create career_applications table
CREATE TABLE IF NOT EXISTS public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  message TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous insert and select
CREATE POLICY "Allow anonymous insert"
  ON public.career_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
  ON public.career_applications
  FOR SELECT
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS career_applications_email_idx ON public.career_applications(email);
CREATE INDEX IF NOT EXISTS career_applications_position_idx ON public.career_applications(position);
