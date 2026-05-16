-- 1. Create a table for document metadata
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Storage
-- Go to Supabase Dashboard -> Storage
-- Create a new bucket named "documents"
-- Make sure to set the bucket to PUBLIC if you want easy access via Public URL
