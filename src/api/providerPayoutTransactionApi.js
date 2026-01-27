import api from "./axios";

export const getWeeklySummary = () => {
  return api.get("/api/provider/payouts/weekly-summary");
};

export const requestWeeklyPayout = (bookingId, weekNo, amount) => {
  return api.post("/api/provider/payouts/request", {
    bookingId,   // ✅ REQUIRED
    weekNo,
    amount,
  });
};
