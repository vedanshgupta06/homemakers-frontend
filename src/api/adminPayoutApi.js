import api from "./axios";

export const getPayoutRequests = () =>
  api.get("/api/admin/payouts/requests");

export const getPayoutHistory = () =>
  api.get("/api/admin/payouts/history");

export const markPayoutPaid = (id) =>
  api.put(`/api/admin/payouts/${id}/mark-paid`);