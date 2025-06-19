
-- Create admin authentication and session management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin session access
CREATE POLICY "Admin users can manage their own sessions" ON public.admin_sessions
  FOR ALL USING (admin_user_id IN (
    SELECT id FROM public.admin_users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_status ON public.customer_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_created_at ON public.customer_inquiries(created_at);

-- Create function to generate OTP
CREATE OR REPLACE FUNCTION public.generate_admin_otp(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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
  PERFORM public.cleanup_expired_otp_tokens();
  
  -- Insert new OTP token
  INSERT INTO public.admin_otp_tokens (admin_user_id, token, expires_at)
  VALUES (admin_id, otp_token, NOW() + INTERVAL '10 minutes');
  
  RETURN otp_token;
END;
$$;

-- Create function to verify OTP and create session
CREATE OR REPLACE FUNCTION public.verify_admin_otp(admin_email TEXT, otp_token TEXT)
RETURNS TABLE(session_token TEXT, admin_user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
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
  
  -- Create admin session
  INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (admin_id, new_session_token, NOW() + INTERVAL '24 hours');
  
  -- Update last login
  UPDATE public.admin_users SET last_login = NOW() WHERE id = admin_id;
  
  RETURN QUERY SELECT new_session_token, admin_id;
END;
$$;

-- Create function to validate admin session
CREATE OR REPLACE FUNCTION public.validate_admin_session(session_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT admin_user_id INTO admin_id
  FROM public.admin_sessions
  WHERE session_token = validate_admin_session.session_token
    AND expires_at > NOW();
  
  RETURN admin_id;
END;
$$;
