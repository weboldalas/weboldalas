-- 1. Add industry field to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS industry text;

-- 2. Update source to use standardized values (keep existing data)
-- source values: hideg_hivas, hirdetes, email, ajanlas, weboldal, egyeb

-- 3. New pipeline statuses:
-- hideg_hivas → erdeklodo → bemutato → ajanlat_kint → targyalas → nyert / elveszett
-- Migrate old statuses to new ones
UPDATE leads SET status = 'hideg_hivas' WHERE status = 'new';
UPDATE leads SET status = 'erdeklodo'   WHERE status = 'contacted';
UPDATE leads SET status = 'bemutato'    WHERE status = 'meeting';
-- 'won' → 'nyert', 'lost' → 'elveszett' (keep as-is for now, handled in UI)

-- 4. lead_notes table (call log / activity log per lead)
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL,
  type text DEFAULT 'note' NOT NULL, -- note | call | email | meeting
  outcome text, -- elerte | nem_vette_fel | visszahiv | nem_erdekli | kesobb
  next_action_date timestamp with time zone
);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to authenticated users on lead_notes"
  ON lead_notes FOR ALL TO authenticated USING (true);

CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX idx_lead_notes_created_at ON lead_notes(created_at DESC);
