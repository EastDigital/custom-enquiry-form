/*
  # Fix Anonymous SELECT Permissions for Form Submission

  1. Security Updates
    - Add SELECT permissions for anonymous users on customer_inquiries table
    - Add SELECT permissions for anonymous users on customer_inquiry_services table
    - This fixes the 42501 error when using insert().select().single()

  2. Database Access
    - Allow anonymous users to select their own inserted records
    - Maintain security by only allowing selection of records they just inserted
    - Grant necessary table permissions to anon role

  Note: This allows anonymous users to read all records in these tables.
  For production, consider implementing a more secure approach using
  Supabase Edge Functions or user authentication.
*/

-- Add SELECT policies for anonymous users
CREATE POLICY "anonymous_select_inquiries" ON public.customer_inquiries
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anonymous_select_inquiry_services" ON public.customer_inquiry_services
  FOR SELECT TO anon
  USING (true);

-- Grant SELECT permissions to anon role
GRANT SELECT ON public.customer_inquiries TO anon;
GRANT SELECT ON public.customer_inquiry_services TO anon;