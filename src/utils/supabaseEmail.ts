
import { createClient } from '@supabase/supabase-js';
import { CustomerFormData } from '@/types/form';
import { generateCustomerEmailHTML, generateAdminEmailHTML } from './emailTemplates';

// Create a Supabase client with public keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendQuotationEmails = async (formData: CustomerFormData) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-quotation-emails', {
      body: {
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone,
        selectedServices: formData.selectedServices,
        urgent: formData.urgent,
        customerTemplate: generateCustomerEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices,
          formData.urgent
        ),
        adminTemplate: generateAdminEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices,
          formData.urgent
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
