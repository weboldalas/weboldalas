-- 1. Modify offers table: customer_id is no longer required (can be lead_id)
ALTER TABLE offers ALTER COLUMN customer_id DROP NOT NULL;

-- 2. Add lead_id to offers
ALTER TABLE offers ADD COLUMN lead_id uuid REFERENCES leads(id) ON DELETE CASCADE;

-- Ensure that either customer_id or lead_id is present
ALTER TABLE offers ADD CONSTRAINT offer_target_check CHECK (
  (customer_id IS NOT NULL AND lead_id IS NULL) OR 
  (customer_id IS NULL AND lead_id IS NOT NULL) OR
  (customer_id IS NOT NULL AND lead_id IS NOT NULL) -- During conversion, we might keep both
);

-- 3. Add payment options to offers
ALTER TABLE offers ADD COLUMN payment_type text DEFAULT 'one_time' NOT NULL;
ALTER TABLE offers ADD COLUMN installment_months integer;
ALTER TABLE offers ADD COLUMN subscription_plan_name text;

-- 4. Add realization tracking to offers
ALTER TABLE offers ADD COLUMN realized_at timestamp with time zone;
ALTER TABLE offers ADD COLUMN realized_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE offers ADD COLUMN is_realized boolean DEFAULT false NOT NULL;

-- 5. Add payment_type to payments if missing (Wait, it was added in previous migration, but we ensure values)
-- We use 'one_time', 'installment' values in our logic, so we can just store them in the existing payment_type column or a new one. The existing one is `payment_type text default 'egyéb' not null`. We can just use that.

-- Create index for lead_id
CREATE INDEX idx_offers_lead_id ON offers(lead_id);
