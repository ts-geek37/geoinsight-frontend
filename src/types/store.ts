import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { AreaProfile } from "./areaProfile";

export type RevenueFilter = "all" | { start: number; end: number };

export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  latitude: number;
  longitude: number;

  recency_score: number;
  frequency_score: number;
  monetary_score: number;

  rfm_score: number;
  rfm_segment: SEGMENT_ENUM;

  store_type?: string;
  size_sqft?: number;

  opening_date?: string;

  yearly_revenue: {
    year: number;
    revenue_inr: number;
    avg_ticket_size: number;
    transaction_count: number;
  }[];
};

 

 

export interface StoreDetailsDTO {
  store: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rfmSegment: SEGMENT_ENUM;
  };

  kpis: KPIItemDTO[];

  revenueTrend: RevenueChartPointDTO[];

  transactionsTrend: TransactionChartPointDTO[];

  demographics: LabelValueDTO[];

  poiSummary: PoiItemDTO[];
}

export interface KPIItemDTO {
  title: string;
  value: string;
  subtitle?: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

export interface RevenueChartPointDTO {
  label: string;
  month: number;
  year: number;
  revenue: number;
}

export interface TransactionChartPointDTO {
  label: string;
  month: number;
  year: number;
  transactions: number;
}

export interface LabelValueDTO {
  label: string;
  value: string;
}

export interface PoiItemDTO {
  label: string;
  value: number;
}

export interface StoreMapItemDTO {
  id: string;
  name: string;
  city: string;
  state: string;

  latitude: number;
  longitude: number;

  rfmScore: number;
  rfmSegment: SEGMENT_ENUM;

  latestRevenue: number;
  latestRevenueFormatted: string;

  heatmapWeight: number;
}

export interface StoreMapResponseDTO {
  stores: StoreMapItemDTO[];

  filters: {
    states: string[];
    citiesByState: Record<string, string[]>;
    revenueMin: number;
    revenueMax: number;
  };

  segmentCounts: {
    champion: number;
    promising: number;
    attention: number;
  };
}
