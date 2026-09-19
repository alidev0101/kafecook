import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(function Input(
  { className, label, error, hint, startIcon, endIcon, required, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          required={required}
          className={cn(
            "w-full h-11 px-4 rounded-xl border bg-background text-foreground text-sm",
            "placeholder:text-muted-foreground",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input hover:border-coffee-300 dark:hover:border-coffee-700",
            startIcon && "pr-10",
            endIcon   && "pl-10",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
});

export default Input;
