import api from "./axios";

// provider availability
export const getProviderAvailability = (providerId) =>
  api.get(`/api/provider/availability/${providerId}`);

// provider own availability
export const getMyAvailability = () =>
  api.get("/api/provider/availability/my");

// add availability
export const addAvailability = (data) =>
  api.post("/api/provider/availability", data);