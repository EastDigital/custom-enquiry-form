import { useFormState } from "./useFormState";
import { validatePersonalInfo } from "@/utils/formValidation";
import { useServices } from "@/hooks/useServices";
import { toast } from "sonner";
import { sendQuotationEmails } from '@/utils/supabaseEmail';
import { saveCustomerInquiry } from '@/utils/supabaseInquiries';
import { supabase } from '@/integrations/supabase/client';

export const useQuotationForm = () => {
  const {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    selectedServiceId,
    setSelectedServiceId,
    showFinalOptions,
    setShowFinalOptions,
    submitting,
    setSubmitting,
    countdown,
    setCountdown,
    showConfirmation,
    setShowConfirmation,
    message,
    setMessage,
    instantProposal,
    setInstantProposal,
    country,
    setCountry,
    formErrors,
    setFormErrors,
    resetForm,
  } = useFormState();

  const { serviceCategories, loading: servicesLoading } = useServices();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      country: value,
    });
    setCountry(value);
    
    if (formErrors.country) {
      setFormErrors({
        ...formErrors,
        country: "",
      });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleUrgentChange = (checked: boolean) => {
    setFormData({
      ...formData,
      urgent: checked,
    });
  };
  
  const handleHasDocumentChange = (checked: boolean) => {
    setFormData({
      ...formData,
      hasDocument: checked,
      ...(checked === false && { documentUrl: "", documentName: "" }),
    });
    
    if (!checked && formErrors.documentUrl) {
      setFormErrors({
        ...formErrors,
        documentUrl: "",
      });
    }
  };

  const handleDocumentUpload = (url: string, fileName: string) => {
    setFormData({
      ...formData,
      documentUrl: url,
      documentName: fileName,
    });
    
    if (formErrors.documentUrl) {
      setFormErrors({
        ...formErrors,
        documentUrl: "",
      });
    }
  };

  const handleServiceCategoryChange = (value: string) => {
    setSelectedServiceId(value);
  };

  const handleSubServiceChange = (serviceId: string, subServiceId: string) => {
    const existingService = formData.selectedServices.find(
      (s) => s.serviceId === serviceId && s.subServiceId === subServiceId
    );
    
    if (existingService) {
      removeService(serviceId, subServiceId);
    } else {
      const serviceCategory = serviceCategories.find((sc) => sc.id === serviceId);
      const subService = serviceCategory?.subServices.find((ss) => ss.id === subServiceId);
      
      if (serviceCategory && subService) {
        let newServices = [...formData.selectedServices];
        const quantity = subService.minimumUnits || undefined;
        
        newServices.push({
          serviceId,
          subServiceId,
          quantity,
        });
        
        setFormData({
          ...formData,
          selectedServices: newServices,
        });
      }
    }
  };

  const removeService = (serviceId: string, subServiceId: string) => {
    setFormData({
      ...formData,
      selectedServices: formData.selectedServices.filter(
        (s) => !(s.serviceId === serviceId && s.subServiceId === subServiceId)
      ),
    });
  };

  const handleQuantityChange = (serviceId: string, subServiceId: string, quantity: number) => {
    const serviceCategory = serviceCategories.find((sc) => sc.id === serviceId);
    const subService = serviceCategory?.subServices.find((ss) => ss.id === subServiceId);
    
    if (subService?.minimumUnits && quantity < subService.minimumUnits) {
      quantity = subService.minimumUnits;
    }
    
    setFormData({
      ...formData,
      selectedServices: formData.selectedServices.map((service) => {
        if (service.serviceId === serviceId && service.subServiceId === subServiceId) {
          return { ...service, quantity };
        }
        return service;
      }),
    });
  };

  const isServiceSelected = (serviceId: string, subServiceId: string) => {
    return formData.selectedServices.some(
      (s) => s.serviceId === serviceId && s.subServiceId === subServiceId
    );
  };

  const validateForm = () => {
    const { isValid, errors } = validatePersonalInfo(formData);
    setFormErrors(errors);
    
    if (!isValid) {
      toast.error("Please correct the highlighted fields");
    }
    
    return isValid;
  };

  const nextStep = () => {
    if (currentStep === 0) {
      if (!validateForm()) return;
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (formData.selectedServices.length === 0) {
        toast.error("Please select at least one service");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // This will be handled by the submit buttons in the summary step
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInquirySubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        message,
      };
      
      // Save to database
      const inquiry = await saveCustomerInquiry(submissionData, false);
      
      // Send emails
      await sendQuotationEmails(submissionData);
      toast.success("Your tailored proposal request has been submitted successfully!");
      
      setShowConfirmation(true);
      
      setTimeout(() => {
        resetForm();
      }, 10000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("There was an error processing your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateAIProposal = async (inquiryId: string) => {
    try {
      console.log('Generating AI proposal for inquiry:', inquiryId);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-proposal', {
        body: { inquiryId }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate proposal');
      }

      console.log('AI proposal generated successfully');
      return data;
    } catch (error) {
      console.error('Error generating AI proposal:', error);
      throw error;
    }
  };

  const handleSubmit = async (paidOption: boolean) => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        message,
      };
      
      // Save to database
      const inquiry = await saveCustomerInquiry(submissionData, paidOption);
      
      if (paidOption && instantProposal) {
        toast.success("Processing your instant proposal...");
        
        // Generate AI-powered proposal
        try {
          const proposalData = await generateAIProposal(inquiry.id);
          toast.success("Your AI-generated proposal has been created and sent to your email!");
          
          // Send enhanced emails with AI proposal
          await sendQuotationEmails({
            ...submissionData,
            aiProposal: proposalData.proposal,
            totalAmount: proposalData.totalAmount
          });
        } catch (proposalError) {
          console.error('AI proposal generation failed:', proposalError);
          toast.error("Proposal generation failed, but your request has been saved. We'll send a manual proposal shortly.");
          
          // Fallback to regular email
          await sendQuotationEmails(submissionData);
        }
      } else {
        // Send regular emails for tailored proposals
        await sendQuotationEmails(submissionData);
        toast.success("Your proposal request has been submitted successfully!");
      }
      
      setShowConfirmation(true);
      setShowFinalOptions(false);
      
      setTimeout(() => {
        resetForm();
      }, 10000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("There was an error processing your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    currentStep,
    selectedServiceId,
    showFinalOptions,
    submitting,
    countdown,
    showConfirmation,
    handlePersonalInfoChange,
    handleUrgentChange,
    handleHasDocumentChange,
    handleDocumentUpload,
    handleServiceCategoryChange,
    handleSubServiceChange,
    removeService,
    handleQuantityChange,
    isServiceSelected,
    nextStep,
    prevStep,
    handleSubmit,
    handleInquirySubmit,
    message,
    handleMessageChange,
    instantProposal,
    setInstantProposal,
    country,
    handleCountryChange,
    formErrors,
    serviceCategories,
    servicesLoading,
  };
};
