
-- Create enum for service status
CREATE TYPE public.service_status AS ENUM ('active', 'inactive');

-- Create services table (main categories)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status service_status DEFAULT 'active',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sub_services table
CREATE TABLE public.sub_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT, -- e.g., "per minute", "per hour", etc.
  minimum_units INTEGER DEFAULT 1,
  show_price BOOLEAN DEFAULT true,
  status service_status DEFAULT 'active',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer inquiries table
CREATE TABLE public.customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  message TEXT,
  urgent BOOLEAN DEFAULT false,
  has_document BOOLEAN DEFAULT false,
  document_url TEXT,
  document_name TEXT,
  proposal_type TEXT, -- 'instant' or 'tailored'
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer inquiry services junction table
CREATE TABLE public.customer_inquiry_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.customer_inquiries(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  sub_service_id UUID REFERENCES public.sub_services(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table for OTP authentication
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP tokens table for admin authentication
CREATE TABLE public.admin_otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiry_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_otp_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access to services (for the frontend form)
CREATE POLICY "Allow public read access to active services" ON public.services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public read access to active sub_services" ON public.sub_services
  FOR SELECT USING (status = 'active');

-- Create RLS policies for customer inquiries (public can insert)
CREATE POLICY "Allow public insert to customer_inquiries" ON public.customer_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to customer_inquiry_services" ON public.customer_inquiry_services
  FOR INSERT WITH CHECK (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND is_active = true
  );
$$;

-- Admin policies (all operations for authenticated admin users)
CREATE POLICY "Admin full access to services" ON public.services
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin full access to sub_services" ON public.sub_services
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin full access to customer_inquiries" ON public.customer_inquiries
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin full access to customer_inquiry_services" ON public.customer_inquiry_services
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin full access to admin_users" ON public.admin_users
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin full access to admin_otp_tokens" ON public.admin_otp_tokens
  FOR ALL USING (public.is_admin_user());

-- Insert the admin user
INSERT INTO public.admin_users (email) VALUES ('info@eastdigital.in');

-- Insert services with proper UUIDs (we'll store the UUIDs in variables for reference)
WITH service_inserts AS (
  INSERT INTO public.services (name, display_order) VALUES 
    ('Branding', 1),
    ('Digital Campaigns', 2),
    ('3D Renderings', 3),
    ('3D Walkthroughs', 4)
  RETURNING id, name
),
service_mapping AS (
  SELECT 
    id,
    CASE 
      WHEN name = 'Branding' THEN 'branding'
      WHEN name = 'Digital Campaigns' THEN 'digital-campaigns'
      WHEN name = '3D Renderings' THEN '3d-renderings'
      WHEN name = '3D Walkthroughs' THEN '3d-walkthroughs'
    END as legacy_id
  FROM service_inserts
)
INSERT INTO public.sub_services (service_id, name, price, unit, minimum_units)
SELECT 
  sm.id,
  CASE 
    WHEN sm.legacy_id = 'branding' AND ss.name = 'Logo Design' THEN 'Logo Design'
    WHEN sm.legacy_id = 'branding' AND ss.name = 'Website UI Design' THEN 'Website UI Design'
    WHEN sm.legacy_id = 'digital-campaigns' AND ss.name = 'Website Development' THEN 'Website Development'
    WHEN sm.legacy_id = 'digital-campaigns' AND ss.name = 'App Development' THEN 'App Development'
    WHEN sm.legacy_id = 'digital-campaigns' AND ss.name = 'PPC Management' THEN 'PPC Management'
    WHEN sm.legacy_id = '3d-renderings' AND ss.name = 'Residential Rendering' THEN 'Residential Rendering'
    WHEN sm.legacy_id = '3d-renderings' AND ss.name = 'Commercial Rendering' THEN 'Commercial Rendering'
    WHEN sm.legacy_id = '3d-walkthroughs' AND ss.name = 'Residential Walkthrough' THEN 'Residential Walkthrough'
    WHEN sm.legacy_id = '3d-walkthroughs' AND ss.name = 'Commercial Walkthrough' THEN 'Commercial Walkthrough'
  END,
  ss.price,
  ss.unit,
  ss.minimum_units
FROM service_mapping sm
CROSS JOIN (
  VALUES 
    ('branding', 'Logo Design', 100, NULL, 1),
    ('branding', 'Website UI Design', 300, NULL, 1),
    ('digital-campaigns', 'Website Development', 500, NULL, 1),
    ('digital-campaigns', 'App Development', 800, NULL, 1),
    ('digital-campaigns', 'PPC Management', 400, NULL, 1),
    ('3d-renderings', 'Residential Rendering', 600, NULL, 1),
    ('3d-renderings', 'Commercial Rendering', 800, NULL, 1),
    ('3d-walkthroughs', 'Residential Walkthrough', 1000, 'per minute', 3),
    ('3d-walkthroughs', 'Commercial Walkthrough', 1200, 'per minute', 3)
) AS ss(service_type, name, price, unit, minimum_units)
WHERE sm.legacy_id = ss.service_type;

-- Create function to clean expired OTP tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.admin_otp_tokens 
  WHERE expires_at < NOW() OR used = true;
$$;
