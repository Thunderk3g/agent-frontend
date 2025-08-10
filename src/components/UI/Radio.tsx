import React, { forwardRef } from "react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  options: RadioOption[];
  label?: string;
  error?: string;
  orientation?: "vertical" | "horizontal";
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      options,
      label,
      error,
      orientation = "vertical",
      className = "",
      ...props
    },
    ref
  ) => {
    const containerClasses =
      orientation === "horizontal" ? "flex gap-6" : "space-y-3";

    return (
      <div className="space-y-2">
        {label && (
          <fieldset>
            <legend className="text-sm font-medium text-gray-900">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </legend>
          </fieldset>
        )}

        <div className={containerClasses}>
          {options.map((option, index) => (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  value={option.value}
                  className={`w-4 h-4 text-gray-600 bg-white border-gray-300 focus:ring-gray-500 focus:ring-2 ${
                    error ? "border-red-300" : ""
                  } ${className}`}
                  {...props}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-gray-900">
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
