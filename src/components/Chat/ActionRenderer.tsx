import React from "react";
import { ChatAction } from "../../types/chat";
import DynamicForm from "../Forms/DynamicForm";
import FileUpload from "../Forms/FileUpload";
import OptionsSelection from "../Forms/OptionsSelection";
import PaymentRedirect from "../Forms/PaymentRedirect";
import QuoteDisplay from "../Forms/QuoteDisplay";

interface ActionRendererProps {
  actions: ChatAction[];
  onSubmit: (actionData: Record<string, any>) => void;
}

const ActionRenderer: React.FC<ActionRendererProps> = ({
  actions,
  onSubmit,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-4">
      {actions.map((action, index) => {
        const key = `action-${index}-${action.type}`;

        switch (action.type) {
          case "form":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <DynamicForm
                  title={action.title}
                  description={action.description}
                  fields={action.fields}
                  submitLabel={action.submit_label || "Submit"}
                  onSubmit={(formData) =>
                    onSubmit({ action: "form_submit", form_data: formData })
                  }
                />
              </div>
            );

          case "quote_display":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <QuoteDisplay
                  title={action.title}
                  description={action.description}
                  variants={action.variants}
                  comparisonFeatures={action.comparison_features}
                  onSelectVariant={(variant) =>
                    onSubmit({
                      action: "select_variant",
                      variant: variant.name,
                      variant_data: variant,
                    })
                  }
                />
              </div>
            );

          case "payment_redirect":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <PaymentRedirect
                  title={action.title}
                  description={action.description}
                  paymentDetails={action.payment_details}
                  redirectUrl={action.redirect_url}
                  onProceedToPayment={() =>
                    onSubmit({
                      action: "proceed_payment",
                      payment_url: action.redirect_url,
                    })
                  }
                />
              </div>
            );

          case "document_upload":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <FileUpload
                  title={action.title}
                  description={action.description}
                  documents={action.documents}
                  onUploadComplete={(documents) =>
                    onSubmit({
                      action: "documents_uploaded",
                      documents,
                    })
                  }
                />
              </div>
            );

          case "options_selection":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <OptionsSelection
                  title={action.title}
                  description={action.description}
                  options={action.options}
                  selectionType={action.selection_type || "single"}
                  onSelect={(selected) =>
                    onSubmit({
                      action: "option_selected",
                      selected_options: selected,
                    })
                  }
                />
              </div>
            );

          case "confirmation":
            return (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {action.title}
                    </h3>
                    {action.description && (
                      <p className="text-gray-600 mt-2">{action.description}</p>
                    )}
                  </div>

                  {action.data_summary && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Summary:
                      </h4>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(action.data_summary, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        onSubmit({ action: "confirm", confirmed: true })
                      }
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {action.confirm_label || "Confirm"}
                    </button>
                    <button
                      onClick={() =>
                        onSubmit({ action: "cancel", confirmed: false })
                      }
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {action.cancel_label || "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            );

          default:
            return (
              <div
                key={key}
                className="bg-yellow-50 rounded-lg border border-yellow-200 p-4"
              >
                <p className="text-yellow-800">
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
