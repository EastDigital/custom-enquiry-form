
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

  return (
    <div className="max-w-2xl mx-auto p-4" id="quotation-form-container">
      <div className="mb-8">
        {showConfirmation ? (
          <ConfirmationMessage show={showConfirmation} />
        ) : (
          <>
            {!showFinalOptions && (
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
