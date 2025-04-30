
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuotationForm } from "@/hooks/useQuotationForm";

// Import refactored components
import PersonalInfoStep from "./quotation/PersonalInfoStep";
import ServicesSelectionStep from "./quotation/ServicesSelectionStep";
import QuoteSummaryStep from "./quotation/QuoteSummaryStep";
import QuoteOptions from "./quotation/QuoteOptions";
import ConfirmationMessage from "./quotation/ConfirmationMessage";
import StepIndicator from "./quotation/StepIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuotationForm = () => {
  const {
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
    formErrors,
  } = useQuotationForm();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            formData={formData}
            handlePersonalInfoChange={handlePersonalInfoChange}
            handleUrgentChange={handleUrgentChange}
            handleHasDocumentChange={handleHasDocumentChange}
            handleDocumentUpload={handleDocumentUpload}
            message={message}
            handleMessageChange={handleMessageChange}
            country={country}
            handleCountryChange={handleCountryChange}
            formErrors={formErrors}
          />
        );
        
      case 1:
        return (
          <ServicesSelectionStep
            formData={formData}
            selectedServiceId={selectedServiceId}
            handleServiceCategoryChange={handleServiceCategoryChange}
            handleSubServiceChange={handleSubServiceChange}
            handleQuantityChange={handleQuantityChange}
            removeService={removeService}
            isServiceSelected={isServiceSelected}
          />
        );
        
      case 2:
        return <QuoteSummaryStep formData={formData} />;
        
      default:
        return null;
    }
  };

  // Create different confirmation messages based on form type
  const getConfirmationMessage = () => {
    if (inquiryMode) {
      return {
        title: "Inquiry Submitted",
        message: "Thanks for reaching us, we will get in touch with you at the earliest possible.",
      };
    } else if (showFinalOptions) {
      return {
        title: "Quotation Requested",
        message: "Thanks, the quotation will be sent to you in about 30 mins, check inbox or spam/junk.",
      };
    } else {
      return {
        title: "Quote Request Submitted", 
        message: "Thanks, the quotation will be sent to you right away."
      };
    }
  };

  const confirmationDetails = getConfirmationMessage();

  return (
    <div className="max-w-2xl mx-auto p-4" id="quotation-form-container">
      <div className="mb-8">
        {showConfirmation ? (
          <ConfirmationMessage 
            show={showConfirmation} 
            title={confirmationDetails.title}
            message={confirmationDetails.message}
          />
        ) : (
          <>
            <Tabs 
              defaultValue={inquiryMode ? "inquiry" : "quote"} 
              className="mb-6"
              onValueChange={(value) => setInquiryMode(value === "inquiry")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inquiry">Quick Inquiry</TabsTrigger>
                <TabsTrigger value="quote">Get Detailed Quote</TabsTrigger>
              </TabsList>
            </Tabs>

            {!showFinalOptions && !inquiryMode && (
              <StepIndicator currentStep={currentStep} totalSteps={3} />
            )}

            <div className="bg-card rounded-lg p-6 shadow-sm border">
              {showFinalOptions ? (
                <QuoteOptions
                  submitting={submitting}
                  countdown={countdown}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <>
                  {renderStep()}
                  
                  <div className="mt-6 flex justify-between">
                    {!inquiryMode && currentStep > 0 ? (
                      <Button variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {inquiryMode ? (
                      <Button 
                        onClick={handleInquirySubmit}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Inquiry"}
                      </Button>
                    ) : (
                      <Button onClick={nextStep}>
                        {currentStep === 2 ? "Get Quote" : "Next"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;
