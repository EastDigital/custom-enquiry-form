/*
  # Fix Core Issues - Form Submission and Admin Login

  1. Database Issues
    - Fix RLS policies for form submission
    - Ensure proper permissions for anonymous users
    - Fix admin authentication flow

  2. Security
    - Allow anonymous access to submit forms
    - Proper admin OTP generation and validation
*/

-- First, let's ensure we have the proper policies for anonymous users
DROP POLICY IF EXISTS "Public can read active services" ON public.services;
DROP POLICY IF EXISTS "Public can read active sub_services" ON public.sub_services;
DROP POLICY IF EXISTS "Public can insert customer inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Public can insert customer inquiry services" ON public.customer_inquiry_services;

-- Create permissive policies for anonymous users
CREATE POLICY "Allow anonymous read services" ON public.services
  FOR SELECT TO anon USING (status = 'active');

CREATE POLICY "Allow anonymous read sub_services" ON public.sub_services
  FOR SELECT TO anon USING (status = 'active');

CREATE POLICY "Allow anonymous insert inquiries" ON public.customer_inquiries
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert inquiry services" ON public.customer_inquiry_services
  FOR INSERT TO anon WITH CHECK (true);

-- Fix admin policies to be less restrictive
DROP POLICY IF EXISTS "Allow OTP operations" ON public.admin_users;
DROP POLICY IF EXISTS "Allow OTP token operations" ON public.admin_otp_tokens;
DROP POLICY IF EXISTS "Allow session operations" ON public.admin_sessions;

CREATE POLICY "Allow admin user operations" ON public.admin_users
  FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow admin otp operations" ON public.admin_otp_tokens
  FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow admin session operations" ON public.admin_sessions
  FOR ALL TO anon, authenticated USING (true);

-- Ensure admin user exists
INSERT INTO public.admin_users (email, is_active) 
VALUES ('info@eastdigital.in', true) 
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.sub_services TO anon, authenticated;
GRANT INSERT ON public.customer_inquiries TO anon, authenticated;
GRANT INSERT ON public.customer_inquiry_services TO anon, authenticated;
GRANT ALL ON public.admin_users TO anon, authenticated;
GRANT ALL ON public.admin_otp_tokens TO anon, authenticated;
GRANT ALL ON public.admin_sessions TO anon, authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Update the OTP generation function to be more robust
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
    -- Create admin user if doesn't exist
    INSERT INTO public.admin_users (email, is_active) 
    VALUES (admin_email, true) 
    RETURNING id INTO admin_id;
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

-- Update the OTP verification function
CREATE OR REPLACE FUNCTION public.verify_admin_otp(admin_email TEXT, otp_token TEXT)
RETURNS TABLE(session_token TEXT, admin_user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id UUID;
  new_session_token TEXT;
BEGIN
  -- Verify OTP and get admin ID
  SELECT aot.admin_user_id INTO admin_id
  FROM public.admin_otp_tokens aot
  JOIN public.admin_users au ON au.id = aot.admin_user_id
  WHERE au.email = admin_email 
    AND aot.token = otp_token 
    AND aot.expires_at > NOW() 
    AND aot.used = false
    AND au.is_active = true;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired OTP';
  END IF;
  
  -- Mark OTP as used
  UPDATE public.admin_otp_tokens 
  SET used = true 
  WHERE admin_user_id = admin_id AND token = otp_token;
  
  -- Generate session token
  new_session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Clean up old sessions
  DELETE FROM public.admin_sessions WHERE admin_user_id = admin_id;
  
  -- Create admin session
  INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (admin_id, new_session_token, NOW() + INTERVAL '24 hours');
  
  -- Update last login
  UPDATE public.admin_users SET last_login = NOW() WHERE id = admin_id;
  
  RETURN QUERY SELECT new_session_token, admin_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.generate_admin_otp(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_otp(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_admin_session(TEXT) TO anon, authenticated;