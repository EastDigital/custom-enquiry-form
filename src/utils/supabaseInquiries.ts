
import { supabase } from '@/integrations/supabase/client';
import { CustomerFormData } from '@/types/form';

export const saveCustomerInquiry = async (
  formData: CustomerFormData & { message?: string },
  instantProposal: boolean = false
) => {
  try {
    // Calculate total amount
    const totalAmount = formData.selectedServices.reduce((total, service) => {
      // We'll need to fetch the price from the sub_services table
      // For now, we'll calculate it based on the static data
      return total + (service.quantity || 1) * 100; // Placeholder calculation
    }, 0);

    // Insert customer inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('customer_inquiries')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        message: formData.message,
        urgent: formData.urgent,
        has_document: formData.hasDocument,
        document_url: formData.documentUrl,
        document_name: formData.documentName,
        proposal_type: instantProposal ? 'instant' : 'tailored',
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (inquiryError) {
      throw inquiryError;
    }

    // Insert selected services
    if (formData.selectedServices.length > 0) {
      const serviceInserts = formData.selectedServices.map(service => ({
        inquiry_id: inquiry.id,
        service_id: service.serviceId,
        sub_service_id: service.subServiceId,
        quantity: service.quantity || 1,
        unit_price: 100, // We'll need to fetch this from the database
        total_price: (service.quantity || 1) * 100, // Placeholder calculation
      }));

      const { error: servicesError } = await supabase
        .from('customer_inquiry_services')
        .insert(serviceInserts);

      if (servicesError) {
        throw servicesError;
      }
    }

    return inquiry;
  } catch (error) {
    console.error('Error saving customer inquiry:', error);
    throw error;
  }
};

export const getServicePricing = async (serviceId: string, subServiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('sub_services')
      .select('price, unit, minimum_units')
      .eq('id', subServiceId)
      .eq('service_id', serviceId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching service pricing:', error);
    return null;
  }
};
