-- Add offer sending fields
alter table offers
  add column if not exists public_token text unique,
  add column if not exists sent_at timestamp with time zone,
  add column if not exists responded_at timestamp with time zone,
  add column if not exists note text;

-- Index for fast token lookup
create index if not exists offers_public_token_idx on offers(public_token);

-- Allow public (anon) read access to offers by token — only specific columns via RLS
-- We handle this server-side with service role key, so no anon policy needed.
-- The public page uses server-side rendering with service role key.
