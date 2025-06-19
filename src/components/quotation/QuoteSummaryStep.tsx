
import React from "react";
import { CustomerFormData } from "@/types/form";
import { ServiceCategory } from "@/data/servicesData";
import { FileText } from "lucide-react";

interface QuoteSummaryStepProps {
  formData: CustomerFormData;
  serviceCategories: ServiceCategory[];
}

const QuoteSummaryStep: React.FC<QuoteSummaryStepProps> = ({ formData, serviceCategories }) => {
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
          <div className="col-span-2">
            <span className="text-sm text-muted-foreground">Urgency:</span>
            <p>{formData.urgent ? "Urgent" : "Not So Urgent"}</p>
          </div>
          
          {formData.hasDocument && formData.documentUrl && (
            <div className="col-span-2">
              <span className="text-sm text-muted-foreground">Document:</span>
              <p className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {formData.documentName}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-secondary/30">
        <h3 className="font-semibold mb-2">Selected Services</h3>
        <ul className="space-y-2">
          {formData.selectedServices.map((service) => {
            const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
            const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
            
            if (!serviceCategory || !subService) return null;
            
            return (
              <li key={`${service.serviceId}-${service.subServiceId}`} className="flex justify-between">
                <span>
                  {serviceCategory.name}: {subService.name}
                  {service.quantity && subService.unit && ` (${service.quantity} ${subService.unit.replace('per ', '')})`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default QuoteSummaryStep;
