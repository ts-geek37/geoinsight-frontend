import { cn } from "@/lib/utils";
import React from "react";

export enum SEGMENT_ENUM {
  CHAMPION = "Champion",
  PROMISING = "Promising",
  NEEDS_ATTENTION = "Needs Attention",
}

interface SegmentBadgeProps {
  segment: SEGMENT_ENUM | null;
  showLabel?: boolean;
  showDot?: boolean;
  className?: string;
}

type SegmentConfig = {
  label: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
};

const segmentConfig: Record<SEGMENT_ENUM, SegmentConfig> = {
  [SEGMENT_ENUM.CHAMPION]: {
    label: "Champion",
    bg: "bg-segment-champion-bg",
    text: "text-segment-champion",
    dot: "bg-segment-champion",
    border: "border border-segment-champion",
  },
  [SEGMENT_ENUM.PROMISING]: {
    label: "Promising",
    bg: "bg-segment-promising-bg",
    text: "text-segment-promising",
    dot: "bg-segment-promising",
    border: "border border-segment-promising",
  },
  [SEGMENT_ENUM.NEEDS_ATTENTION]: {
    label: "Needs Attention",
    bg: "bg-segment-attention-bg",
    text: "text-segment-attention",
    dot: "bg-segment-attention",
    border: "border border-segment-attention",
  },
};

const SegmentBadge: React.FC<SegmentBadgeProps> = ({
  segment,
  showLabel = true,
  showDot = true,
  className,
}) => {
  const resolvedSegment = segment ?? SEGMENT_ENUM.NEEDS_ATTENTION;

  const config = segmentConfig[resolvedSegment] || {
    label: "",
    bg: "",
    text: "",
    dot: "",
    border: "",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full text-xs px-2 py-0.5",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      )}
      {showLabel && config.label}
    </span>
  );
};

export default SegmentBadge;
