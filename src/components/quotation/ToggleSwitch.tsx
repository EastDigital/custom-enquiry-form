
import React from "react";
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
  leftColor,
  rightColor,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Left Button */}
      <button
        type="button"
        onClick={() => onCheckedChange(false)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-white",
          !checked
            ? "bg-[#FF6900] shadow"
            : "bg-slate-700 dark:bg-slate-800"
        )}
      >
        {leftLabel}
      </button>

      {/* Right Button */}
      <button
        type="button"
        onClick={() => onCheckedChange(true)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-white",
          checked
            ? "bg-[#FF6900] shadow"
            : "bg-slate-700 dark:bg-slate-800"
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleSwitch;
