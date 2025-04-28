
import React from "react";
import { CustomerFormData, ServiceSelection } from "@/types/form";
import { serviceCategories } from "@/data/servicesData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface ServicesSelectionStepProps {
  formData: CustomerFormData;
  selectedServiceId: string | null;
  handleServiceCategoryChange: (value: string) => void;
  handleSubServiceChange: (serviceId: string, subServiceId: string) => void;
  handleQuantityChange: (serviceId: string, subServiceId: string, quantity: number) => void;
  removeService: (serviceId: string, subServiceId: string) => void;
  isServiceSelected: (serviceId: string, subServiceId: string) => boolean;
}

const ServicesSelectionStep: React.FC<ServicesSelectionStepProps> = ({
  formData,
  selectedServiceId,
  handleServiceCategoryChange,
  handleSubServiceChange,
  handleQuantityChange,
  removeService,
  isServiceSelected,
}) => {
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
                  <div 
                    className="flex items-center justify-between border rounded-md p-3 hover:bg-secondary/50 cursor-pointer"
                    onClick={() => handleSubServiceChange(selectedServiceId, subService.id)}
                  >
                    <span className="font-medium">{subService.name}</span>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                      isServiceSelected(selectedServiceId, subService.id) 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-background border-input'
                    }`}>
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
        <div className="p-4 border rounded-md mt-6">
          <h3 className="font-semibold mb-2">Selected Services:</h3>
          <ul className="space-y-2">
            {formData.selectedServices.map((service) => {
              const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
              const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
              
              if (!serviceCategory || !subService) return null;
              
              return (
                <li 
                  key={`${service.serviceId}-${service.subServiceId}`} 
                  className="flex justify-between items-center bg-secondary/20 p-2 rounded-md"
                >
                  <span>
                    {serviceCategory.name}: {subService.name}
                    {service.quantity && subService.unit && ` (${service.quantity} ${subService.unit.replace('per ', '')})`}
                  </span>
                  <button
                    onClick={() => removeService(service.serviceId, service.subServiceId)}
                    className="p-1 hover:bg-secondary rounded-full"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServicesSelectionStep;
