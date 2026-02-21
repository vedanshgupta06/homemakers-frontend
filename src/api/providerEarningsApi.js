// import api from "./axios";

// // table data
// export const getMyEarnings = () =>
//   api.get("/api/provider/earnings/list");

// // summary cards
// export const getEarningsSummary = () =>
//   api.get("/api/provider/earnings/summary");
import axios from "./axios";

export const getEarningsSummary = () => {
  return axios.get("/api/provider/earnings/summary");
};


import api from "./axios";
export const getProviderEarnings = () =>
  api.get("/api/provider/earnings/list");
