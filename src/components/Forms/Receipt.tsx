import React from 'react';
import { CheckCircle, Download, User, Shield, Calendar, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

interface ReceiptProps {
  title: string;
  description?: string;
  receiptData: {
    policy_details: {
      policy_number: string;
      policy_holder_name: string;
      plan_name: string;
      sum_assured: number;
      annual_premium: number;
      policy_term: number;
      premium_paying_term: number;
      policy_start_date: string;
      policy_end_date: string;
      payment_frequency: string;
      features: string[];
    };
    customer_details: {
      name: string;
      age: string;
      gender: string;
      mobile: string;
      email: string;
      pin_code: string;
      smoker: string;
    };
    payment_details: {
      transaction_id: string;
      payment_method: string;
      amount_paid: number;
      payment_date: string;
      payment_status: string;
      next_due_date: string;
    };
    company_details: {
      company_name: string;
      policy_type: string;
      irdai_reg_no: string;
      toll_free: string;
      website: string;
    };
    benefit_illustration_pdf: {
      available: boolean;
      filename: string;
      description: string;
    };
  };
  onDownloadPDF?: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  title,
  description,
  receiptData,
  onDownloadPDF
}) => {
  const { policy_details, customer_details, payment_details, company_details, benefit_illustration_pdf } = receiptData;

  return (
    <div className="space-y-6">
      {/* Header with Success Message */}
      <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">{title}</h3>
        {description && <p className="text-green-700 dark:text-green-300">{description}</p>}
        <div className="mt-4 text-sm text-green-700 dark:text-green-300">
          Policy Activated Successfully!
        </div>
      </div>

      {/* Receipt Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
        {/* Company Header */}
        <div className="bg-blue-600 dark:bg-blue-800 text-white p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{company_details.company_name}</h2>
            <p className="text-blue-100 dark:text-blue-200 mt-1">{company_details.policy_type}</p>
            <p className="text-blue-200 dark:text-blue-300 text-sm mt-2">{company_details.irdai_reg_no}</p>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-8">
          {/* Policy Information */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Policy Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Policy Number</label>
                  <p className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded border dark:border-gray-600">{policy_details.policy_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan Name</label>
                  <p className="text-gray-900 dark:text-gray-100">{policy_details.plan_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sum Assured</label>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">₹{policy_details.sum_assured.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Premium</label>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">₹{policy_details.annual_premium.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Policy Term</label>
                  <p className="text-gray-900 dark:text-gray-100">{policy_details.policy_term} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Frequency</label>
                  <p className="text-gray-900 dark:text-gray-100">{policy_details.payment_frequency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Policy Start Date</label>
                  <p className="text-gray-900 dark:text-gray-100">{policy_details.policy_start_date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Policy End Date</label>
                  <p className="text-gray-900 dark:text-gray-100">{policy_details.policy_end_date}</p>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Coverage Features</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {policy_details.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                  <p className="text-gray-900 dark:text-gray-100">{customer_details.name}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</label>
                    <p className="text-gray-900 dark:text-gray-100">{customer_details.age} years</p>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                    <p className="text-gray-900 dark:text-gray-100">{customer_details.gender}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Smoking Status</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    customer_details.smoker === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {customer_details.smoker === 'Yes' ? 'Smoker' : 'Non-Smoker'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Mobile</label>
                    <p className="text-gray-900 dark:text-gray-100">{customer_details.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-gray-100">{customer_details.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">PIN Code</label>
                    <p className="text-gray-900 dark:text-gray-100">{customer_details.pin_code}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Details</h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</label>
                    <p className="font-mono text-sm text-gray-900 dark:text-gray-100">{payment_details.transaction_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</label>
                    <p className="text-gray-900 dark:text-gray-100">{payment_details.payment_method}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Status</label>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {payment_details.payment_status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Paid</label>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{payment_details.amount_paid.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Date</label>
                    <p className="text-gray-900 dark:text-gray-100">{payment_details.payment_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Due Date</label>
                    <p className="text-gray-900 dark:text-gray-100">{payment_details.next_due_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Download PDF Button */}
          {benefit_illustration_pdf.available && (
            <section>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Benefit Illustration Document</h4>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">{benefit_illustration_pdf.description}</p>
                    <button
                      onClick={onDownloadPDF}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      <Download size={20} />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Contact Information */}
          <section className="border-t border-gray-200 pt-6">
            <div className="text-center text-base text-gray-600 dark:text-gray-300 space-y-2">
              <p><strong>Need Help?</strong></p>
              <p>Call us at: <span className="font-mono font-medium text-gray-800 dark:text-gray-200">{company_details.toll_free}</span></p>
              <p>Visit: <span className="font-medium text-gray-800 dark:text-gray-200">{company_details.website}</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Receipt;