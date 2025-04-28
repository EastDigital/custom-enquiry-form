
import React, { useState } from "react";
import { serviceCategories } from "@/data/servicesData";
import { CustomerFormData, ServiceSelection } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const initialFormData: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  selectedServices: [],
};

const QuotationForm = () => {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showFinalOptions, setShowFinalOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceCategoryChange = (value: string) => {
    setSelectedServiceId(value);
  };

  const handleSubServiceChange = (serviceId: string, subServiceId: string) => {
    // Find if we already have this service category
    const existingService = formData.selectedServices.find(
      (s) => s.serviceId === serviceId && s.subServiceId === subServiceId
    );
    
    if (existingService) {
      // If it exists, remove it (toggle behavior)
      setFormData({
        ...formData,
        selectedServices: formData.selectedServices.filter(
          (s) => !(s.serviceId === serviceId && s.subServiceId === subServiceId)
        ),
      });
    } else {
      // Add the service
      const serviceCategory = serviceCategories.find((sc) => sc.id === serviceId);
      const subService = serviceCategory?.subServices.find((ss) => ss.id === subServiceId);
      
      if (serviceCategory && subService) {
        let newServices = [...formData.selectedServices];
        
        // If it has units (like minutes for walkthroughs), set default quantity
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

  const calculateTotal = () => {
    let total = 0;
    
    formData.selectedServices.forEach((service) => {
      const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
      const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
      
      if (subService) {
        if (service.quantity && subService.unit) {
          total += subService.price * service.quantity;
        } else {
          total += subService.price;
        }
      }
    });
    
    return total;
  };

  const nextStep = () => {
    if (currentStep === 0) {
      // Validate personal info
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
      // Validate service selection
      if (formData.selectedServices.length === 0) {
        toast.error("Please select at least one service");
        return;
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Show final options screen
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
    
    // Simulate sending email or processing payment
    try {
      // In a real app, send this data to your backend
      console.log("Form submitted:", { ...formData, paidOption });
      
      if (paidOption) {
        // Handle payment processing
        toast.success("Payment successful! Your quote has been sent to your email.");
        // Reset form or redirect
      } else {
        // Start countdown for free option
        let seconds = 10;
        setCountdown(seconds);
        
        const timer = setInterval(() => {
          seconds -= 1;
          setCountdown(seconds);
          
          if (seconds <= 0) {
            clearInterval(timer);
            toast.success("Your quote has been sent to your email!");
            // Reset form or redirect
          }
        }, 1000);
      }
    } catch (error) {
      toast.error("There was an error processing your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="form-label">Full Name*</Label>
                <Input
                  id="name"
                  name="name"
                  className="form-input mt-1"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="form-label">Email Address*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input mt-1"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="form-label">Phone Number*</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input mt-1"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Select Services</h2>
            
            <div>
              <Label htmlFor="serviceCategory" className="form-label">Service Category*</Label>
              <Select onValueChange={handleServiceCategoryChange} value={selectedServiceId || undefined}>
                <SelectTrigger className="form-dropdown mt-1">
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {selectedServiceId && (
              <div className="mt-4 space-y-4">
                <Label className="form-label">Sub-services</Label>
                <div className="grid gap-3">
                  {serviceCategories
                    .find((c) => c.id === selectedServiceId)
                    ?.subServices.map((subService) => (
                      <div key={subService.id} className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between border rounded-md p-3 hover:bg-secondary/50 cursor-pointer"
                             onClick={() => handleSubServiceChange(selectedServiceId, subService.id)}>
                          <div>
                            <span className="font-medium">{subService.name}</span>
                            <div className="text-sm text-muted-foreground">
                              ${subService.price}
                              {subService.unit && ` ${subService.unit}`}
                              {subService.minimumUnits && ` (min. ${subService.minimumUnits})`}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${isServiceSelected(selectedServiceId, subService.id) ? 'bg-primary text-white border-primary' : 'bg-background border-input'}`}>
                            {isServiceSelected(selectedServiceId, subService.id) && "✓"}
                          </div>
                        </div>
                        
                        {isServiceSelected(selectedServiceId, subService.id) && subService.unit && (
                          <div className="flex items-center ml-2 space-x-2">
                            <Label htmlFor={`quantity-${subService.id}`} className="form-label whitespace-nowrap">
                              {subService.unit === "per minute" ? "Minutes:" : "Quantity:"}
                            </Label>
                            <Input
                              id={`quantity-${subService.id}`}
                              type="number"
                              className="form-input w-24"
                              min={subService.minimumUnits || 1}
                              value={formData.selectedServices.find(
                                (s) => s.serviceId === selectedServiceId && s.subServiceId === subService.id
                              )?.quantity || subService.minimumUnits || 1}
                              onChange={(e) => 
                                handleQuantityChange(
                                  selectedServiceId, 
                                  subService.id, 
                                  parseInt(e.target.value) || subService.minimumUnits || 1
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {formData.selectedServices.length > 0 && (
              <div className="p-4 border rounded-md mt-6 bg-secondary/30">
                <h3 className="font-semibold mb-2">Selected Services:</h3>
                <ul className="space-y-1 mb-4">
                  {formData.selectedServices.map((service) => {
                    const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
                    const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
                    
                    if (!serviceCategory || !subService) return null;
                    
                    let price = subService.price;
                    if (service.quantity && subService.unit) {
                      price *= service.quantity;
                    }
                    
                    return (
                      <li key={`${service.serviceId}-${service.subServiceId}`} className="flex justify-between">
                        <span>
                          {serviceCategory.name}: {subService.name}
                          {service.quantity && subService.unit && ` (${service.quantity} ${subService.unit.replace('per ', '')})`}
                        </span>
                        <span className="font-medium">${price}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Quote Summary</h2>
            
            <div className="border rounded-md p-4 bg-secondary/30">
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p>{formData.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p>{formData.email}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-secondary/30">
              <h3 className="font-semibold mb-2">Services</h3>
              <ul className="space-y-1 mb-4">
                {formData.selectedServices.map((service) => {
                  const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
                  const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
                  
                  if (!serviceCategory || !subService) return null;
                  
                  let price = subService.price;
                  if (service.quantity && subService.unit) {
                    price *= service.quantity;
                  }
                  
                  return (
                    <li key={`${service.serviceId}-${service.subServiceId}`} className="flex justify-between">
                      <span>
                        {serviceCategory.name}: {subService.name}
                        {service.quantity && subService.unit && ` (${service.quantity} ${subService.unit.replace('per ', '')})`}
                      </span>
                      <span className="font-medium">${price}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
            
            {!showFinalOptions && (
              <div className="flex justify-center">
                <Button onClick={() => setShowFinalOptions(true)} className="w-full">
                  Get My Quote
                </Button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderQuoteOptions = () => {
    if (!showFinalOptions) return null;
    
    if (submitting) {
      return (
        <div className="text-center p-8">
          <div className="animate-pulse-light mb-4">
            <h3 className="text-xl font-semibold mb-2">Processing your quote...</h3>
            
            {countdown > 0 && (
              <div className="mt-4">
                <p>Your quote will be delivered in:</p>
                <p className="text-3xl font-bold text-primary">{countdown} seconds</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6 border rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Choose an Option</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div 
            className="p-4 border rounded-md hover:shadow-md transition-shadow cursor-pointer bg-secondary/30"
            onClick={() => handleSubmit(false)}
          >
            <div className="text-center mb-3">
              <span className="inline-block p-2 rounded-full bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
            </div>
            <h4 className="font-semibold text-center">Free Quote</h4>
            <p className="text-center text-sm text-muted-foreground">
              Wait 10 minutes to receive your quote via email
            </p>
          </div>
          
          <div 
            className="p-4 border rounded-md hover:shadow-md transition-shadow cursor-pointer bg-primary/10"
            onClick={() => handleSubmit(true)}
          >
            <div className="text-center mb-3">
              <span className="inline-block p-2 rounded-full bg-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </span>
            </div>
            <h4 className="font-semibold text-center">Instant Quote - $10</h4>
            <p className="text-center text-sm text-muted-foreground">
              Get your detailed quote delivered instantly
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        {!showFinalOptions && (
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex-1 flex">
                {[0, 1, 2].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step + 1}
                      </div>
                      <span
                        className={`ml-2 text-sm ${
                          currentStep === step ? "font-medium" : "text-muted-foreground"
                        } hidden sm:inline`}
                      >
                        {step === 0
                          ? "Personal Info"
                          : step === 1
                          ? "Services"
                          : "Summary"}
                      </span>
                    </div>
                    {step < 2 && (
                      <div className="flex-1 mx-2 h-0.5 self-center bg-muted">
                        <div
                          className={`h-0.5 bg-primary ${
                            currentStep > step ? "w-full" : "w-0"
                          } transition-all duration-500`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          {showFinalOptions ? renderQuoteOptions() : renderStep()}
          
          {!showFinalOptions && (
            <div className="mt-6 flex justify-between">
              {currentStep > 0 ? (
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button onClick={nextStep}>
                {currentStep === 2 ? "Get Quote" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
