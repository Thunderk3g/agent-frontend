import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface OptionsSelectionProps {
  title: string;
  description?: string;
  options: Option[];
  selectionType: 'single' | 'multiple';
  onSelect: (selected: string | string[]) => void;
}

const OptionsSelection: React.FC<OptionsSelectionProps> = ({
  title,
  description,
  options,
  selectionType,
  onSelect
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (optionValue: string) => {
    let newSelected: string[];

    if (selectionType === 'single') {
      newSelected = [optionValue];
      setSelectedOptions(newSelected);
      onSelect(optionValue);
    } else {
      if (selectedOptions.includes(optionValue)) {
        newSelected = selectedOptions.filter(val => val !== optionValue);
      } else {
        newSelected = [...selectedOptions, optionValue];
      }
      setSelectedOptions(newSelected);
      onSelect(newSelected);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        )}
        {selectionType === 'multiple' && (
          <p className="text-xs text-blue-600 mt-1">You can select multiple options</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.value);
          
          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    
                    {/* Label */}
                    <h4 className={`font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h4>
                  </div>
                  
                  {/* Description */}
                  {option.description && (
                    <p className={`text-sm mt-2 ml-8 ${
                      isSelected ? 'text-blue-700' : 'text-gray-600'
                    }`}>
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
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800">
            {selectionType === 'single' 
              ? 'Selected:' 
              : `Selected (${selectedOptions.length}):`
            }
          </p>
          <div className="mt-1">
            {selectedOptions.map((value, index) => {
              const option = options.find(opt => opt.value === value);
              return (
                <span
                  key={index}
                  className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-2 mt-1"
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