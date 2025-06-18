
import { createClient } from '@supabase/supabase-js';
import { CustomerFormData } from '@/types/form';
import { generateCustomerEmailHTML, generateAdminEmailHTML } from './emailTemplates';
import { toast } from "sonner";

// Create a Supabase client with public keys
const supabaseUrl = "https://nggouhjmaewijuqpxwdv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZ291aGptYWV3aWp1cXB4d2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzI5NzYsImV4cCI6MjA2MTUwODk3Nn0.MF9MDknLJmPyZ6WnwurlVeBU9duyM-qI_QpqXCKhKGg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendQuotationEmails = async (formData: CustomerFormData & { message?: string }) => {
  try {
    // Extract message from the form data
    const { message, ...restFormData } = formData;
    
    // Generate email templates
    const customerTemplate = generateCustomerEmailHTML(
      restFormData.name,
      restFormData.email,
      restFormData.phone,
      restFormData.selectedServices,
      restFormData.urgent,
      restFormData.hasDocument ? restFormData.documentUrl : undefined,
      restFormData.hasDocument ? restFormData.documentName : undefined
    );
    
    const adminTemplate = generateAdminEmailHTML(
      restFormData.name,
      restFormData.email,
      restFormData.phone,
      restFormData.selectedServices,
      restFormData.urgent,
      restFormData.hasDocument ? restFormData.documentUrl : undefined,
      restFormData.hasDocument ? restFormData.documentName : undefined,
      message
    );

    // Call the Supabase Edge Function to send emails
    const { data, error } = await supabase.functions.invoke('send-quotation-emails', {
      body: {
        customerEmail: restFormData.email,
        customerName: restFormData.name,
        customerPhone: restFormData.phone,
        selectedServices: restFormData.selectedServices,
        urgent: restFormData.urgent,
        hasDocument: restFormData.hasDocument,
        documentUrl: restFormData.documentUrl,
        documentName: restFormData.documentName,
        message,
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
