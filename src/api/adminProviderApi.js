import api from "./axios";

// ALL providers
export const getAllProviders = () => {
  return api.get("/api/admin/providers");
};

// pending providers
export const getPendingProviders = () => {
  return api.get("/api/admin/providers/pending");
};

// verify provider
export const verifyProvider = (id) => {
  return api.put(`/api/admin/providers/${id}/verify`);
};