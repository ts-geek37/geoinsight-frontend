export const num = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};

export const percent = (value: number) => `${Math.round(num(value))}%`;

export const kValue = (value: number) => `${Math.round(value / 1000)}k`;
