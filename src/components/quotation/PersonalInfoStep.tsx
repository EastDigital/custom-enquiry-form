
import React, { useState } from "react";
import { CustomerFormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Upload, User, Mail, Phone, Globe, MessageSquare, Clock, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToggleSwitch from "./ToggleSwitch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalInfoStepProps {
  formData: CustomerFormData;
  handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrgentChange: (checked: boolean) => void;
  handleDocumentUpload: (url: string, fileName: string) => void;
  handleHasDocumentChange: (checked: boolean) => void;
  message: string;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  country: string;
  handleCountryChange: (value: string) => void;
  formErrors?: Record<string, string>;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handlePersonalInfoChange,
  handleUrgentChange,
  handleDocumentUpload,
  handleHasDocumentChange,
  message,
  handleMessageChange,
  country,
  handleCountryChange,
  formErrors = {},
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useIsMobile();

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

    if (!allowedFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload .doc, .pdf, .dwg, .jpg, or .png files.");
      return;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit.`);
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

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

  const countries = [
    "United States", "India", "United Kingdom", "Canada", "Australia", 
    "Germany", "France", "Japan", "China", "Brazil", "Italy", "Spain", 
    "Russia", "South Korea", "Mexico", "Indonesia", "Netherlands", 
    "Turkey", "Saudi Arabia", "Switzerland", "United Arab Emirates", "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Let's Get Started</h2>
        <p className="text-slate-600 dark:text-slate-300">Tell us about yourself and your project</p>
      </div>
      
      {/* Contact Information */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Contact Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name*
              </Label>
              <Input
                id="name"
                name="name"
                className={`h-12 border-2 rounded-xl ${formErrors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'} transition-colors`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handlePersonalInfoChange}
                required
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {formErrors.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className={`h-12 border-2 rounded-xl ${formErrors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'} transition-colors`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handlePersonalInfoChange}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {formErrors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number*
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className={`h-12 border-2 rounded-xl ${formErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'} transition-colors`}
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handlePersonalInfoChange}
                required
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {formErrors.phone}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Country*
              </Label>
              <Select onValueChange={handleCountryChange} value={country || undefined}>
                <SelectTrigger className={`h-12 border-2 rounded-xl ${formErrors.country ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'} transition-colors`}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((countryName) => (
                      <SelectItem key={countryName} value={countryName}>
                        {countryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.country && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {formErrors.country}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Project Details</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tell us about your project
            </Label>
            <Textarea
              id="message"
              className="min-h-[120px] border-2 border-slate-200 focus:border-blue-500 rounded-xl resize-none transition-colors"
              placeholder="Describe your project requirements, goals, timeline, and any specific details..."
              value={message}
              onChange={handleMessageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Options */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Project Options</h3>
          </div>
          
          <div className="space-y-6">
            {/* Urgency Toggle */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Priority Level</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">How quickly do you need this completed?</p>
              </div>
              <ToggleSwitch
                id="urgent-mode"
                checked={formData.urgent}
                onCheckedChange={handleUrgentChange}
                leftLabel="Standard"
                rightLabel="Urgent"
                rightColor="text-orange-600"
              />
            </div>

            {/* Document Upload Toggle */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Supporting Documents</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Do you have files to share with us?</p>
              </div>
              <ToggleSwitch
                id="has-document"
                checked={formData.hasDocument}
                onCheckedChange={handleHasDocumentChange}
                leftLabel="No Files"
                rightLabel="Upload Files"
                rightColor="text-green-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      {formData.hasDocument && (
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Upload Documents</h3>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Supported formats: PDF, DOC, DWG, JPG, PNG (Max: 50MB)
            </p>
            
            {formData.documentUrl ? (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-white">{formData.documentName}</p>
                  <p className="text-sm text-green-600">Successfully uploaded</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDocumentUpload("", "")}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
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
                  className={`w-full h-16 border-2 border-dashed rounded-xl transition-all ${
                    formErrors.documentUrl 
                      ? 'border-red-400 hover:border-red-500' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {isUploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-sm font-medium">Click to upload files</span>
                      </>
                    )}
                  </div>
                </Button>
                {formErrors.documentUrl && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {formErrors.documentUrl}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalInfoStep;
