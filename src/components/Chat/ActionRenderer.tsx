import React from 'react';
import { ChatAction } from '../../types/chat';
import DynamicForm from '../Forms/DynamicForm';
import QuoteDisplay from '../Forms/QuoteDisplay';
import PaymentRedirect from '../Forms/PaymentRedirect';
import FileUpload from '../Forms/FileUpload';
import OptionsSelection from '../Forms/OptionsSelection';
import PaymentButtons from '../Forms/PaymentButtons';
import Receipt from '../Forms/Receipt';
import HumanAgentHandoff from '../Forms/HumanAgentHandoff';

interface ActionRendererProps {
  actions: ChatAction[];
  onSubmit: (actionData: Record<string, any>) => void;
}

const ActionRenderer: React.FC<ActionRendererProps> = ({ actions, onSubmit }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-4">
      {actions.map((action, index) => {
        const key = `action-${index}-${action.type}`;
        
        switch (action.type) {
          case 'form':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <DynamicForm
                  title={action.title}
                  description={action.description}
                  fields={action.fields}
                  submitLabel={action.submit_label || 'Submit'}
                  onSubmit={(formData) => onSubmit({ action: 'form_submit', form_data: formData })}
                />
              </div>
            );

          case 'quote_display':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <QuoteDisplay
                  title={action.title}
                  description={action.description}
                  variants={action.variants}
                  comparisonFeatures={action.comparison_features}
                  onSelectVariant={(variant) => onSubmit({ 
                    action: 'select_variant', 
                    variant: variant.name,
                    variant_data: variant 
                  })}
                />
              </div>
            );

          case 'payment_redirect':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <PaymentRedirect
                  title={action.title}
                  description={action.description}
                  paymentDetails={action.payment_details}
                  redirectUrl={action.redirect_url}
                  onProceedToPayment={() => onSubmit({ 
                    action: 'proceed_payment',
                    payment_url: action.redirect_url 
                  })}
                />
              </div>
            );

          case 'document_upload':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <FileUpload
                  title={action.title}
                  description={action.description}
                  documents={action.documents}
                  onUploadComplete={(documents) => onSubmit({ 
                    action: 'documents_uploaded', 
                    documents 
                  })}
                />
              </div>
            );

          case 'options_selection':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <OptionsSelection
                  title={action.title}
                  description={action.description}
                  options={action.options}
                  selectionType={action.selection_type || 'single'}
                  onSelect={(selected) => onSubmit({ 
                    action: 'option_selected', 
                    selected_options: selected 
                  })}
                />
              </div>
            );

          case 'payment_buttons':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <PaymentButtons
                  title={action.title}
                  description={action.description}
                  selectedQuote={action.selected_quote}
                  buttons={action.buttons}
                  onPaymentMethodSelect={(methodId) => onSubmit({
                    action: 'payment_method_selected',
                    payment_method: methodId,
                    selected_quote: action.selected_quote
                  })}
                />
              </div>
            );

          case 'confirmation':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{action.title}</h3>
                    {action.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{action.description}</p>
                    )}
                  </div>
                  
                  {action.data_summary && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Summary:</h4>
                      <pre className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(action.data_summary, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => onSubmit({ action: 'confirm', confirmed: true })}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      {action.confirm_label || 'Confirm'}
                    </button>
                    <button
                      onClick={() => onSubmit({ action: 'cancel', confirmed: false })}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      {action.cancel_label || 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            );

          case 'receipt':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <Receipt
                  title={action.title}
                  description={action.description}
                  receiptData={action.receipt_data}
                  onDownloadPDF={() => onSubmit({
                    action: 'download_pdf',
                    filename: action.receipt_data?.benefit_illustration_pdf?.filename
                  })}
                />
              </div>
            );

          case 'human_agent_handoff':
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <HumanAgentHandoff
                  title={action.title}
                  message={action.message}
                  estimatedWaitTime={action.estimated_wait_time}
                />
              </div>
            );

          default:
            return (
              <div key={key} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-base">
                  Unknown action type: {action.type}
                </p>
              </div>
            );
        }
      })}
    </div>
  );
};

export default ActionRenderer;