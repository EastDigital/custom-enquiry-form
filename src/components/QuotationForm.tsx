
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuotationForm } from "@/hooks/useQuotationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

// Import refactored components
import PersonalInfoStep from "./quotation/PersonalInfoStep";
import ServicesSelectionStep from "./quotation/ServicesSelectionStep";
import QuoteSummaryStep from "./quotation/QuoteSummaryStep";
import QuoteOptions from "./quotation/QuoteOptions";
import ConfirmationMessage from "./quotation/ConfirmationMessage";
import StepIndicator from "./quotation/StepIndicator";
import ToggleSwitch from "./quotation/ToggleSwitch";

const QuotationForm = () => {
  const isMobile = useIsMobile();
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
    instantProposal,
    setInstantProposal,
    country,
    handleCountryChange,
    formErrors,
    serviceCategories,
    servicesLoading,
  } = useQuotationForm();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} handlePersonalInfoChange={handlePersonalInfoChange} handleUrgentChange={handleUrgentChange} handleHasDocumentChange={handleHasDocumentChange} handleDocumentUpload={handleDocumentUpload} message={message} handleMessageChange={handleMessageChange} country={country} handleCountryChange={handleCountryChange} formErrors={formErrors} />;
      case 1:
        if (servicesLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
              <span className="ml-2 text-slate-600">Loading services...</span>
            </div>
          );
        }
        return <ServicesSelectionStep formData={formData} selectedServiceId={selectedServiceId} handleServiceCategoryChange={handleServiceCategoryChange} handleSubServiceChange={handleSubServiceChange} handleQuantityChange={handleQuantityChange} removeService={removeService} isServiceSelected={isServiceSelected} serviceCategories={serviceCategories} />;
      case 2:
        return <QuoteSummaryStep formData={formData} serviceCategories={serviceCategories} />;
      default:
        return null;
    }
  };

  const getConfirmationMessage = () => {
    if (!instantProposal) {
      return {
        title: "Tailored Proposal Request Submitted",
        message: "Thank you for your request! Our East Digital team will send you a tailored proposal within 2 business days."
      };
    } else if (showFinalOptions) {
      return {
        title: "Instant Proposal Processed",
        message: "Your payment has been processed and your instant proposal has been delivered to your inbox."
      };
    } else {
      return {
        title: "Instant Proposal Generated",
        message: "Your instant proposal is ready and has been sent to your email address."
      };
    }
  };

  const confirmationDetails = getConfirmationMessage();

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-dark-orange text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Professional Services Proposal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-orange via-amber-600 to-brand-dark-orange bg-clip-text text-transparent mb-4">Let's Build Your Blueprint.</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Choose your preferred proposal option and receive a customized plan from East Digital</p>
        </div>

        {showConfirmation ? <div className="max-w-2xl mx-auto">
            <ConfirmationMessage show={showConfirmation} title={confirmationDetails.title} message={confirmationDetails.message} />
          </div> : <div className="max-w-3xl mx-auto">
            {/* Proposal Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <ToggleSwitch id="proposal-type-toggle" checked={instantProposal} onCheckedChange={checked => setInstantProposal(checked)} leftLabel="Tailored Proposal" rightLabel="Instant Proposal" leftColor="text-slate-600" rightColor="text-brand-orange" />
              </div>
            </div>

            {!showFinalOptions && <div className="mb-8">
                <StepIndicator currentStep={currentStep} totalSteps={3} />
              </div>}

            {/* Main Form Card */}
            <Card className="relative bg-white/10 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl glass-card overflow-hidden">
              <CardContent className="p-8">
                {showFinalOptions ? <QuoteOptions submitting={submitting} countdown={countdown} handleSubmit={handleSubmit} instantProposal={instantProposal} /> : <>
                    {renderStep()}
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                      {currentStep > 0 ? <Button variant="outline" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 hover:border-brand-orange transition-all duration-200">
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button> : <div></div>}
                      
                      {!instantProposal && currentStep === 2 ? <Button onClick={handleInquirySubmit} disabled={submitting || servicesLoading} className="bg-gradient-to-r from-brand-orange to-brand-dark-orange hover:from-brand-dark-orange hover:to-brand-dark-orange text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2" size={isMobile ? "lg" : "default"}>
                          {submitting ? <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </> : <>
                              Submit Request
                              <ArrowRight className="w-4 h-4" />
                            </>}
                        </Button> : <Button onClick={nextStep} disabled={servicesLoading} className="bg-gradient-to-r from-brand-orange to-brand-dark-orange hover:from-brand-dark-orange hover:to-brand-dark-orange text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2" size={isMobile ? "lg" : "default"}>
                          {currentStep === 2 ? (instantProposal ? "Get Instant Proposal" : "Submit Request") : "Continue"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>}
                    </div>
                  </>}
              </CardContent>
            </Card>
          </div>}
      </div>
    </div>;
};

export default QuotationForm;
