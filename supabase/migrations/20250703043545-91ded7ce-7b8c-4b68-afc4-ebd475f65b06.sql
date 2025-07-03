
-- Fix RLS policies and permissions for services visibility and form submission

-- First, ensure anonymous users can read services and sub_services
DROP POLICY IF EXISTS "Allow public read access to active services" ON public.services;
DROP POLICY IF EXISTS "Allow public read access to active sub_services" ON public.sub_services;

CREATE POLICY "Anonymous can read active services" ON public.services
  FOR SELECT TO anon
  USING (status = 'active'::service_status);

CREATE POLICY "Anonymous can read active sub_services" ON public.sub_services
  FOR SELECT TO anon
  USING (status = 'active'::service_status);

-- Fix customer inquiries policies for anonymous submission
DROP POLICY IF EXISTS "Allow public insert to customer_inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Allow public insert to customer_inquiry_services" ON public.customer_inquiry_services;

CREATE POLICY "Anonymous can insert inquiries" ON public.customer_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can insert inquiry services" ON public.customer_inquiry_services
  FOR INSERT TO anon
  WITH CHECK (true);

-- Add SELECT policies for anonymous users to read their submitted data
CREATE POLICY "Anonymous can select inquiries" ON public.customer_inquiries
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anonymous can select inquiry services" ON public.customer_inquiry_services
  FOR SELECT TO anon
  USING (true);

-- Fix admin authentication policies
DROP POLICY IF EXISTS "Admin full access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin full access to admin_otp_tokens" ON public.admin_otp_tokens;
DROP POLICY IF EXISTS "Admin users can manage their own sessions" ON public.admin_sessions;

-- Allow anonymous access for admin login operations
CREATE POLICY "Allow admin operations" ON public.admin_users
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow otp operations" ON public.admin_otp_tokens
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow session operations" ON public.admin_sessions
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary table permissions to anon role
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.sub_services TO anon;
GRANT INSERT, SELECT ON public.customer_inquiries TO anon;
GRANT INSERT, SELECT ON public.customer_inquiry_services TO anon;
GRANT ALL ON public.admin_users TO anon;
GRANT ALL ON public.admin_otp_tokens TO anon;
GRANT ALL ON public.admin_sessions TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Ensure the admin user exists
INSERT INTO public.admin_users (email, is_active) 
VALUES ('info@eastdigital.in', true) 
ON CONFLICT (email) DO UPDATE SET is_active = true;
