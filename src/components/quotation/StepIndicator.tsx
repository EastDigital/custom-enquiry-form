
import React from "react";
import { CheckCircle, Circle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { label: "Personal Info", step: 0 },
    { label: "Services", step: 1 },
    { label: "Summary", step: 2 },
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                currentStep >= step.step
                  ? "bg-brand-orange border-brand-orange text-white"
                  : "border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500"
              }`}
            >
              {currentStep > step.step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                currentStep >= step.step
                  ? "text-brand-orange"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-4 transition-all duration-200 ${
                currentStep > step.step
                  ? "bg-brand-orange"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
