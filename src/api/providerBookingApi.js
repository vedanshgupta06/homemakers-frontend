import api from "./axios";

// GET provider bookings
export const getProviderBookings = () => {
  return api.get("/api/bookings/provider");
};

// ACCEPT booking
export const acceptBooking = (bookingId) => {
  return api.put(`/api/bookings/provider/${bookingId}/accept`);
};

// REJECT booking
export const rejectBooking = (bookingId) => {
  return api.put(`/api/bookings/provider/${bookingId}/reject`);
};

// COMPLETE booking
// export const completeBooking = (bookingId) => {
//   return api.put(`/api/bookings/provider/${bookingId}/complete`);
// };


// export const markServiceDone = (bookingId) =>
//   api.put(`/api/bookings/provider/${bookingId}/service-done`);
