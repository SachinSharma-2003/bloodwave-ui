-- Fix security definer view issue by recreating without security definer
DROP VIEW IF EXISTS pledges_with_details;

-- Recreate the view without security definer (default is security invoker which is safer)
CREATE VIEW pledges_with_details AS
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