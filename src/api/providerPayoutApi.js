import api from "./axios";

/**
 * ===========================
 * MONTHLY PAYOUTS (EXISTING)
 * ===========================
 * ⚠️ Reporting / future use
 */

// // Get logged-in provider's monthly payouts
// export const getMyPayouts = () => {
//   return api.get("/api/provider/payouts");
// };

/**
 * ===========================
 * WEEKLY SALARY FLOW (ACTIVE)
 * ===========================
 */

// Get weekly payout summary (4-part salary)
// export const getWeeklySummary = () => {
//   return api.get("/api/provider/payouts/weekly-summary");
// };

// // Withdraw salary for a specific week (1–4)
// export const withdrawWeeklySalary = (week) => {
//   return api.post("/api/provider/payouts/withdraw", {
//     week,
//   });
// };

/**
 * ===========================
 * WEEKLY PAYOUT HISTORY (NEW)
 * ===========================
 * ✅ PAID weekly payouts shown in "My Payouts"
 */
// 
// export const getPaidWeeklyPayouts = () => {
//   return api.get("/api/provider/weekly-payouts/paid");
// };

// export const requestPayout = () =>
//   axios.post("/api/provider/payouts/request");

// export const getMyPayouts = () =>
//   axios.get("/api/provider/payouts");
import axios from "./axios";

export const getMyPayouts = () => {
  return axios.get("/api/provider/payouts");
};

// export const requestPayout = () => {
//   return axios.post("/api/provider/payouts/request");
// };


export const requestPayout = () =>
  api.post("/api/provider/payout/request");
