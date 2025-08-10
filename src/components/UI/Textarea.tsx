import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resizable?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      resizable = true,
      className = "",
      rows = 3,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all";

    const errorClasses = error ? "border-red-300 focus:ring-red-500" : "";
    const resizeClasses = resizable ? "resize-y" : "resize-none";

    const textareaClasses = [
      baseClasses,
      errorClasses,
      resizeClasses,
      className,
    ].join(" ");

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={textareaClasses}
          {...props}
        />

        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
