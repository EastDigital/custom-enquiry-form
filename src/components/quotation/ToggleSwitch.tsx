import React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  leftLabel: string;
  rightLabel: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  leftLabel,
  rightLabel,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Labels */}
      <span className="text-sm font-medium text-white">{leftLabel}</span>

      {/* Switch Container */}
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative w-20 h-10 rounded-full bg-white/10 backdrop-blur-lg shadow-inner border border-white/20 transition-all duration-300 ease-in-out",
          checked ? "bg-[#FF6900]/30" : "bg-slate-300/20"
        )}
      >
        {/* Sliding Head (Thumb) */}
        <span
          className={cn(
            "absolute top-1 left-1 h-8 w-8 rounded-full bg-white bg-opacity-70 backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out border border-white/30",
            checked ? "translate-x-10 bg-[#FF6900]" : "translate-x-0"
          )}
        />
      </button>

      <span className="text-sm font-medium text-white">{rightLabel}</span>
    </div>
  );
};

export default ToggleSwitch;
