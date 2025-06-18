
import React from "react";
import { CheckCircle, User, Layers, FileText } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { icon: User, label: "Personal Info", description: "Contact details" },
    { icon: Layers, label: "Services", description: "Select services" },
    { icon: FileText, label: "Summary", description: "Review & submit" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="mt-3 text-center hidden sm:block">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                    isCompleted ? 'text-green-600 dark:text-green-400' : 
                    'text-slate-500 dark:text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-slate-200 dark:bg-slate-700 relative">
                    <div 
                      className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ${
                        currentStep > index ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
