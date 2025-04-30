
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ConfirmationMessageProps {
  show: boolean;
  title?: string;
  message?: string;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ 
  show, 
  title = "Quote Request Submitted",
  message = "You will receive email shortly. Check your spam or junk folder if you did not receive it in your Inbox."
}) => {
  if (!show) return null;

  return (
    <Alert className="bg-primary/10 border-primary border-2 shadow-lg animate-in fade-in duration-300">
      <AlertTitle className="text-xl font-bold text-center text-foreground mb-2">
        {title}
      </AlertTitle>
      <AlertDescription className="text-center text-foreground">
        <p className="mb-4 text-lg">
          {message}
        </p>
        <p className="text-sm text-muted-foreground">
          Thank you for submitting your request. Our team is working on it!
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ConfirmationMessage;
