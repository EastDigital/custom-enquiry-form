
import { supabase } from '@/integrations/supabase/client';
import { CustomerFormData } from '@/types/form';

export const saveCustomerInquiry = async (
  formData: CustomerFormData & { message?: string },
  instantProposal: boolean = false
) => {
  try {
    console.log('=== STARTING CUSTOMER INQUIRY SAVE ===');
    console.log('Form data:', formData);
    console.log('Instant proposal:', instantProposal);

    // Calculate total amount
    let totalAmount = 0;
    if (instantProposal) {
      totalAmount = 10; // Base instant proposal fee
    }

    // Prepare inquiry data
    const inquiryData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country || null,
      message: formData.message || null,
      urgent: formData.urgent || false,
      has_document: formData.hasDocument || false,
      document_url: formData.documentUrl || null,
      document_name: formData.documentName || null,
      proposal_type: instantProposal ? 'instant' : 'tailored',
      total_amount: totalAmount,
      status: 'pending',
    };

    console.log('Prepared inquiry data:', inquiryData);

    // Insert customer inquiry
    console.log('Inserting customer inquiry...');
    const { data: inquiry, error: inquiryError } = await supabase
      .from('customer_inquiries')
      .insert(inquiryData)
      .select()
      .single();

    if (inquiryError) {
      console.error('❌ Error inserting inquiry:', inquiryError);
      throw new Error(`Failed to save inquiry: ${inquiryError.message}`);
    }

    console.log('✅ Inquiry saved successfully:', inquiry);

    // Insert selected services if any
    if (formData.selectedServices && formData.selectedServices.length > 0) {
      console.log('Inserting services:', formData.selectedServices);

      const serviceInserts = formData.selectedServices.map(service => ({
        inquiry_id: inquiry.id,
        service_id: service.serviceId,
        sub_service_id: service.subServiceId,
        quantity: service.quantity || 1,
        unit_price: 0, // Will be calculated by admin
        total_price: 0, // Will be calculated by admin
      }));

      console.log('Service inserts data:', serviceInserts);

      const { data: servicesData, error: servicesError } = await supabase
        .from('customer_inquiry_services')
        .insert(serviceInserts)
        .select();

      if (servicesError) {
        console.error('❌ Error saving services:', servicesError);
        // Don't throw here, inquiry is already saved
        console.warn('⚠️ Services could not be saved, but inquiry was successful');
      } else {
        console.log('✅ Services saved successfully:', servicesData);
      }
    }

    console.log('=== CUSTOMER INQUIRY SAVE COMPLETED ===');
    return inquiry;
  } catch (error) {
    console.error('❌ Error in saveCustomerInquiry:', error);
    throw error;
  }
};
