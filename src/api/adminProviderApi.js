import api from "./axios";   

export const getAllProviders = () => {
  return api.get("/api/admin/providers");
};