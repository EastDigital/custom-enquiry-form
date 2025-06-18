
import React from "react";
import { CustomerFormData, ServiceSelection } from "@/types/form";
import { serviceCategories } from "@/data/servicesData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Select Services</h2>
        <p className="text-slate-600 dark:text-slate-300">Choose the services you need for your project</p>
      </div>
      
      <div>
        <Label htmlFor="serviceCategory" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Service Category*</Label>
        <Select onValueChange={handleServiceCategoryChange} value={selectedServiceId || undefined}>
          <SelectTrigger className="h-12 border-2 rounded-xl border-slate-200 focus:border-brand-orange transition-colors">
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
        <Card className="border-0 bg-slate-50 dark:bg-slate-800/50 mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Available Services
            </h3>
            <div className="grid gap-3">
              {serviceCategories
                .find((c) => c.id === selectedServiceId)
                ?.subServices.map((subService) => (
                  <div key={subService.id} className="space-y-3">
                    <div 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                        isServiceSelected(selectedServiceId, subService.id)
                          ? "bg-orange-50 dark:bg-orange-900/20 border-brand-orange"
                          : "bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      )}
                      onClick={() => handleSubServiceChange(selectedServiceId, subService.id)}
                    >
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-white">{subService.name}</h4>
                        <p className="text-sm text-brand-orange font-medium">${subService.price}{subService.unit ? ` per ${subService.unit.replace('per ', '')}` : ""}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                        isServiceSelected(selectedServiceId, subService.id) 
                          ? "bg-brand-orange text-white" 
                          : "bg-slate-100 dark:bg-slate-600 text-transparent"
                      )}>
                        {isServiceSelected(selectedServiceId, subService.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                    
                    {isServiceSelected(selectedServiceId, subService.id) && subService.unit && (
                      <div className="ml-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`quantity-${subService.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {subService.unit === "per minute" ? "Minutes:" : "Quantity:"}
                            {subService.minimumUnits && <span className="text-xs text-brand-orange ml-1">(Min: {subService.minimumUnits})</span>}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`quantity-${subService.id}`}
                              type="number"
                              className="w-24 h-10 border-2 border-slate-200 focus:border-brand-orange rounded-lg text-center"
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
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {formData.selectedServices.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Selected Services:</h3>
            <div className="space-y-3">
              {formData.selectedServices.map((service) => {
                const serviceCategory = serviceCategories.find((sc) => sc.id === service.serviceId);
                const subService = serviceCategory?.subServices.find((ss) => ss.id === service.subServiceId);
                
                if (!serviceCategory || !subService) return null;
                
                const price = service.quantity 
                  ? subService.price * service.quantity 
                  : subService.price;
                
                return (
                  <div 
                    key={`${service.serviceId}-${service.subServiceId}`} 
                    className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-brand-orange/20 dark:border-brand-orange/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{serviceCategory.name}:</span>
                        <span className="font-medium text-slate-800 dark:text-white">{subService.name}</span>
                      </div>
                      {service.quantity && subService.unit && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {service.quantity} {subService.unit.replace('per ', '')} × ${subService.price} = ${price}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeService(service.serviceId, service.subServiceId)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesSelectionStep;
