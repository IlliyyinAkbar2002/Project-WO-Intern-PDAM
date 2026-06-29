export const getProgressPercentage = (tahapan: number | null) => {
  if (!tahapan) return 0;
  return Math.round((tahapan / 4) * 100);
};
