import { CreditCard, ExternalLink, Lock, Shield } from "lucide-react";
import React from "react";

interface PaymentDetails {
  amount: number;
  currency: string;
  premium_frequency: string;
  variant_name: string;
  sum_assured: number;
  policy_term: number;
  premium_paying_term: number;
}

interface PaymentRedirectProps {
  title: string;
  description?: string;
  paymentDetails: PaymentDetails;
  redirectUrl: string;
  onProceedToPayment: () => void;
}

const PaymentRedirect: React.FC<PaymentRedirectProps> = ({
  title,
  description,
  paymentDetails,
  redirectUrl,
  onProceedToPayment,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentClick = () => {
    // In a real application, this would redirect to the actual payment gateway
    window.open(redirectUrl, "_blank");
    onProceedToPayment();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-gray-700" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>
        {description && <p className="text-gray-600 mt-3">{description}</p>}
      </div>

      {/* Policy Summary Card */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Policy Summary
        </h4>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Plan:</span>
            <p className="font-medium text-gray-900">
              {paymentDetails.variant_name}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Coverage:</span>
            <p className="font-medium text-gray-900">
              {formatCurrency(paymentDetails.sum_assured)}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Policy Term:</span>
            <p className="font-medium text-gray-900">
              {paymentDetails.policy_term} years
            </p>
          </div>
          <div>
            <span className="text-gray-600">Premium Paying Term:</span>
            <p className="font-medium text-gray-900">
              {paymentDetails.premium_paying_term} years
            </p>
          </div>
        </div>

        {/* Payment Amount Highlight */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-600 text-sm">
                {paymentDetails.premium_frequency.charAt(0).toUpperCase() +
                  paymentDetails.premium_frequency.slice(1)}{" "}
                Premium
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentDetails.amount)}
              </p>
            </div>
            <div className="text-right">
              <CreditCard className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Security & Trust Indicators */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Lock className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-900">Secure Payment</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 256-bit SSL encryption</li>
          <li>• PCI DSS compliant payment gateway</li>
          <li>• Your payment details are never stored</li>
          <li>• Instant policy activation upon payment</li>
        </ul>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        <h5 className="font-medium text-gray-900">Accepted Payment Methods:</h5>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
            Credit/Debit Cards
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-purple-500 rounded-sm"></div>
            UPI Payments
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
            Net Banking
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-green-500 rounded-sm"></div>
            Digital Wallets
          </div>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <div className="pt-4">
        <button
          onClick={handlePaymentClick}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-medium text-lg transition-all flex items-center justify-center gap-3"
        >
          <CreditCard className="w-5 h-5" />
          Pay {formatCurrency(paymentDetails.amount)} Securely
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Support Information */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Questions about your payment? Our agent Rajesh is here to help!</p>
        <p className="font-medium">
          Call: 1800 209 7272 | Email: customercare@bajajallianz.co.in
        </p>
      </div>

      {/* Terms */}
      <div className="text-xs text-gray-400 text-center">
        By proceeding with payment, you agree to our terms and conditions. Your
        policy will be active immediately upon successful payment.
      </div>
    </div>
  );
};

export default PaymentRedirect;
