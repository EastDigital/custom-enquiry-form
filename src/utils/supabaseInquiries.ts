import { supabase } from '@/integrations/supabase/client';
import { CustomerFormData } from '@/types/form';
import { getServicePricing } from './adminUtils';

export const saveCustomerInquiry = async (
  formData: CustomerFormData & { message?: string },
  instantProposal: boolean = false
) => {
  try {
    // Calculate total amount by fetching actual prices from the database
    let totalAmount = 0;
    for (const service of formData.selectedServices) {
      const pricing = await getServicePricing(service.serviceId, service.subServiceId);
      if (pricing) {
        totalAmount += (service.quantity || 1) * pricing.price;
      }
    }

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

    // Insert selected services with actual pricing
    if (formData.selectedServices.length > 0) {
      const serviceInserts = [];
      
      for (const service of formData.selectedServices) {
        const pricing = await getServicePricing(service.serviceId, service.subServiceId);
        if (pricing) {
          serviceInserts.push({
            inquiry_id: inquiry.id,
            service_id: service.serviceId,
            sub_service_id: service.subServiceId,
            quantity: service.quantity || 1,
            unit_price: pricing.price,
            total_price: (service.quantity || 1) * pricing.price,
          });
        }
      }

      if (serviceInserts.length > 0) {
        const { error: servicesError } = await supabase
          .from('customer_inquiry_services')
          .insert(serviceInserts);

        if (servicesError) {
          throw servicesError;
        }
      }
    }

    return inquiry;
  } catch (error) {
    console.error('Error saving customer inquiry:', error);
    throw error;
  }
};