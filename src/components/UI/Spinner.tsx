import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const classes = [
    "animate-spin rounded-full border-2 border-gray-300 border-t-gray-600",
    sizes[size],
    className,
  ].join(" ");

  return <div className={classes} />;
};

export default Spinner;
