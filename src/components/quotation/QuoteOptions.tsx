
import React from "react";

interface QuoteOptionsProps {
  submitting: boolean;
  countdown: number;
  handleSubmit: (paidOption: boolean) => void;
}

const QuoteOptions: React.FC<QuoteOptionsProps> = ({ submitting, countdown, handleSubmit }) => {
  if (submitting) {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse-light mb-4">
          <h3 className="text-xl font-semibold mb-2">Processing your quote...</h3>
          
          {countdown > 0 && (
            <div className="mt-4">
              <p>Your quote will be delivered in:</p>
              <p className="text-3xl font-bold text-primary">{countdown} seconds</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 border rounded-md">
      <h3 className="text-xl font-semibold mb-4 text-center">Choose an Option</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div 
          className="p-4 border rounded-md hover:shadow-md transition-shadow cursor-pointer bg-secondary/30"
          onClick={() => handleSubmit(false)}
        >
          <div className="text-center mb-3">
            <span className="inline-block p-2 rounded-full bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
          </div>
          <h4 className="font-semibold text-center">Free Quote</h4>
          <p className="text-center text-sm text-muted-foreground">
            Wait 10 minutes to receive your quote via email
          </p>
        </div>
        
        <div 
          className="p-4 border rounded-md hover:shadow-md transition-shadow cursor-pointer bg-primary/10"
          onClick={() => handleSubmit(true)}
        >
          <div className="text-center mb-3">
            <span className="inline-block p-2 rounded-full bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
            </span>
          </div>
          <h4 className="font-semibold text-center">Instant Quote - $10</h4>
          <p className="text-center text-sm text-muted-foreground">
            Get your detailed quote delivered instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteOptions;
