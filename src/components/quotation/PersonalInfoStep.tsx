
import React, { useState } from "react";
import { CustomerFormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PersonalInfoStepProps {
  formData: CustomerFormData;
  handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrgentChange: (checked: boolean) => void;
  handleDocumentUpload: (url: string, fileName: string) => void;
  handleHasDocumentChange: (checked: boolean) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handlePersonalInfoChange,
  handleUrgentChange,
  handleDocumentUpload,
  handleHasDocumentChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const allowedFileTypes = [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "application/vnd.dwg", 
    "image/jpeg", 
    "image/png"
  ];
  const maxFileSizeMB = 50;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload .doc, .pdf, .dwg, .jpg, or .png files.");
      return;
    }

    // Check file size (convert MB to bytes)
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit.`);
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      handleDocumentUpload(urlData.publicUrl, file.name);
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

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

        <div className="flex items-center justify-between mt-4 pt-2 border-t">
          <div className="space-y-0.5">
            <Label htmlFor="has-document" className="form-label">Do you have a document to upload?</Label>
            <p className="text-sm text-muted-foreground">
              {formData.hasDocument ? "Yes" : "No"}
            </p>
          </div>
          <Switch
            id="has-document"
            checked={formData.hasDocument}
            onCheckedChange={handleHasDocumentChange}
          />
        </div>

        {formData.hasDocument && (
          <div className="mt-4 border rounded-md p-4 bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="document-upload">Upload Document</Label>
              <p className="text-xs text-muted-foreground">
                Accepted formats: .pdf, .doc, .dwg, .jpg, .png (Max: 50MB)
              </p>
              
              {formData.documentUrl ? (
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm truncate flex-1">{formData.documentName}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    type="button" 
                    onClick={() => {
                      handleDocumentUpload("", "");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Input
                    id="document-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("document-upload")?.click()}
                    disabled={isUploading}
                    className="w-full justify-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Select File"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
