import { Check } from "lucide-react";
import React, { forwardRef } from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = "", ...props }, ref) => {
    const checkboxClasses = [
      "w-4 h-4 text-gray-600 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2",
      error ? "border-red-300" : "",
      className,
    ].join(" ");

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5 relative">
            <input
              ref={ref}
              type="checkbox"
              className={checkboxClasses}
              {...props}
            />
            {props.checked && (
              <Check className="w-3 h-3 text-white absolute inset-0 m-auto pointer-events-none" />
            )}
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label className="font-medium text-gray-900">
                  {label}
                  {props.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}
              {description && <p className="text-gray-500">{description}</p>}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600 ml-7">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
