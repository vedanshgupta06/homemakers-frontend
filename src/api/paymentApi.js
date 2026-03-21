import api from "./axios";

export const createPaymentSession = (bookingId) =>
  api.post(`/api/payments/booking/${bookingId}`);