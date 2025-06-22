/*
  # Fix RLS Policies for Anonymous Form Submission

  1. Security Updates
    - Drop and recreate RLS policies to allow anonymous form submission
    - Fix the 42501 error (row-level security policy violation)
    - Ensure proper permissions for anonymous users

  2. Database Access
    - Allow anonymous users to insert customer inquiries
    - Allow anonymous users to insert customer inquiry services
    - Maintain security while enabling form functionality
*/

-- Disable RLS temporarily to fix policies
ALTER TABLE public.customer_inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiry_services DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for these tables
DROP POLICY IF EXISTS "Allow anonymous insert inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Allow anonymous insert inquiry services" ON public.customer_inquiry_services;
DROP POLICY IF EXISTS "Public can insert customer inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Public can insert customer inquiry services" ON public.customer_inquiry_services;
DROP POLICY IF EXISTS "Allow public insert to customer_inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Allow public insert to customer_inquiry_services" ON public.customer_inquiry_services;

-- Re-enable RLS
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiry_services ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for anonymous users
CREATE POLICY "anonymous_insert_inquiries" ON public.customer_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anonymous_insert_inquiry_services" ON public.customer_inquiry_services
  FOR INSERT TO anon
  WITH CHECK (true);

-- Also allow authenticated users (just in case)
CREATE POLICY "authenticated_insert_inquiries" ON public.customer_inquiries
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_insert_inquiry_services" ON public.customer_inquiry_services
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Ensure admin users can read/update these tables
CREATE POLICY "admin_full_access_inquiries" ON public.customer_inquiries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_sessions 
      WHERE session_token = current_setting('request.headers', true)::json->>'authorization'
    )
  );

CREATE POLICY "admin_full_access_inquiry_services" ON public.customer_inquiry_services
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_sessions 
      WHERE session_token = current_setting('request.headers', true)::json->>'authorization'
    )
  );

-- Grant explicit table permissions to anon role
GRANT INSERT ON public.customer_inquiries TO anon;
GRANT INSERT ON public.customer_inquiry_services TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Ensure the anon role has the necessary permissions
GRANT USAGE ON SCHEMA public TO anon;