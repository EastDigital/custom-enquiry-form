
-- Fix the ambiguous column reference in verify_admin_otp function
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
