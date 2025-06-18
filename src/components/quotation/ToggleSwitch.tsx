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
  rightColor = "text-brand-orange"
}) => {
  const isPrimaryToggle = id === "inquiry-mode-toggle";
  return <div className={cn("flex items-center", isPrimaryToggle ? "bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-sm" : "gap-4")}>
      <button type="button" onClick={() => onCheckedChange(false)} className="">
        {leftLabel}
      </button>
      
      {!isPrimaryToggle && <div className="relative">
          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors">
            <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200", checked ? "translate-x-6" : "translate-x-0")} />
          </div>
        </div>}
      
      <button type="button" onClick={() => onCheckedChange(true)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200", checked ? isPrimaryToggle ? "bg-gradient-to-r from-brand-orange to-brand-dark-orange text-white shadow-md" : `${rightColor} bg-slate-100 dark:bg-slate-700` : "text-slate-400 hover:text-slate-600")}>
        {rightLabel}
      </button>
    </div>;
};
export default ToggleSwitch;