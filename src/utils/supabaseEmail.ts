
import { createClient } from '@supabase/supabase-js';
import { CustomerFormData } from '@/types/form';
import { generateCustomerEmailHTML, generateAdminEmailHTML } from './emailTemplates';
import { toast } from "sonner";

// Create a Supabase client with public keys
const supabaseUrl = "https://nggouhjmaewijuqpxwdv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZ291aGptYWV3aWp1cXB4d2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzI5NzYsImV4cCI6MjA2MTUwODk3Nn0.MF9MDknLJmPyZ6WnwurlVeBU9duyM-qI_QpqXCKhKGg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendQuotationEmails = async (formData: CustomerFormData) => {
  try {
    // Generate email templates
    const customerTemplate = generateCustomerEmailHTML(
      formData.name,
      formData.email,
      formData.phone,
      formData.selectedServices,
      formData.urgent,
      formData.hasDocument ? formData.documentUrl : undefined,
      formData.hasDocument ? formData.documentName : undefined
    );
    
    const adminTemplate = generateAdminEmailHTML(
      formData.name,
      formData.email,
      formData.phone,
      formData.selectedServices,
      formData.urgent,
      formData.hasDocument ? formData.documentUrl : undefined,
      formData.hasDocument ? formData.documentName : undefined
    );

    // Call the Supabase Edge Function to send emails
    const { data, error } = await supabase.functions.invoke('send-quotation-emails', {
      body: {
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone,
        selectedServices: formData.selectedServices,
        urgent: formData.urgent,
        hasDocument: formData.hasDocument,
        documentUrl: formData.documentUrl,
        documentName: formData.documentName,
        customerTemplate,
        adminTemplate
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error('Failed to send emails: ' + error.message);
    }

    console.log('Email sending response:', data);
    return data;
  } catch (error) {
    console.error('Error sending emails:', error);
    toast.error('Could not send emails. Please try again later.');
    throw error;
  }
};
