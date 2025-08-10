import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
}) => {
  const variants = {
    default: "bg-white border border-gray-200",
    bordered: "bg-white border-2 border-gray-300",
    elevated:
      "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const classes = [
    "rounded-lg",
    variants[variant],
    paddings[padding],
    className,
  ].join(" ");

  return <div className={classes}>{children}</div>;
};

export default Card;
