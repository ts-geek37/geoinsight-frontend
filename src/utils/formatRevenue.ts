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

export { formatIndianNumber };

