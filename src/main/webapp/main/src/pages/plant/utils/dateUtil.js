export const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};
