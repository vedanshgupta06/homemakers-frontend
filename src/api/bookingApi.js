import api from "./axios";

// preview booking price
export const previewBooking = (data) =>
  api.post("/api/bookings/preview", data);

// create booking
export const createBooking = (data) =>
  api.post("/api/bookings", data);

// user bookings
export const getUserBookings = () =>
  api.get("/api/bookings/user");

// provider bookings
export const getProviderBookings = () =>
  api.get("/api/bookings/provider");

// payment required bookings
export const getPaymentRequiredBookings = () =>
  api.get("/api/bookings/user/payment-required");