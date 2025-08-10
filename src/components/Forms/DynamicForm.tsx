import React, { useState } from "react";
import { FormField } from "../../types/chat";
import FormFieldComponent from "./FormField";

interface DynamicFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel: string;
  onSubmit: (formData: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  title,
  description,
  fields,
  submitLabel,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation
      if (field.required && (!value || value === "")) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value) return;

      const validation = field.validation;
      if (!validation) return;

      // Pattern validation
      if (validation.pattern && typeof value === "string") {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          newErrors[field.name] =
            validation.custom_message || `${field.label} format is invalid`;
          return;
        }
      }

      // Length validation
      if (typeof value === "string") {
        if (validation.min_length && value.length < validation.min_length) {
          newErrors[
            field.name
          ] = `${field.label} must be at least ${validation.min_length} characters`;
          return;
        }
        if (validation.max_length && value.length > validation.max_length) {
          newErrors[
            field.name
          ] = `${field.label} must not exceed ${validation.max_length} characters`;
          return;
        }
      }

      // Numeric validation
      if (field.type === "number" && typeof value === "number") {
        if (
          validation.min_value !== undefined &&
          value < validation.min_value
        ) {
          newErrors[
            field.name
          ] = `${field.label} must be at least ${validation.min_value}`;
          return;
        }
        if (
          validation.max_value !== undefined &&
          value > validation.max_value
        ) {
          newErrors[
            field.name
          ] = `${field.label} must not exceed ${validation.max_value}`;
          return;
        }
      }

      // Age validation for date fields
      if (field.type === "date" && validation.min_age !== undefined) {
        const birthDate = new Date(value);
        const today = new Date();
        const age =
          today.getFullYear() -
          birthDate.getFullYear() -
          (today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
            ? 1
            : 0);

        if (age < validation.min_age) {
          newErrors[
            field.name
          ] = `You must be at least ${validation.min_age} years old`;
          return;
        }
        if (validation.max_age !== undefined && age > validation.max_age) {
          newErrors[
            field.name
          ] = `Age must not exceed ${validation.max_age} years`;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <FormFieldComponent
            key={field.name}
            field={field}
            value={formData[field.name] || field.default_value || ""}
            error={errors[field.name]}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        ))}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>

      {/* Form Progress Indicator */}
      {fields.length > 0 && (
        <div className="pt-3">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>
              {Object.keys(formData).filter((key) => formData[key]).length} of{" "}
              {fields.filter((f) => f.required).length} required fields
              completed
            </span>
            <span>
              {Math.round(
                (Object.keys(formData).filter((key) => formData[key]).length /
                  fields.filter((f) => f.required).length) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-gray-700 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(
                  (Object.keys(formData).filter((key) => formData[key]).length /
                    fields.filter((f) => f.required).length) *
                    100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
