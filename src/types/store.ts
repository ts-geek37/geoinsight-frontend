import { SEGMENT_ENUM } from "@/components/badges/SegmentBadge";
import { AreaProfile } from "./areaProfile";
 
export type RevenueFilter =
  | "all"
  | { start: number; end: number };

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
}

export interface Sales {
  id?: number;
  store_id: string;
  year: number;
  month: number;
  revenue_inr: number;
  transaction_count: number;
  avg_ticket_size: number;
}

export interface StoreSales {
  store_id: string;
  store: Store & { area: AreaProfile};
  sales: Sales[];
}
