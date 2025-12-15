interface RevenueRange {
  year: number;
  latestRevenue: string;
  maxRevenue: string;
}

const formatIndianNumber = (value: number): string => {
  if (value >= 1_00_00_000) {
    return (value / 1_00_00_000).toFixed(2) + " Cr";
  }
  if (value >= 1_00_000) {
    return (value / 1_00_000).toFixed(2) + " L";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + " K";
  }
  return value.toString();
};

const getFormattedLatestRevenue = (
  yearly_revenue?: { year: number; revenue_inr: number }[],
  fetchYear?: number
): RevenueRange | null => {
  if (!yearly_revenue?.length) return null;

  const latestYear = yearly_revenue.reduce(
    (max, r) => Math.max(max, r.year),
    yearly_revenue[0].year
  );
  const targetYear = yearly_revenue.some((r) => r.year === fetchYear)
    ? fetchYear!
    : latestYear;

  const yearRecords = yearly_revenue.filter((r) => r.year === targetYear);

  if (!yearRecords.length) return null;

  const maxRevenue = Math.max(...yearRecords.map((r) => r.revenue_inr));

  return {
    year: targetYear,
    latestRevenue: formatIndianNumber(yearRecords[0].revenue_inr),
    maxRevenue: formatIndianNumber(maxRevenue),
  };
};

export { formatIndianNumber, getFormattedLatestRevenue };

