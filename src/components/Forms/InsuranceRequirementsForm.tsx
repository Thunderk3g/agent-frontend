import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';

interface InsuranceRequirementsFormProps {
  onComplete: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const InsuranceRequirementsForm: React.FC<InsuranceRequirementsFormProps> = ({ 
  onComplete, 
  onNext, 
  onBack 
}) => {
  const { quoteDetails, updateQuoteDetails, personalDetails, syncWithBackend } = useStore();
  const [formData, setFormData] = useState({
    sumAssured: quoteDetails.sumAssured || '',
    policyTerm_years: quoteDetails.policyTerm_years || '',
    premiumPayingTerm_years: quoteDetails.premiumPayingTerm_years || '',
    frequency: quoteDetails.frequency || 'yearly',
    selectedVariant: quoteDetails.selectedVariant || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [estimatedPremium, setEstimatedPremium] = useState<number | null>(null);

  // Insurance variants
  const variants = [
    {
      id: 'life_shield',
      name: 'Life Shield',
      description: 'Basic term insurance with death benefit and terminal illness cover',
      features: ['Death Benefit', 'Terminal Illness Cover', 'Waiver of Premium on ATPD/TI'],
      bestFor: 'Essential protection at affordable premium',
      color: 'blue'
    },
    {
      id: 'life_shield_plus',
      name: 'Life Shield Plus',
      description: 'Comprehensive coverage with accidental death benefit',
      features: ['All Life Shield benefits', 'Accidental Death Benefit (ADB)', 'Enhanced Protection'],
      bestFor: 'Complete family protection',
      color: 'green'
    },
    {
      id: 'life_shield_rop',
      name: 'Life Shield ROP',
      description: 'Return of premium on maturity if you survive the policy term',
      features: ['All Life Shield benefits', 'Return of Premium', 'Maturity Benefit'],
      bestFor: 'Protection with money-back guarantee',
      color: 'purple'
    }
  ];

  // Coverage amount options
  const coverageOptions = [
    { value: 5000000, label: '₹50 Lakh', popular: false },
    { value: 10000000, label: '₹1 Crore', popular: true },
    { value: 15000000, label: '₹1.5 Crore', popular: false },
    { value: 20000000, label: '₹2 Crore', popular: true },
    { value: 30000000, label: '₹3 Crore', popular: false },
    { value: 50000000, label: '₹5 Crore', popular: false },
  ];

  // Policy term options based on age
  const getPolicyTermOptions = () => {
    const age = parseInt(personalDetails.age || '30');
    const maxAge = 85;
    const maxTerm = Math.min(50, maxAge - age);
    
    const options = [];
    for (let term = 10; term <= maxTerm; term += 5) {
      options.push({
        value: term,
        label: `${term} years`,
        maturityAge: age + term
      });
    }
    return options;
  };

  // Premium frequency options
  const frequencyOptions = [
    { value: 'yearly', label: 'Yearly', discount: '0%', factor: 1.0 },
    { value: 'half_yearly', label: 'Half-yearly', discount: '0%', factor: 0.51 },
    { value: 'quarterly', label: 'Quarterly', discount: '0%', factor: 0.26 },
    { value: 'monthly', label: 'Monthly', discount: '0%', factor: 0.0875 },
  ];

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Coverage amount validation
    if (!formData.sumAssured) {
      newErrors.sumAssured = 'Please select coverage amount';
    } else if (parseInt(formData.sumAssured) < 5000000) {
      newErrors.sumAssured = 'Minimum coverage is ₹50 lakh';
    }

    // Policy term validation
    if (!formData.policyTerm_years) {
      newErrors.policyTerm_years = 'Please select policy term';
    }

    // Premium paying term validation
    if (!formData.premiumPayingTerm_years) {
      newErrors.premiumPayingTerm_years = 'Please select premium paying term';
    } else if (parseInt(formData.premiumPayingTerm_years) > parseInt(formData.policyTerm_years)) {
      newErrors.premiumPayingTerm_years = 'Premium paying term cannot exceed policy term';
    }

    // Variant selection validation
    if (!formData.selectedVariant) {
      newErrors.selectedVariant = 'Please select an insurance variant';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  }, [formData]);

  const calculateEstimatedPremium = useCallback(() => {
    if (!formData.sumAssured || !formData.policyTerm_years || !formData.selectedVariant) {
      setEstimatedPremium(null);
      return;
    }

    const age = parseInt(personalDetails.age || '30');
    const coverage = parseInt(formData.sumAssured);
    const term = parseInt(formData.policyTerm_years);
    const isMale = personalDetails.gender === 'male';
    const isSmoker = personalDetails.tobaccoUser;

    // Base premium calculation (simplified)
    let basePremium = coverage * 0.002; // 0.2% of sum assured as base

    // Age factor
    if (age < 30) basePremium *= 0.8;
    else if (age < 40) basePremium *= 1.0;
    else if (age < 50) basePremium *= 1.5;
    else basePremium *= 2.0;

    // Gender factor
    if (!isMale) basePremium *= 0.9; // Female discount

    // Smoker factor
    if (isSmoker) basePremium *= 1.5;

    // Term factor
    basePremium *= (term / 20);

    // Variant factor
    switch (formData.selectedVariant) {
      case 'life_shield_plus':
        basePremium *= 1.2;
        break;
      case 'life_shield_rop':
        basePremium *= 2.5;
        break;
      default:
        basePremium *= 1.0;
    }

    // Frequency factor
    const frequencyFactor = frequencyOptions.find(f => f.value === formData.frequency)?.factor || 1.0;
    if (formData.frequency !== 'yearly') {
      basePremium = basePremium * frequencyFactor;
    }

    setEstimatedPremium(Math.round(basePremium));
  }, [formData, personalDetails]);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };

    // Auto-set premium paying term equal to policy term for simplification
    if (field === 'policyTerm_years') {
      updatedData.premiumPayingTerm_years = value;
    }

    setFormData(updatedData);
    updateQuoteDetails(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Sync with backend session to ensure unified memory state
      await syncWithBackend();
      onComplete(formData);
      onNext();
    }
  };

  useEffect(() => {
    validateForm();
    calculateEstimatedPremium();
  }, [formData, personalDetails, calculateEstimatedPremium, validateForm]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Insurance Requirements</h2>
        <p className="text-gray-600">Choose your coverage amount, policy term, and insurance variant.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Coverage Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Coverage Amount *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {coverageOptions.map((option) => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="sumAssured"
                  value={option.value.toString()}
                  checked={formData.sumAssured === option.value.toString()}
                  onChange={(e) => handleInputChange('sumAssured', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border rounded-lg text-center transition-all ${
                  formData.sumAssured === option.value.toString()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="font-semibold">{option.label}</div>
                  {option.popular && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">
                      Popular
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
          {errors.sumAssured && <p className="mt-2 text-sm text-red-600">{errors.sumAssured}</p>}
        </div>

        {/* Policy Term */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Policy Term *
            </label>
            <select
              value={formData.policyTerm_years}
              onChange={(e) => handleInputChange('policyTerm_years', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.policyTerm_years 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="">Select policy term</option>
              {getPolicyTermOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} (Maturity at {option.maturityAge})
                </option>
              ))}
            </select>
            {errors.policyTerm_years && <p className="mt-1 text-sm text-red-600">{errors.policyTerm_years}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Premium Payment Frequency *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {frequencyOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={formData.frequency === option.value}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 border rounded-lg text-center transition-colors text-sm ${
                    formData.frequency === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="font-medium">{option.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Insurance Variants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Insurance Variant *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <label key={variant.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="selectedVariant"
                  value={variant.id}
                  checked={formData.selectedVariant === variant.id}
                  onChange={(e) => handleInputChange('selectedVariant', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-5 border rounded-lg transition-all ${
                  formData.selectedVariant === variant.id
                    ? `border-${variant.color}-500 bg-${variant.color}-50`
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{variant.name}</h3>
                    {variant.id === 'life_shield_plus' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{variant.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1 mb-3">
                    {variant.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className={`text-xs font-medium text-${variant.color}-700`}>
                    {variant.bestFor}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.selectedVariant && <p className="mt-2 text-sm text-red-600">{errors.selectedVariant}</p>}
        </div>

        {/* Premium Estimate */}
        {estimatedPremium && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Estimated Premium</h3>
                <p className="text-sm text-blue-700">
                  Based on your profile and selections
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(estimatedPremium)}
                </div>
                <div className="text-sm text-blue-700">
                  {formData.frequency === 'yearly' ? 'per year' : 
                   formData.frequency === 'half_yearly' ? 'per 6 months' :
                   formData.frequency === 'quarterly' ? 'per quarter' : 'per month'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Personal Details
          </button>
          
          <button
            type="submit"
            disabled={!isValid}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Rider Selection
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceRequirementsForm;