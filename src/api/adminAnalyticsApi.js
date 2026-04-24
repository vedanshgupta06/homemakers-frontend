import api from "./axios";

export const getAdminSummary = () =>
  api.get("/api/admin/analytics/summary");

export const getMonthlyRevenue = () =>
  api.get("/api/admin/analytics/monthly-revenue");

export const getServiceDistribution = () =>
  api.get("/api/admin/analytics/service-distribution");
export const getBookingRevenue = (period = "ALL") =>
  api.get(`/api/admin/analytics/booking-revenue?period=${period}`);