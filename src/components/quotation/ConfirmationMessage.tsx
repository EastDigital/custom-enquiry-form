
import React from "react";
import { CheckCircle, Mail, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ConfirmationMessageProps {
  show: boolean;
  title?: string;
  message?: string;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ 
  show, 
  title = "Request Submitted Successfully",
  message = "Thank you for your submission. We'll be in touch soon!"
}) => {
  if (!show) return null;

  return (
    <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </h2>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-md mx-auto">
            {message}
          </p>
          
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4" />
              Check your email
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              Response within 24h
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-full text-sm text-slate-600 dark:text-slate-300 mt-6">
            <Sparkles className="w-4 h-4" />
            Our team is reviewing your request
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmationMessage;
