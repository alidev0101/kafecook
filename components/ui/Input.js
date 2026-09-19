import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(function Input(
  { className, label, error, hint, startIcon, endIcon, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 hover:border-coffee-300",
            startIcon && "pr-10",
            endIcon && "pl-10",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

export default Input;
