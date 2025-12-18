"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader: React.FC<LoaderProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div className={cn("flex items-center justify-center h-full bg-transparent py-10", className)}>
      <div
        className={cn("border-muted border-t-primary rounded-full animate-spin", sizeClasses[size])}
      />
    </div>
  );
};

export default Loader;
