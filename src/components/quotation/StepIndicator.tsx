
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <div className="flex-1 flex">
          {Array.from({ length: totalSteps }).map((_, step) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    currentStep === step ? "font-medium" : "text-muted-foreground"
                  } hidden sm:inline`}
                >
                  {step === 0
                    ? "Personal Info"
                    : step === 1
                    ? "Services"
                    : "Summary"}
                </span>
              </div>
              {step < totalSteps - 1 && (
                <div className="flex-1 mx-2 h-0.5 self-center bg-muted">
                  <div
                    className={`h-0.5 bg-primary ${
                      currentStep > step ? "w-full" : "w-0"
                    } transition-all duration-500`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
