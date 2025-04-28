
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ConfirmationMessageProps {
  show: boolean;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Alert className="bg-primary/10 border-primary border-2 shadow-lg animate-in fade-in duration-300">
      <AlertTitle className="text-xl font-bold text-center text-foreground mb-2">
        Quote Request Submitted
      </AlertTitle>
      <AlertDescription className="text-center text-foreground">
        <p className="mb-4 text-lg">
          You will receive email shortly. Check your spam or junk folder if you did not receive it in your Inbox.
        </p>
        <p className="text-sm text-muted-foreground">
          Thank you for submitting your quote request. Our team is working on it!
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ConfirmationMessage;
