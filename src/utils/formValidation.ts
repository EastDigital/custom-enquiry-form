
export interface FormErrors {
  [key: string]: string;
}

export const validatePersonalInfo = (formData: {
  name: string;
  email: string;
  phone: string;
  country: string;
  hasDocument: boolean;
  documentUrl?: string;
}): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;
  
  if (!formData.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }
  
  if (!formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
  }
  
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  }
  
  if (!formData.country) {
    errors.country = "Please select your country";
    isValid = false;
  }
  
  if (formData.hasDocument && !formData.documentUrl) {
    errors.documentUrl = "Please upload your document or turn off the document upload option";
    isValid = false;
  }
  
  return { isValid, errors };
};

export const getAllowedFileTypes = () => [
  "application/pdf", 
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg", 
  "image/png"
];

export const getFileTypeExtensions = () => ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";

export const validateFileType = (file: File): boolean => {
  const allowedTypes = getAllowedFileTypes();
  return allowedTypes.includes(file.type);
};
