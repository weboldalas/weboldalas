-- Contracts table
CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  offer_id uuid REFERENCES offers(id) ON DELETE SET NULL,
  template_id text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  pdf_url text,
  generated_at timestamptz,
  signed_at timestamptz,
  notes text
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can do all on contracts"
  ON contracts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket for contract PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload contracts"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "Authenticated users can read contracts"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contracts');

CREATE POLICY "Authenticated users can delete contracts"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'contracts');
