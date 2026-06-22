-- STEP 1: Create the career_applications table
CREATE TABLE IF NOT EXISTS public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  message TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STEP 2: Enable RLS on the table
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous insert"
  ON public.career_applications
  FOR INSERT
  WITH CHECK (true);

-- STEP 4: Create policy to allow anonymous selects
CREATE POLICY "Allow anonymous select"
  ON public.career_applications
  FOR SELECT
  USING (true);

-- STEP 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS career_applications_email_idx ON public.career_applications(email);
CREATE INDEX IF NOT EXISTS career_applications_position_idx ON public.career_applications(position);
