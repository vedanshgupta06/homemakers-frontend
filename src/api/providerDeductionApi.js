import api from "./axios";

// Get logged-in provider's deductions (read-only)
export const getMyDeductions = () => {
  return api.get("/api/provider/deductions");
};
