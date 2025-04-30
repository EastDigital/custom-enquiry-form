
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
  return (
    <div className="flex items-center gap-3">
      <span 
        className={cn(
          "text-sm transition-colors cursor-pointer", 
          !checked ? leftColor : "text-muted-foreground"
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
        className="inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
      >
        {checked ? (
          <ToggleRight className="h-7 w-7 text-primary" />
        ) : (
          <ToggleLeft className="h-7 w-7 text-muted-foreground" />
        )}
      </button>
      
      <span 
        className={cn(
          "text-sm transition-colors cursor-pointer", 
          checked ? rightColor : "text-muted-foreground"
        )}
        onClick={() => onCheckedChange(true)}
      >
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
