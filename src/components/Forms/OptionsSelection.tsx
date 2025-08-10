import { Check } from "lucide-react";
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface OptionsSelectionProps {
  title: string;
  description?: string;
  options: Option[];
  selectionType: "single" | "multiple";
  onSelect: (selected: string | string[]) => void;
}

const OptionsSelection: React.FC<OptionsSelectionProps> = ({
  title,
  description,
  options,
  selectionType,
  onSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (optionValue: string) => {
    let newSelected: string[];

    if (selectionType === "single") {
      newSelected = [optionValue];
      setSelectedOptions(newSelected);
      onSelect(optionValue);
    } else {
      if (selectedOptions.includes(optionValue)) {
        newSelected = selectedOptions.filter((val) => val !== optionValue);
      } else {
        newSelected = [...selectedOptions, optionValue];
      }
      setSelectedOptions(newSelected);
      onSelect(newSelected);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        )}
        {selectionType === "multiple" && (
          <p className="text-xs text-gray-600 mt-2">
            You can select multiple options
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.value);

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-gray-900 bg-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-white" />}
                    </div>

                    {/* Label */}
                    <h4
                      className={`font-medium text-sm ${
                        isSelected ? "text-gray-900" : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </h4>
                  </div>

                  {/* Description */}
                  {option.description && (
                    <p
                      className={`text-sm mt-2 ml-7 ${
                        isSelected ? "text-gray-700" : "text-gray-600"
                      }`}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedOptions.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {selectionType === "single"
              ? "Selected:"
              : `Selected (${selectedOptions.length}):`}
          </p>
          <div className="mt-2">
            {selectedOptions.map((value, index) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs mr-2 mt-1"
                >
                  {option?.label || value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsSelection;
