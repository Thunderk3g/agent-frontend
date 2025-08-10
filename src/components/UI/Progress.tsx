import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    default: "bg-gray-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const containerClasses = [
    "w-full bg-gray-200 rounded-full overflow-hidden",
    sizes[size],
    className,
  ].join(" ");

  const barClasses = [
    "h-full rounded-full transition-all duration-300 ease-out",
    variants[variant],
  ].join(" ");

  return (
    <div className="space-y-1">
      <div className={containerClasses}>
        <div className={barClasses} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default Progress;
