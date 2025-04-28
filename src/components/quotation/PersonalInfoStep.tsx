
import React from "react";
import { CustomerFormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PersonalInfoStepProps {
  formData: CustomerFormData;
  handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrgentChange: (checked: boolean) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handlePersonalInfoChange,
  handleUrgentChange,
}) => {
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

        <div className="flex items-center justify-between mt-4 pt-2 border-t">
          <div className="space-y-0.5">
            <Label htmlFor="urgent-mode" className="form-label">Urgency Level</Label>
            <p className="text-sm text-muted-foreground">
              {formData.urgent ? "Urgent" : "Not So Urgent"}
            </p>
          </div>
          <Switch
            id="urgent-mode"
            checked={formData.urgent}
            onCheckedChange={handleUrgentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
