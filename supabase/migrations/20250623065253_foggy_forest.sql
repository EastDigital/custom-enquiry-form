/*
  # Fix OTP Verification Issues

  1. Database Functions
    - Fix OTP generation and verification functions
    - Ensure proper permissions for anonymous users
    - Add better error handling

  2. Security
    - Allow anonymous access to OTP functions
    - Fix session creation issues
*/

-- Drop and recreate the OTP generation function with better error handling
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
  
  -- Ensure admin user exists
  INSERT INTO public.admin_users (email, is_active) 
  VALUES (admin_email, true) 
  ON CONFLICT (email) DO UPDATE SET is_active = true
  RETURNING id INTO admin_id;
  
  -- If INSERT didn't return ID, get it with SELECT
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM public.admin_users WHERE email = admin_email;
  END IF;
  
  -- Clean up expired tokens
  DELETE FROM public.admin_otp_tokens 
  WHERE expires_at < NOW() OR used = true;
  
  -- Insert new OTP token
  INSERT INTO public.admin_otp_tokens (admin_user_id, token, expires_at, used)
  VALUES (admin_id, otp_token, NOW() + INTERVAL '10 minutes', false);
  
  RETURN otp_token;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'OTP generation failed: %', SQLERRM;
END;
$$;

-- Drop and recreate the OTP verification function with better error handling
CREATE OR REPLACE FUNCTION public.verify_admin_otp(admin_email TEXT, otp_token TEXT)
RETURNS TABLE(session_token TEXT, admin_user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id UUID;
  new_session_token TEXT;
  otp_record RECORD;
BEGIN
  -- First, find the admin user
  SELECT id INTO admin_id 
  FROM public.admin_users 
  WHERE email = admin_email AND is_active = true;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found or inactive: %', admin_email;
  END IF;
  
  -- Check if OTP exists and is valid
  SELECT * INTO otp_record
  FROM public.admin_otp_tokens 
  WHERE admin_user_id = admin_id 
    AND token = otp_token 
    AND expires_at > NOW() 
    AND used = false;
  
  IF otp_record IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired OTP for user: %', admin_email;
  END IF;
  
  -- Mark OTP as used
  UPDATE public.admin_otp_tokens 
  SET used = true, updated_at = NOW()
  WHERE id = otp_record.id;
  
  -- Generate session token
  new_session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Clean up old sessions for this admin
  DELETE FROM public.admin_sessions WHERE admin_user_id = admin_id;
  
  -- Create new admin session
  INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (admin_id, new_session_token, NOW() + INTERVAL '24 hours');
  
  -- Update last login
  UPDATE public.admin_users 
  SET last_login = NOW() 
  WHERE id = admin_id;
  
  RETURN QUERY SELECT new_session_token, admin_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'OTP verification failed: %', SQLERRM;
END;
$$;

-- Add updated_at column to admin_otp_tokens if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_otp_tokens' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.admin_otp_tokens ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Ensure all necessary permissions are granted
GRANT EXECUTE ON FUNCTION public.generate_admin_otp(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_admin_otp(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_admin_session(TEXT) TO anon, authenticated, service_role;

-- Grant table permissions
GRANT ALL ON public.admin_users TO anon, authenticated, service_role;
GRANT ALL ON public.admin_otp_tokens TO anon, authenticated, service_role;
GRANT ALL ON public.admin_sessions TO anon, authenticated, service_role;

-- Ensure sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;