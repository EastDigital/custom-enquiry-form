
import React from "react";
import { cn } from "@/lib/utils";

interface ImprovedToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const ImprovedToggleSwitch: React.FC<ImprovedToggleSwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-8"
  };
  
  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5", 
    lg: "w-7 h-7"
  };
  
  const translateClasses = {
    sm: "translate-x-4",
    md: "translate-x-5",
    lg: "translate-x-6"
  };

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-white",
          sizeClasses[size],
          checked 
            ? "bg-gradient-to-r from-brand-orange to-brand-dark-orange shadow-lg" 
            : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out transform",
            thumbSizeClasses[size],
            checked 
              ? `${translateClasses[size]} shadow-xl` 
              : "translate-x-0"
          )}
        />
      </button>
      
      <div className="flex-1">
        <label 
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
          onClick={() => onCheckedChange(!checked)}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImprovedToggleSwitch;
