
import React from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  leftLabel,
  rightLabel,
  leftColor = "text-muted-foreground",
  rightColor = "text-primary"
}) => {
  // Check if this is the primary inquiry mode toggle based on the id
  const isPrimaryToggle = id === "inquiry-mode-toggle";
  
  return (
    <div className={cn(
      "flex items-center gap-3",
      isPrimaryToggle && "bg-slate-800 p-2 px-3 rounded-full shadow-lg border border-slate-700"
    )}>
      <span 
        className={cn(
          "text-sm transition-colors cursor-pointer", 
          !checked ? leftColor : "text-muted-foreground",
          isPrimaryToggle && !checked && "font-semibold",
          isPrimaryToggle && "px-2"
        )}
        onClick={() => onCheckedChange(false)}
      >
        {leftLabel}
      </span>
      
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        )}
      >
        {checked ? (
          <ToggleRight className={cn(
            "h-7 w-7",
            isPrimaryToggle ? "text-purple-400" : "text-primary"
          )} />
        ) : (
          <ToggleLeft className={cn(
            "h-7 w-7",
            isPrimaryToggle ? "text-purple-400" : "text-muted-foreground"
          )} />
        )}
      </button>
      
      <span 
        className={cn(
          "text-sm transition-colors cursor-pointer", 
          checked ? rightColor : "text-muted-foreground",
          isPrimaryToggle && checked && "font-semibold",
          isPrimaryToggle && "px-2"
        )}
        onClick={() => onCheckedChange(true)}
      >
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
