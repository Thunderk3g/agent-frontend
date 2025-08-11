import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';

interface RiderSelectionFormProps {
  onComplete: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const RiderSelectionForm: React.FC<RiderSelectionFormProps> = ({ 
  onComplete, 
  onNext, 
  onBack 
}) => {
  const { riderSelections, updateRiderSelections, quoteDetails, personalDetails } = useStore();
  const [selectedRiders, setSelectedRiders] = useState(riderSelections || []);
  const [estimatedTotal, setEstimatedTotal] = useState<number>(0);

  // Available riders
  const availableRiders = [
    {
      id: 'family_protect',
      name: 'Family Protect Rider',
      uin: '116B056V01',
      description: 'Provides life insurance coverage for your spouse and children',
      benefits: [
        'Spouse coverage: 50% of base sum assured',
        'Child coverage: 25% of base sum assured per child',
        'Coverage for up to 4 children',
        'Premium waiver on critical illness'
      ],
      eligibility: {
        spouse_age_range: '18-55 years',
        child_age_range: '90 days - 25 years'
      },
      premium_factor: 0.15, // 15% of base premium
      popular: true
    },
    {
      id: 'critical_illness',
      name: 'Critical Illness Benefit Rider',
      uin: '116B058V01',
      description: 'Financial protection against 37 critical illnesses',
      benefits: [
        'Coverage for 37 critical illnesses',
        'Lump sum benefit on diagnosis',
        'Coverage up to ₹1 crore',
        'Independent of base policy claim'
      ],
      coverage_illnesses: [
        'Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure',
        'Major Organ Transplant', 'Paralysis', 'Multiple Sclerosis',
        'Alzheimer\'s Disease', 'Parkinson\'s Disease'
      ],
      premium_factor: 0.25, // 25% of base premium
      popular: false
    }
  ];

  const calculateRiderPremium = (rider: any, basePremium: number) => {
    const age = parseInt(personalDetails.age || '30');
    const sumAssured = parseInt(quoteDetails.sumAssured || '10000000');
    
    let riderPremium = basePremium * rider.premium_factor;
    
    // Age adjustment
    if (age > 45) riderPremium *= 1.3;
    else if (age > 35) riderPremium *= 1.1;
    
    // Sum assured adjustment for critical illness
    if (rider.id === 'critical_illness') {
      const ciCoverage = Math.min(sumAssured, 10000000); // Max 1 crore
      riderPremium = (ciCoverage / 10000000) * riderPremium;
    }
    
    return Math.round(riderPremium);
  };

  const getBasePremium = useCallback(() => {
    const age = parseInt(personalDetails.age || '30');
    const coverage = parseInt(quoteDetails.sumAssured || '10000000');
    const term = parseInt(quoteDetails.policyTerm_years || '20');
    const isMale = personalDetails.gender === 'male';
    const isSmoker = personalDetails.tobaccoUser;

    // Simplified base premium calculation
    let basePremium = coverage * 0.002;

    if (age < 30) basePremium *= 0.8;
    else if (age < 40) basePremium *= 1.0;
    else if (age < 50) basePremium *= 1.5;
    else basePremium *= 2.0;

    if (!isMale) basePremium *= 0.9;
    if (isSmoker) basePremium *= 1.5;
    basePremium *= (term / 20);

    switch (quoteDetails.selectedVariant) {
      case 'life_shield_plus':
        basePremium *= 1.2;
        break;
      case 'life_shield_rop':
        basePremium *= 2.5;
        break;
      default:
        basePremium *= 1.0;
    }

    return Math.round(basePremium);
  }, [personalDetails, quoteDetails]);

  const handleRiderToggle = (riderId: string) => {
    const rider = availableRiders.find(r => r.id === riderId);
    if (!rider) return;

    const isCurrentlySelected = selectedRiders.some(r => r.id === riderId);
    
    let updatedRiders;
    if (isCurrentlySelected) {
      updatedRiders = selectedRiders.filter(r => r.id !== riderId);
    } else {
      const basePremium = getBasePremium();
      const riderPremium = calculateRiderPremium(rider, basePremium);
      
      updatedRiders = [...selectedRiders, {
        id: rider.id,
        name: rider.name,
        uin: rider.uin,
        premium: riderPremium,
        selected: true
      }];
    }
    
    setSelectedRiders(updatedRiders);
    updateRiderSelections(updatedRiders);
  };

  const calculateTotalPremium = useCallback(() => {
    const basePremium = getBasePremium();
    const riderPremiums = selectedRiders.reduce((sum, rider) => sum + (rider.premium || 0), 0);
    return basePremium + riderPremiums;
  }, [selectedRiders, getBasePremium]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ selectedRiders, totalPremium: estimatedTotal });
    onNext();
  };

  useEffect(() => {
    setEstimatedTotal(calculateTotalPremium());
  }, [selectedRiders, quoteDetails, personalDetails, calculateTotalPremium]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const basePremium = getBasePremium();
  // const totalRiderPremium = selectedRiders.reduce((sum, rider) => sum + (rider.premium || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add-on Riders</h2>
        <p className="text-gray-600">
          Enhance your coverage with optional riders. These are additional benefits you can add to your base policy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Coverage Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Your Selected Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Variant:</span>
              <div className="font-medium text-blue-900">
                {quoteDetails.selectedVariant?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Sum Assured:</span>
              <div className="font-medium text-blue-900">
                {formatCurrency(parseInt(quoteDetails.sumAssured || '0'))}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Policy Term:</span>
              <div className="font-medium text-blue-900">{quoteDetails.policyTerm_years} years</div>
            </div>
            <div>
              <span className="text-blue-700">Base Premium:</span>
              <div className="font-medium text-blue-900">{formatCurrency(basePremium)}</div>
            </div>
          </div>
        </div>

        {/* Available Riders */}
        <div className="space-y-4">
          {availableRiders.map((rider) => {
            const isSelected = selectedRiders.some(r => r.id === rider.id);
            const riderPremium = calculateRiderPremium(rider, basePremium);
            
            return (
              <div key={rider.id} className={`border rounded-lg p-6 transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rider.name}</h3>
                      {rider.popular && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">UIN: {rider.uin}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{rider.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rider.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {rider.coverage_illnesses && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Covered Illnesses (Sample):</h4>
                          <div className="flex flex-wrap gap-1">
                            {rider.coverage_illnesses.slice(0, 6).map((illness, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {illness}
                              </span>
                            ))}
                            <span className="text-xs text-gray-500 px-2 py-1">+31 more</span>
                          </div>
                        </div>
                      )}
                      
                      {rider.eligibility && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Eligibility:</h4>
                          <div className="text-sm text-gray-600">
                            {rider.eligibility.spouse_age_range && (
                              <div>Spouse: {rider.eligibility.spouse_age_range}</div>
                            )}
                            {rider.eligibility.child_age_range && (
                              <div>Children: {rider.eligibility.child_age_range}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(riderPremium)}
                      </div>
                      <div className="text-sm text-gray-600">additional premium</div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRiderToggle(rider.id)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isSelected ? 'Remove' : 'Add Rider'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip Option */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">No riders needed?</h3>
              <p className="text-sm text-gray-600">You can always add riders later during policy servicing.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRiders([]);
                updateRiderSelections([]);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
            >
              Skip Riders
            </button>
          </div>
        </div>

        {/* Premium Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Premium Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-700">Base Policy Premium</span>
              <span className="font-medium text-blue-900">{formatCurrency(basePremium)}</span>
            </div>
            
            {selectedRiders.map((rider) => (
              <div key={rider.id} className="flex justify-between">
                <span className="text-blue-700">{rider.name}</span>
                <span className="font-medium text-blue-900">+ {formatCurrency(rider.premium || 0)}</span>
              </div>
            ))}
            
            <hr className="border-blue-200" />
            
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-900">Total Premium</span>
              <span className="font-bold text-blue-900">{formatCurrency(estimatedTotal)}</span>
            </div>
            
            <div className="text-sm text-blue-700">
              {quoteDetails.frequency === 'yearly' ? 'per year' : 
               quoteDetails.frequency === 'half_yearly' ? 'per 6 months' :
               quoteDetails.frequency === 'quarterly' ? 'per quarter' : 'per month'}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Insurance Requirements
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiderSelectionForm;