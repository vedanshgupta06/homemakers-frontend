// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log("AXIOS →", config.url, token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.accessToken || localStorage.getItem("token");
  console.log("AXIOS →", config.url, token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// instance.interceptors.request.use((config) => {

//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default instance;