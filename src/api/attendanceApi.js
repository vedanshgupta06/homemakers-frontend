import axios from "./axios";

/* ---------------- PROVIDER ---------------- */

export const getTodayAttendance = () => {
  return axios.get("/api/provider/attendance/today");
};

export const markPresent = (id) => {
  return axios.put(`/api/provider/attendance/${id}/mark-present`);
};
export const markLeave = (id) =>
  api.put(`/api/provider/attendance/${id}/mark-leave`);

/* ---------------- CUSTOMER ---------------- */

export const getCustomerAttendance = () => {
  return axios.get("/api/customer/attendance/today");
};

export const confirmAttendance = (id) => {
  return axios.put(`/api/customer/attendance/${id}/confirm`);
};

export const rejectAttendance = (id) => {
  return axios.put(`/api/customer/attendance/${id}/reject`);
};