import React, { useState, useEffect } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import InsuranceRequirementsForm from './InsuranceRequirementsForm';
import RiderSelectionForm from './RiderSelectionForm';
import PaymentForm from './PaymentForm';
import { useStore } from '../../store/useStore';

interface FormWizardProps {
  onComplete?: () => void;
  initialStep?: number;
}

const FormWizard: React.FC<FormWizardProps> = ({ onComplete, initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { sessionState } = useStore();

  const steps = [
    {
      id: 'personal_details',
      title: 'Personal Details',
      description: 'Basic information about you',
      component: PersonalDetailsForm
    },
    {
      id: 'insurance_requirements',
      title: 'Insurance Requirements',
      description: 'Coverage and policy details',
      component: InsuranceRequirementsForm
    },
    {
      id: 'rider_selection',
      title: 'Add-on Riders',
      description: 'Optional additional coverage',
      component: RiderSelectionForm
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Complete your purchase',
      component: PaymentForm
    }
  ];

  const handleStepComplete = (stepData: any) => {
    console.log(`Step ${currentStep} completed with data:`, stepData);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    if (onComplete) {
      onComplete();
    }
  };

  // Auto-advance based on session state
  useEffect(() => {
    const stateToStepMap: Record<string, number> = {
      'onboarding': 0,
      'eligibility_check': 0,
      'product_selection': 1,
      'quote_generation': 1,
      'addon_riders': 2,
      'payment_initiated': 3,
    };

    const targetStep = stateToStepMap[sessionState] || 0;
    if (targetStep !== currentStep) {
      setCurrentStep(targetStep);
    }
  }, [sessionState, currentStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Get Your eTouch II Insurance
            </h1>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        {currentStep === 0 && (
          <PersonalDetailsForm
            onComplete={handleStepComplete}
            onNext={handleNext}
          />
        )}
        
        {currentStep === 1 && (
          <InsuranceRequirementsForm
            onComplete={handleStepComplete}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 2 && (
          <RiderSelectionForm
            onComplete={handleStepComplete}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 3 && (
          <PaymentForm
            onComplete={handlePaymentComplete}
            onBack={handleBack}
          />
        )}
      </div>

      {/* Help Section */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors">
          <span className="sr-only">Help</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FormWizard;