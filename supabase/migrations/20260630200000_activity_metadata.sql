-- Add metadata jsonb column to document_activity for IP, browser, device, OS tracking
ALTER TABLE document_activity ADD COLUMN IF NOT EXISTS metadata jsonb;
