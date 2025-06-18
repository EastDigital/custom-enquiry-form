
import { useState } from "react";
import { CustomerFormData } from "@/types/form";

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

export const useFormState = () => {
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(initialFormData);
    setMessage("");
    setCountry("");
    setCurrentStep(0);
    setSelectedServiceId(null);
    setShowConfirmation(false);
    setShowFinalOptions(false);
    setFormErrors({});
  };

  return {
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
    inquiryMode,
    setInquiryMode,
    country,
    setCountry,
    formErrors,
    setFormErrors,
    resetForm,
  };
};
