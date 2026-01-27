import api from "./axios";

/* ================================
   ADMIN WEEKLY PAYOUTS (ACTIVE)
   ================================ */

// Get requested weekly payouts
export const getRequestedWeeklyPayouts = () =>
  api.get("/api/admin/weekly-payouts/requested");

// Mark weekly payout as PAID
export const payWeeklyPayout = (payoutTransactionId, referenceId) =>
  api.put(`/api/admin/weekly-payouts/${payoutTransactionId}/pay`, null, {
    params: { referenceId },
  });
