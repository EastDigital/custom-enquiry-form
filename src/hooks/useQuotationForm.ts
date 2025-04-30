
import { useState } from "react";
import { CustomerFormData, ServiceSelection } from "@/types/form";
import { serviceCategories } from "@/data/servicesData";
import { toast } from "sonner";
import { sendQuotationEmails } from '@/utils/supabaseEmail';

const initialFormData: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  country: "",
  selectedServices: [],
  urgent: false,
  hasDocument: false,
  documentUrl: "",
  documentName: "",
};

export const useQuotationForm = () => {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showFinalOptions, setShowFinalOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [inquiryMode, setInquiryMode] = useState(true);
  const [country, setCountry] = useState("");

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      country: value,
    });
    setCountry(value);
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
      // Reset document fields if toggling off
      ...(checked === false && { documentUrl: "", documentName: "" }),
    });
  };

  const handleDocumentUpload = (url: string, fileName: string) => {
    setFormData({
      ...formData,
      documentUrl: url,
      documentName: fileName,
    });
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

  // Validate basic form data
  const validateBasicForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.country) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // If document upload is enabled but no document was uploaded
    if (formData.hasDocument && !formData.documentUrl) {
      toast.error("Please upload your document or turn off the document upload option");
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (currentStep === 0) {
      if (!validateBasicForm()) return;
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (formData.selectedServices.length === 0) {
        toast.error("Please select at least one service");
        return;
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowFinalOptions(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInquirySubmit = async () => {
    if (!validateBasicForm()) return;
    
    setSubmitting(true);
    
    try {
      // Include message in the email
      const inquiryData = {
        ...formData,
        message,
      };
      
      await sendQuotationEmails(inquiryData);
      toast.success("Your inquiry has been sent successfully!");
      
      setShowConfirmation(true);
      
      setTimeout(() => {
        setFormData(initialFormData);
        setMessage("");
        setCountry("");
        setCurrentStep(0);
        setShowConfirmation(false);
      }, 10000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("There was an error processing your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (paidOption: boolean) => {
    setSubmitting(true);
    
    try {
      if (paidOption) {
        toast.success("Payment successful! Your quote has been sent to your email.");
      }
      
      // Include message in the email
      const submissionData = {
        ...formData,
        message,
      };
      
      await sendQuotationEmails(submissionData);
      toast.success("Your quote has been sent to your email!");
      
      setShowConfirmation(true);
      setShowFinalOptions(false);
      
      setTimeout(() => {
        setFormData(initialFormData);
        setMessage("");
        setCountry("");
        setCurrentStep(0);
        setSelectedServiceId(null);
        setShowConfirmation(false);
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
    inquiryMode,
    setInquiryMode,
    country,
    handleCountryChange,
  };
};
