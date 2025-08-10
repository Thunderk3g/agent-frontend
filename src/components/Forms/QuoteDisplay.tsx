import { RotateCcw, Shield, ShieldCheck, Star } from "lucide-react";
import React from "react";
import { QuoteVariant } from "../../types/chat";

interface QuoteDisplayProps {
  title: string;
  description?: string;
  variants: QuoteVariant[];
  comparisonFeatures?: string[];
  onSelectVariant: (variant: QuoteVariant) => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  title,
  description,
  variants,
  comparisonFeatures,
  onSelectVariant,
}) => {
  const getVariantIcon = (variantName: string) => {
    if (variantName.includes("Plus"))
      return <ShieldCheck className="w-6 h-6" />;
    if (variantName.includes("ROP")) return <RotateCcw className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        )}
      </div>

      {/* Variants Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {variants.map((variant, index) => (
          <div
            key={index}
            className={`relative border rounded-lg p-6 transition-all cursor-pointer ${
              variant.recommended
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onSelectVariant(variant)}
          >
            {/* Recommended Badge */}
            {variant.recommended && (
              <div className="absolute -top-2 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star size={12} className="fill-current" />
                Recommended
              </div>
            )}

            <div className="flex items-start justify-between">
              {/* Left side - Plan details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      variant.recommended
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getVariantIcon(variant.name)}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {variant.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {variant.policy_term} years coverage •{" "}
                      {variant.premium_paying_term} years premium
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Key Benefits:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coverage Amount */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Life Cover:</span>{" "}
                  {formatCurrency(variant.sum_assured)}
                </div>
              </div>

              {/* Right side - Pricing */}
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(variant.premium)}
                </div>
                <div className="text-sm text-gray-500">per year</div>
                <div className="text-xs text-gray-400 mt-1">
                  or {formatCurrency(Math.round(variant.premium / 12))} per
                  month
                </div>

                {/* Select Button */}
                <button
                  className={`mt-4 px-6 py-2 rounded-lg font-medium transition-all ${
                    variant.recommended
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-700 text-white hover:bg-gray-800"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVariant(variant);
                  }}
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Features */}
      {comparisonFeatures && comparisonFeatures.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Compare Features
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Feature</th>
                  {variants.map((variant, index) => (
                    <th
                      key={index}
                      className="text-center py-2 text-gray-900 min-w-[100px]"
                    >
                      {variant.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{feature}</td>
                    {variants.map((variant, variantIndex) => (
                      <td key={variantIndex} className="text-center py-2">
                        {variant.features.includes(feature) ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
        💡 <strong>Need help choosing?</strong> Our agent Rajesh can explain the
        differences and help you pick the best plan for your family's needs.
      </div>
    </div>
  );
};

export default QuoteDisplay;
