import { Building, Hotel, Music, Utensils } from "lucide-react";

export const poiIconMap = {
  Bars: Building,
  Restaurants: Utensils,
  Hotels: Hotel,
  Clubs: Music,
} as const;
