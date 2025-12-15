import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";

export const RFM_COLORS = {
  Champion: "var(--segment-champion)",
  Promising: "var(--segment-promising)",
  NeedsAttention: "var(--segment-attention)",
  Default: "#6b7280",
} as const;

const getMarkerColor = (rfm_segment: SEGMENT_ENUM): string => {
  
  switch (rfm_segment) {
    case SEGMENT_ENUM.CHAMPION:
      return RFM_COLORS.Champion;

    case SEGMENT_ENUM.PROMISING:
      return RFM_COLORS.Promising;

    case SEGMENT_ENUM.NEEDS_ATTENTION:
      return RFM_COLORS.NeedsAttention;

    default:
      return RFM_COLORS.Default;
  }
};

export default getMarkerColor;
