import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "user" | "bot" | "agent";
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
  variant = "user",
}) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg",
  };

  const variants = {
    user: "bg-blue-500 text-white",
    bot: "bg-green-100 text-green-700 border-2 border-green-200",
    agent: "bg-gray-100 text-gray-700 border-2 border-gray-200",
  };

  const classes = [
    "rounded-full flex items-center justify-center font-medium flex-shrink-0",
    sizes[size],
    variants[variant],
    className,
  ].join(" ");

  if (src) {
    return <img src={src} alt={alt || fallback} className={classes} />;
  }

  return <div className={classes}>{fallback}</div>;
};

export default Avatar;
