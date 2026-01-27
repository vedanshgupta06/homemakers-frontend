import api from "./axios";

// table data
export const getMyEarnings = () =>
  api.get("/api/provider/earnings/list");

// summary cards
export const getEarningsSummary = () =>
  api.get("/api/provider/earnings/summary");
