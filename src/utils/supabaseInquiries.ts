
import { supabase } from '@/integrations/supabase/client';
import { CustomerFormData } from '@/types/form';

export const saveCustomerInquiry = async (
  formData: CustomerFormData & { message?: string },
  instantProposal: boolean = false
) => {
  try {
    console.log('Saving customer inquiry:', { formData, instantProposal });

    // Insert customer inquiry with default pricing
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
        total_amount: 0, // Will be calculated on backend
        status: 'pending',
      })
      .select()
      .single();

    if (inquiryError) {
      console.error('Error saving inquiry:', inquiryError);
      throw inquiryError;
    }

    console.log('Inquiry saved successfully:', inquiry);

    // Insert selected services without pricing (backend will handle pricing)
    if (formData.selectedServices.length > 0) {
      const serviceInserts = formData.selectedServices.map(service => ({
        inquiry_id: inquiry.id,
        service_id: service.serviceId,
        sub_service_id: service.subServiceId,
        quantity: service.quantity || 1,
        unit_price: 0, // Backend will calculate
        total_price: 0, // Backend will calculate
      }));

      const { error: servicesError } = await supabase
        .from('customer_inquiry_services')
        .insert(serviceInserts);

      if (servicesError) {
        console.error('Error saving services:', servicesError);
        throw servicesError;
      }

      console.log('Services saved successfully');
    }

    return inquiry;
  } catch (error) {
    console.error('Error saving customer inquiry:', error);
    throw error;
  }
};
