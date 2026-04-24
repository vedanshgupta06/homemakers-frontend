// import api from "./axios";

// // table data
// export const getMyEarnings = () =>
//   api.get("/api/provider/earnings/list");

// // summary cards
// export const getEarningsSummary = () =>
//   api.get("/api/provider/earnings/summary");


// import axios from "./axios";

// export const getEarningsSummary = () => {
//   return axios.get("/api/provider/earnings/summary");
// };


// import api from "./axios";
// export const getProviderEarnings = () =>
//   api.get("/api/provider/earnings/list");
// export const getEarningsStats = () =>
//   axios.get("/provider/earnings/stats");

// // In providerEarningsApi.js — add this function
// export const getMyEarnings = () =>
//   axiosInstance.get("/provider/earnings/my");


import api from "./axios"; // ✅ one consistent import

export const getEarningsSummary = () =>
  api.get("/api/provider/earnings/summary");

export const getProviderEarnings = () =>
  api.get("/api/provider/earnings/list");

export const getEarningsStats = () =>
  api.get("/api/provider/earnings/stats");

export const getMyEarnings = () =>
  api.get("/api/provider/earnings/my"); // ✅ fixed: added /api prefix