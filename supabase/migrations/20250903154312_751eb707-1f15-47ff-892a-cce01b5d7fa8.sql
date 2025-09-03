-- Create view for pledges with details (joining pledges with requests and donors)
CREATE OR REPLACE VIEW pledges_with_details AS
SELECT 
  p.id,
  p.units_pledged,
  p.status::text as status,
  p.created_at,
  -- We'll use placeholder values since we don't have donor names in current schema
  COALESCE(d.name, 'Anonymous Donor') as donor_name,
  COALESCE(d.phone, 'N/A') as donor_phone,
  r.blood_group::text as request_blood_group,
  r.hospital_name as request_hospital_name,
  r.city as request_city
FROM pledges p
LEFT JOIN requests r ON p.request_id = r.id
LEFT JOIN donors d ON p.donor_id = d.id;

-- Add missing columns to donors table for registration
ALTER TABLE donors ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS email text;

-- Update donors table constraints
ALTER TABLE donors ALTER COLUMN name SET NOT NULL;
ALTER TABLE donors ALTER COLUMN email SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pledges_request_id ON pledges(request_id);
CREATE INDEX IF NOT EXISTS idx_pledges_donor_id ON pledges(donor_id);