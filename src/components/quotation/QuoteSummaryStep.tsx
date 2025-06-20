import React from "react";
import { CustomerFormData } from "@/types/form";
import { ServiceCategory } from "@/data/servicesData";
import { FileText, CheckCircle, Zap } from "lucide-react";
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
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Review Your Request</h2>
        <p className="text-slate-600 dark:text-slate-300">Please review your information before submitting</p>
      </div>
      
      {/* Customer Information */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-800/50">
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
      
      {/* Selected Services */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-800/50">
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
                <div key={`${service.serviceId}-${service.subServiceId}`} className="flex justify-between items-center p-3 bg-white dark:bg-slate-700 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {serviceCategory.name}: {subService.name}
                    </p>
                    {service.quantity && subService.unit && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Quantity: {service.quantity} {subService.unit.replace('per ', '')}
                      </p>
                    )}
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instant Proposal Option */}
      <Card className="border-2 border-brand-orange/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
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
                  <Zap className="w-5 h-5 text-brand-orange" />
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Generate Instant Proposal
                  </h4>
                  <span className="bg-brand-orange text-white px-2 py-1 rounded-full text-sm font-medium">
                    $10
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Get your detailed proposal immediately with comprehensive project analysis, cost breakdown, and timeline. 
                  Perfect for urgent projects that need quick turnaround.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant email delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detailed cost breakdown
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority support included
                  </div>
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