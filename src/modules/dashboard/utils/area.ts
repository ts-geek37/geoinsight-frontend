import { AreaProfile } from "@/types";
import { Building, Hotel, LucideIcon, Music, Utensils } from "lucide-react";
import { num, percent } from "./format";

export const normalizeAreaProfile = (area?: AreaProfile | null) =>
  !!area
    ? [
        {
          label: "Population 1km",
          value: num(area.population_1km).toLocaleString(),
        },
        {
          label: "Population 3km",
          value: num(area.population_3km).toLocaleString(),
        },
        {
          label: "Population 5km",
          value: num(area.population_5km).toLocaleString(),
        },
        { label: "Age 25–55", value: percent(area.age_25_55_pct || 0) },
        {
          label: "Income >5L",
          value: percent(area.income_high_percentage || 0),
        },
        { label: "Literacy", value: percent(area.literacy_rate || 0) },
        { label: "Worker Population", value: percent(area.worker_pct || 0) },
        { label: "Urban Score", value: Math.round(num(area.urban_score)) },
      ]
    : [];

export const normalizeAreaPoi = (area?: AreaProfile | null) => {
  if (!area) return [];
  return [
    { icon: Building as LucideIcon, label: "Bars", value: num(area.bars) },
    {
      icon: Utensils as LucideIcon,
      label: "Restaurants",
      value: num(area.restaurants),
    },
    { icon: Hotel as LucideIcon, label: "Hotels", value: num(area.hotels) },
    { icon: Music as LucideIcon, label: "Clubs", value: num(area.clubs) },
  ];
};

export const getPoiTotal = (area: AreaProfile) =>
  num(area.bars) + num(area.restaurants) + num(area.hotels) + num(area.clubs);
