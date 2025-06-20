import React from "react";
import { CustomerFormData } from "@/types/form";
import { ServiceCategory } from "@/data/servicesData";
import { FileText, CheckCircle, Zap, Brain, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface QuoteSummaryStepProps {
  formData: CustomerFormData;
  serviceCategories: ServiceCategory[];
  instantProposal: boolean;
  setInstantProposal: (value: boolean) => void;
}

const QuoteSummaryStep: React.FC<QuoteSummaryStepProps> = ({ 
  formData, 
  serviceCategories, 
  instantProposal, 
  setInstantProposal 
}) => {
  // Keep calculation function for backend use but don't display the result
  const calculateEstimatedTotal = () => {
    return formData.selectedServices.reduce((total, service) => {
      const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
      const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
      if (subService) {
        return total + (subService.price * (service.quantity || 1));
      }
      return total;
    }, 0);
  };

  // Keep this for backend calculations but don't use in UI
  const estimatedTotal = calculateEstimatedTotal();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Review Your Request</h2>
        <p className="text-slate-600 dark:text-slate-300">Please review your information before submitting</p>
      </div>
      
      {/* Customer Information */}
      <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Name:</span>
              <p className="font-medium text-slate-800 dark:text-white">{formData.name}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Phone:</span>
              <p className="font-medium text-slate-800 dark:text-white">{formData.phone}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Email:</span>
              <p className="font-medium text-slate-800 dark:text-white">{formData.email}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Country:</span>
              <p className="font-medium text-slate-800 dark:text-white">{formData.country}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Priority:</span>
              <p className="font-medium text-slate-800 dark:text-white">
                {formData.urgent ? "Urgent" : "Standard"}
              </p>
            </div>
            
            {formData.hasDocument && formData.documentUrl && (
              <div className="col-span-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Document:</span>
                <p className="flex items-center gap-2 font-medium text-slate-800 dark:text-white">
                  <FileText className="h-4 w-4" />
                  {formData.documentName}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Services - Hide all pricing information */}
      <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Selected Services
          </h3>
          <div className="space-y-3">
            {formData.selectedServices.map((service) => {
              const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
              const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
              
              if (!serviceCategory || !subService) return null;
              
              return (
                <div key={`${service.serviceId}-${service.subServiceId}`} className="flex justify-between items-center p-3 bg-white/80 dark:bg-slate-700/60 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-white">
                      {serviceCategory.name}: {subService.name}
                    </p>
                    {service.quantity && subService.unit && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Quantity: {service.quantity} {subService.unit.replace('per ', '')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Remove estimated total display */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-600/60">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Your customized pricing will be calculated and included in your proposal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instant Proposal Option */}
      <Card className="border-2 border-brand-orange/40 bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/30 dark:to-amber-900/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Checkbox
              id="instant-proposal"
              checked={instantProposal}
              onCheckedChange={setInstantProposal}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="instant-proposal" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-brand-orange" />
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                    AI-Powered Instant Proposal
                  </h4>
                  <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                    $10
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  Get your detailed proposal immediately with AI-generated comprehensive project analysis, 
                  cost breakdown, timeline, and personalized recommendations based on your specific requirements.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Zap className="w-4 h-4 text-brand-orange" />
                    Instant AI generation & delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Brain className="w-4 h-4 text-green-500" />
                    Personalized project analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Detailed cost breakdown
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-green-500" />
                    Realistic timeline & milestones
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    ROI analysis & projections
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority support included
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-white/60 dark:bg-slate-700/40 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>How it works:</strong> Our AI analyzes your requirements, compares them with thousands 
                    of similar projects, and generates a comprehensive proposal tailored specifically to your needs. 
                    Perfect for urgent projects requiring immediate attention.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteSummaryStep;
