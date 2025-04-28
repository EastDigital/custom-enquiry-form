
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CustomerFormData } from '@/types/form';
import { generateCustomerEmailHTML, generateAdminEmailHTML } from './emailTemplates';

const supabase = createClientComponentClient();

export const sendQuotationEmails = async (formData: CustomerFormData) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-quotation-emails', {
      body: {
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone,
        selectedServices: formData.selectedServices,
        customerTemplate: generateCustomerEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices
        ),
        adminTemplate: generateAdminEmailHTML(
          formData.name,
          formData.email,
          formData.phone,
          formData.selectedServices
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
