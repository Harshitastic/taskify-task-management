import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white dark:bg-[#15161e] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-650",
            {
              "border-rose-500 focus:ring-rose-500/20": error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
