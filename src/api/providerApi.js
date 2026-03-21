import api from "./axios";

export const getProviders = () =>
  api.get("/api/providers");

export const getProviderById = (id) =>
  api.get(`/api/providers/${id}`);