import api from "./axios";

export const addDeduction = (earningId, deduction) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `/api/admin/earnings/${earningId}/deductions`,
    deduction,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ REQUIRED
      },
    }
  );
};
