import React from 'react';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface PaymentButton {
  id: string;
  label: string;
  type: 'primary' | 'success' | 'danger';
  description: string;
}

interface PaymentButtonsProps {
  title: string;
  description?: string;
  selectedQuote: {
    name: string;
    annual_premium: number;
    sum_assured: number;
    policy_term: number;
  };
  buttons: PaymentButton[];
  onPaymentMethodSelect: (methodId: string) => void;
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  title,
  description,
  selectedQuote,
  buttons,
  onPaymentMethodSelect
}) => {
  const getButtonStyles = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500';
    }
  };

  const getButtonIcon = (type: string, id: string) => {
    if (id === 'proceed_payment') return <CreditCard size={18} />;
    if (id === 'simulate_success') return <CheckCircle size={18} />;
    if (id === 'simulate_failure') return <XCircle size={18} />;
    return <CreditCard size={18} />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>

      {/* Selected Quote Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Selected Plan</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 dark:text-blue-300">Plan:</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">{selectedQuote.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-800 dark:text-blue-300">Annual Premium:</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">₹{selectedQuote.annual_premium?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-800 dark:text-blue-300">Coverage:</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">₹{selectedQuote.sum_assured?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-800 dark:text-blue-300">Policy Term:</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">{selectedQuote.policy_term} years</span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Choose Payment Method:</h4>
        <div className="space-y-3">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => onPaymentMethodSelect(button.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${getButtonStyles(button.type)} hover:scale-[1.02] hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                {getButtonIcon(button.type, button.id)}
                <div className="text-left">
                  <div className="font-semibold">{button.label}</div>
                  <div className="text-sm opacity-90">{button.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2">
          <div className="text-gray-500 dark:text-gray-400 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your payment information is secured with bank-grade encryption. We do not store your payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentButtons;