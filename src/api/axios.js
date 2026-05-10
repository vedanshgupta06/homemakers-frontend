

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080",
// });

// api.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = user?.accessToken || localStorage.getItem("token");
//   console.log("AXIOS →", config.url, token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.accessToken || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;