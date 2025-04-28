
import { useState } from "react";
import { CustomerFormData, ServiceSelection } from "@/types/form";
import { serviceCategories } from "@/data/servicesData";
import { toast } from "sonner";
import { sendQuotationEmails } from '@/utils/supabaseEmail';

const initialFormData: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  selectedServices: [],
  urgent: false,
};

export const useQuotationForm = () => {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showFinalOptions, setShowFinalOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUrgentChange = (checked: boolean) => {
    setFormData({
      ...formData,
      urgent: checked,
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

  const nextStep = () => {
    if (currentStep === 0) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
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

  const handleSubmit = async (paidOption: boolean) => {
    setSubmitting(true);
    
    try {
      if (paidOption) {
        toast.success("Payment successful! Your quote has been sent to your email.");
      }
      
      await sendQuotationEmails(formData);
      toast.success("Your quote has been sent to your email!");
      
      setShowConfirmation(true);
      setShowFinalOptions(false);
      
      setTimeout(() => {
        setFormData(initialFormData);
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
    handleServiceCategoryChange,
    handleSubServiceChange,
    removeService,
    handleQuantityChange,
    isServiceSelected,
    nextStep,
    prevStep,
    handleSubmit,
  };
};

