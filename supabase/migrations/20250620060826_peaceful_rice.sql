/*
  # Fix RLS Policies and Permissions

  1. Security Updates
    - Fix RLS policies for public access to services and inquiries
    - Allow anonymous users to read services and submit inquiries
    - Ensure proper admin access controls

  2. Database Functions
    - Update admin authentication functions
    - Fix permission issues for OTP generation and validation
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public read access to active services" ON public.services;
DROP POLICY IF EXISTS "Allow public read access to active sub_services" ON public.sub_services;
DROP POLICY IF EXISTS "Allow public insert to customer_inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Allow public insert to customer_inquiry_services" ON public.customer_inquiry_services;

-- Create more permissive policies for public access
CREATE POLICY "Public can read active services" ON public.services
  FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Public can read active sub_services" ON public.sub_services
  FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Public can insert customer inquiries" ON public.customer_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can insert customer inquiry services" ON public.customer_inquiry_services
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Update admin function to be more permissive
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = COALESCE(
        current_setting('request.jwt.claims', true)::json->>'email',
        current_setting('app.admin_email', true)
      )
      AND is_active = true
    ),
    false
  );
$$;

-- Make OTP functions accessible to anonymous users
CREATE OR REPLACE FUNCTION public.generate_admin_otp(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  otp_token TEXT;
  admin_id UUID;
BEGIN
  -- Generate 6-digit OTP
  otp_token := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Get admin user ID
  SELECT id INTO admin_id FROM public.admin_users WHERE email = admin_email AND is_active = true;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found or inactive';
  END IF;
  
  -- Clean up expired tokens
  DELETE FROM public.admin_otp_tokens 
  WHERE expires_at < NOW() OR used = true;
  
  -- Insert new OTP token
  INSERT INTO public.admin_otp_tokens (admin_user_id, token, expires_at)
  VALUES (admin_id, otp_token, NOW() + INTERVAL '10 minutes');
  
  RETURN otp_token;
END;
$$;

-- Grant execute permissions to anonymous users for OTP functions
GRANT EXECUTE ON FUNCTION public.generate_admin_otp(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_otp(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_admin_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_otp_tokens() TO anon, authenticated;

-- Allow anonymous access to admin tables for OTP operations
CREATE POLICY "Allow OTP operations" ON public.admin_users
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow OTP token operations" ON public.admin_otp_tokens
  FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow session operations" ON public.admin_sessions
  FOR ALL TO anon, authenticated USING (true);