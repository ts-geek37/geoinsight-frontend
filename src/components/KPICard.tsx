import { cn } from "@/lib/utils";
import React from "react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col justify-between rounded-lg border border-border/40 bg-background p-3  gap-2",
      className
    )}
  >
    <p className="text-xs font-medium text-muted-foreground leading-tight">
      {title}
    </p>

    <div className="flex items-baseline gap-1">
      <p className="text-xl font-semibold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground leading-none">
          {subtitle}
        </p>
      )}
    </div>

    {trend && (
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium leading-none",
          trend.isPositive ? "text-segment-champion" : "text-segment-attention"
        )}
      >
        <span>{trend.isPositive ? "↑" : "↓"}</span>
        <span>{Math.abs(trend.value)}%</span>
      </div>
    )}
  </div>
);

export default KPICard;
