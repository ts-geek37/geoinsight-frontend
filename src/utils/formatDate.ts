const formatDate = (iso?: string): string => {
  if (!iso) return "N/A";

  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate;
