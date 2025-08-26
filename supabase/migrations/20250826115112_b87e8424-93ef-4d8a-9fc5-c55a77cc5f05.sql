-- Fix security issues from the linter

-- Drop the existing view and recreate without security definer
DROP VIEW public.donors_with_availability;

-- Recreate view without security definer (uses invoker's permissions)
CREATE VIEW public.donors_with_availability AS
SELECT 
  d.*,
  p.name,
  p.phone,
  public.is_donor_available(d.last_donated) as is_available
FROM public.donors d
JOIN public.profiles p ON d.user_id = p.user_id;

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.is_donor_available(last_donation_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN last_donation_date IS NULL OR last_donation_date <= CURRENT_DATE - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_request_fulfillment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update units_fulfilled when a pledge is inserted, updated, or deleted
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.requests 
    SET units_fulfilled = (
      SELECT COALESCE(SUM(units_pledged), 0) 
      FROM public.pledges 
      WHERE request_id = NEW.request_id AND status = 'confirmed'
    )
    WHERE id = NEW.request_id;
    
    -- Auto-fulfill request if units_fulfilled >= units_required
    UPDATE public.requests 
    SET status = 'fulfilled'
    WHERE id = NEW.request_id 
      AND units_fulfilled >= units_required 
      AND status = 'open';
      
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.requests 
    SET units_fulfilled = (
      SELECT COALESCE(SUM(units_pledged), 0) 
      FROM public.pledges 
      WHERE request_id = OLD.request_id AND status = 'confirmed'
    )
    WHERE id = OLD.request_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;