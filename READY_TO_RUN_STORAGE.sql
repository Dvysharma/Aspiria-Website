-- Enable RLS on storage.objects and allow public access for 'resumes' bucket
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT into storage.objects for files in the 'resumes' bucket
CREATE POLICY IF NOT EXISTS "resumes_public_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

-- Allow anonymous SELECT from storage.objects for files in the 'resumes' bucket
CREATE POLICY IF NOT EXISTS "resumes_public_select"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

-- Optionally allow DELETE (if you want public deletion - NOT recommended)
-- CREATE POLICY IF NOT EXISTS "resumes_public_delete"
--   ON storage.objects
--   FOR DELETE
--   USING (false);
