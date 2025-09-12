import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  required?: boolean;
  error?: string;
  variant?: "auth" | "dashboard" | "clear" | "inline";
  unit?: string | null;
  description?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "dashboard",
      label,
      required,
      error,
      id,
      disabled,
      unit,
      description,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    let inputType = type;
    if (type === "integer" || type === "float") {
      inputType = "number";
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-base font-medium text-primary-500 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type={inputType}
            className={cn(
              "w-full",
              {
                "px-3 bg-transparent placeholder-grey-500 outline-none":
                  variant === "auth",
                "h-10 px-2 border-2 border-grey-200 rounded-lg outline-none focus:border-primary-400 bg-white":
                  variant === "dashboard",
                "border-transparent bg-transparent focus:ring-0 focus:outline-none":
                  variant === "clear",
                "h-8 px-2 border-2 border-grey-200 rounded-lg outline-none focus:border-primary-400 bg-white":
                  variant === "inline",
                "border-red-500 focus:ring-red-500": error,
                "bg-grey-100": disabled,
              },
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {unit && <span className="text-sm text-black">{unit}</span>}
        </div>
        {description && (
          <span className="text-grey-500 text-xs">{description}</span>
        )}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
