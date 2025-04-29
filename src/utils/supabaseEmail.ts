
import { createClient } from '@supabase/supabase-js';
import { CustomerFormData } from '@/types/form';
import { generateCustomerEmailHTML, generateAdminEmailHTML } from './emailTemplates';
import { toast } from "sonner";

// Create a Supabase client with public keys or use mockup if not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock implementation or a real Supabase client depending on available credentials
const createSupabaseClient = () => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return null;
};

const supabase = createSupabaseClient();

export const sendQuotationEmails = async (formData: CustomerFormData) => {
  try {
    // If Supabase client is not available, simulate success response but show a toast warning
    if (!supabase) {
      console.warn('Supabase credentials not configured. Running in development mode.');
      toast.warning('Running in development mode - emails not sent. Please configure Supabase to enable email functionality.');
      
      // Return a mock response
      return {
        success: true,
        message: 'Email sending simulated in development mode.'
      };
    }
    
    // Real implementation with Supabase - sending emails immediately
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
        customerTemplate: generateCustomerEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices,
          formData.urgent,
          formData.hasDocument ? formData.documentUrl : undefined,
          formData.hasDocument ? formData.documentName : undefined
        ),
        adminTemplate: generateAdminEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices,
          formData.urgent,
          formData.hasDocument ? formData.documentUrl : undefined,
          formData.hasDocument ? formData.documentName : undefined
        )
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
};
