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
  leftColor = "text-slate-600",
  rightColor = "text-slate-600",
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Tailored Proposal Button */}
      <button
        type="button"
        onClick={() => onCheckedChange(false)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          !checked
            ? "text-white bg-[#FF6900] shadow"
            : "text-slate-600 bg-slate-100 dark:bg-slate-700"
        )}
      >
        {leftLabel}
      </button>

      {/* Instant Proposal Button */}
      <button
        type="button"
        onClick={() => onCheckedChange(true)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          checked
            ? "text-white bg-[#FF6900] shadow"
            : "text-slate-600 bg-slate-100 dark:bg-slate-700"
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleSwitch;
