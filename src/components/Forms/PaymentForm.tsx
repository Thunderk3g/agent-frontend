import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

interface PaymentFormProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onComplete, onBack }) => {
  const { 
    personalDetails, 
    quoteDetails, 
    riderSelections, 
    updatePaymentDetails 
  } = useStore();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment methods available
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      popular: true,
      processing_time: 'Instant'
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      description: 'All major banks supported',
      icon: '💸',
      popular: false,
      processing_time: 'Instant'
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      description: '50+ banks supported',
      icon: '🏦',
      popular: true,
      processing_time: 'Instant'
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm',
      icon: '📱',
      popular: true,
      processing_time: 'Instant'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'Paytm, Amazon Pay',
      icon: '👛',
      popular: false,
      processing_time: 'Instant'
    }
  ];

  const calculateTotalAmount = () => {
    const age = parseInt(personalDetails.age || '30');
    const coverage = parseInt(quoteDetails.sumAssured || '10000000');
    const term = parseInt(quoteDetails.policyTerm_years || '20');
    const isMale = personalDetails.gender === 'male';
    const isSmoker = personalDetails.tobaccoUser;

    // Base premium calculation
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

    // Add rider premiums
    const riderPremium = (riderSelections || []).reduce((sum: number, rider: any) => 
      sum + (rider.premium || 0), 0);

    const subtotal = basePremium + riderPremium;
    const taxes = subtotal * 0.18; // 18% GST
    const total = subtotal + taxes;

    return {
      basePremium: Math.round(basePremium),
      riderPremium: Math.round(riderPremium),
      subtotal: Math.round(subtotal),
      taxes: Math.round(taxes),
      total: Math.round(total)
    };
  };

  const validatePaymentMethod = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initiatePayment = async () => {
    if (!validatePaymentMethod()) return;

    setPaymentProcessing(true);
    updatePaymentDetails({ paymentMethod: selectedMethod, status: 'processing' });

    try {
      // Simulate API call to backend payment service
      const paymentData = {
        session_id: 'current-session-id', // Would come from session context
        amount: calculateTotalAmount().total,
        payment_method: selectedMethod,
        customer_details: personalDetails,
        policy_details: {
          variant: quoteDetails.selectedVariant,
          sum_assured: quoteDetails.sumAssured,
          policy_term: quoteDetails.policyTerm_years,
          riders: riderSelections
        }
      };
      
      // Use paymentData for the API call (simulated here)
      console.log('Payment data:', paymentData);

      // Mock API response - in real implementation, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPaymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Simulate 85% success rate
      const success = Math.random() < 0.85;
      
      if (success) {
        setPaymentId(mockPaymentId);
        setPaymentSuccess(true);
        updatePaymentDetails({ 
          paymentMethod: selectedMethod, 
          status: 'success',
          paymentId: mockPaymentId,
          transactionId: `TXN${Date.now()}`,
          policyNumber: `ETOUCH${Date.now().toString().slice(-8)}`
        });
        
        onComplete({
          paymentId: mockPaymentId,
          paymentMethod: selectedMethod,
          amount: calculateTotalAmount().total,
          status: 'success'
        });
      } else {
        throw new Error('Payment failed. Please try again.');
      }

    } catch (error) {
      setErrors({ payment: 'Payment failed. Please try again or choose a different payment method.' });
      updatePaymentDetails({ paymentMethod: selectedMethod, status: 'failed' });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const amounts = calculateTotalAmount();

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your insurance policy has been successfully purchased and is now active.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Payment ID:</span>
                <div className="font-medium text-green-900">{paymentId}</div>
              </div>
              <div>
                <span className="text-green-700">Amount Paid:</span>
                <div className="font-medium text-green-900">{formatCurrency(amounts.total)}</div>
              </div>
              <div>
                <span className="text-green-700">Policy Number:</span>
                <div className="font-medium text-green-900">ETOUCH{Date.now().toString().slice(-8)}</div>
              </div>
              <div>
                <span className="text-green-700">Status:</span>
                <div className="font-medium text-green-900">Active</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Download Policy Document
            </button>
            <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              Email Policy Details
            </button>
            <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              Contact Customer Care
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600">
          Complete your insurance purchase with secure payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label key={method.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border rounded-lg transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          {method.popular && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{method.processing_time}</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          {errors.paymentMethod && (
            <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
          )}
          
          {errors.payment && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.payment}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <div className="font-medium text-gray-900">
                  {quoteDetails.selectedVariant?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(parseInt(quoteDetails.sumAssured || '0'))} coverage
                </div>
                <div className="text-sm text-gray-600">
                  {quoteDetails.policyTerm_years} years term
                </div>
              </div>
              
              {riderSelections && riderSelections.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Add-on Riders:</div>
                  {riderSelections.map((rider: any) => (
                    <div key={rider.id} className="text-sm text-gray-600">
                      {rider.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <hr className="border-gray-300 mb-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Premium</span>
                <span className="text-gray-900">{formatCurrency(amounts.basePremium)}</span>
              </div>
              
              {amounts.riderPremium > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rider Premium</span>
                  <span className="text-gray-900">{formatCurrency(amounts.riderPremium)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(amounts.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="text-gray-900">{formatCurrency(amounts.taxes)}</span>
              </div>
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(amounts.total)}</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                {quoteDetails.frequency === 'yearly' ? 'per year' : 
                 quoteDetails.frequency === 'half_yearly' ? 'per 6 months' :
                 quoteDetails.frequency === 'quarterly' ? 'per quarter' : 'per month'}
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={initiatePayment}
                disabled={!selectedMethod || paymentProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedMethod && !paymentProcessing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {paymentProcessing ? 'Processing...' : `Pay ${formatCurrency(amounts.total)}`}
              </button>
              
              <button
                type="button"
                onClick={onBack}
                disabled={paymentProcessing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back to Rider Selection
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="mr-1">🔒</span>
                Secured by 256-bit SSL encryption
              </div>
              <div>Your payment information is safe and secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;