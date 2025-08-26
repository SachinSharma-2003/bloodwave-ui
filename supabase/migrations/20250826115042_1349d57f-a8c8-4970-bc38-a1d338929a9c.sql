-- Create enum types
CREATE TYPE public.user_role AS ENUM ('donor', 'hospital');
CREATE TYPE public.request_status AS ENUM ('open', 'fulfilled', 'cancelled');
CREATE TYPE public.blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  blood_group blood_group_type NOT NULL,
  city TEXT NOT NULL,
  last_donated DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on donors
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Create requests table
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blood_group blood_group_type NOT NULL,
  city TEXT NOT NULL,
  units_required INTEGER NOT NULL CHECK (units_required > 0),
  units_fulfilled INTEGER NOT NULL DEFAULT 0 CHECK (units_fulfilled >= 0),
  status request_status NOT NULL DEFAULT 'open',
  urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  description TEXT,
  hospital_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on requests
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create pledges table
CREATE TABLE public.pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donors(user_id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  units_pledged INTEGER NOT NULL CHECK (units_pledged > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure a donor can only pledge once per request
  UNIQUE(request_id, donor_id)
);

-- Enable RLS on pledges
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- Create function to check if donor is available (90 days since last donation)
CREATE OR REPLACE FUNCTION public.is_donor_available(last_donation_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN last_donation_date IS NULL OR last_donation_date <= CURRENT_DATE - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view for donors with availability status
CREATE VIEW public.donors_with_availability AS
SELECT 
  d.*,
  p.name,
  p.phone,
  public.is_donor_available(d.last_donated) as is_available
FROM public.donors d
JOIN public.profiles p ON d.user_id = p.user_id;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for donors
CREATE POLICY "Anyone can view available donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Users can update their own donor profile" ON public.donors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own donor profile" ON public.donors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for requests
CREATE POLICY "Anyone can view open requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Hospitals can create requests" ON public.requests FOR INSERT WITH CHECK (auth.uid() = hospital_id);
CREATE POLICY "Hospitals can update their own requests" ON public.requests FOR UPDATE USING (auth.uid() = hospital_id);

-- Create RLS policies for pledges
CREATE POLICY "Anyone can view pledges" ON public.pledges FOR SELECT USING (true);
CREATE POLICY "Donors can create pledges" ON public.pledges FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update their own pledges" ON public.pledges FOR UPDATE USING (auth.uid() = donor_id);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pledges_updated_at
  BEFORE UPDATE ON public.pledges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update request fulfillment status
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
$$ LANGUAGE plpgsql;

-- Create trigger for automatic request fulfillment
CREATE TRIGGER update_request_fulfillment_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pledges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_request_fulfillment();