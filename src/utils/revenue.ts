import { Store, RevenueFilter } from "@/types";
import { getFormattedLatestRevenue } from "@/utils/formatRevenue";

const matchesRevenueFilter = (store: Store, revenueFilter: RevenueFilter | string) => {
  if (
    !store.yearly_revenue ||
    !revenueFilter ||
    revenueFilter === "all" ||
    typeof revenueFilter === "string"
  )
    return true;

  const latestRevenueData = getFormattedLatestRevenue(store.yearly_revenue);
  if (!latestRevenueData) return true;

  const numericRevenue = store.yearly_revenue.find(
    (r) => r.year === latestRevenueData.year,
  )!.revenue_inr;

  return numericRevenue >= revenueFilter.start && numericRevenue <= revenueFilter.end;
};

export default matchesRevenueFilter;
