import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
} from "../../api/providerBookingApi";

/* ============================= */
/* HOURLY SERVICES LIST */
/* ============================= */
const HOURLY_SERVICES = [
  "BABYSITTING",
  "ELDER_CARE",
  "COOKING"
];

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    await acceptBooking(bookingId);
    loadBookings();
  };

  const handleReject = async (bookingId) => {
    await rejectBooking(bookingId);
    loadBookings();
  };

  /* ============================= */
  /* START WORK */
  /* ============================= */
  const handleStartWork = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}/start`);
      loadBookings();
    } catch (err) {
      alert("Failed to start work");
    }
  };

  /* ============================= */
  /* END WORK */
  /* ============================= */
  const handleEndWork = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}/end`);
      loadBookings();
    } catch (err) {
      alert("Failed to end work");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (bookings.length === 0) return <p>No bookings available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>

      <div style={{ marginTop: "20px" }}>
        {bookings.map((booking) => {

          const hasHourlyService = booking.services?.some(service =>
            HOURLY_SERVICES.includes(service)
          );

          const calculatedHours =
            booking.hoursPerDay ??
            (
              booking.availability?.startTime &&
              booking.availability?.endTime
                ? (
                    (new Date(`1970-01-01T${booking.availability.endTime}`) -
                     new Date(`1970-01-01T${booking.availability.startTime}`))
                    / (1000 * 60 * 60)
                  )
                : null
            );

          return (
            <div
              key={booking.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>Service Date</h4>
                <StatusBadge status={booking.status} />
              </div>

              <p><strong>{booking.availability?.date}</strong></p>
              <p>
                {booking.availability?.startTime} - {booking.availability?.endTime}
              </p>

              <p>
                <strong>Customer:</strong>{" "}
                {booking.user?.name || booking.user?.email || "N/A"}
              </p>

              {/* SERVICES */}
              {booking.services?.length > 0 && (
                <>
                  <hr style={{ margin: "15px 0" }} />
                  <p><strong>Selected Services</strong></p>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {booking.services.map((service, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px"
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* HOURS */}
              {hasHourlyService && calculatedHours && (
                <p style={{ marginTop: "15px" }}>
                  <strong>Daily Hours:</strong> {calculatedHours} hrs
                </p>
              )}

              {/* WORK INFO */}
              {booking.workStartDate && (
                <>
                  <hr style={{ margin: "15px 0" }} />
                  <p><strong>Work Start:</strong> {booking.workStartDate}</p>
                  <p>
                    <strong>Work End:</strong>{" "}
                    {booking.workEndDate || "Ongoing"}
                  </p>
                  <p><strong>Total Days:</strong> {booking.totalDays}</p>
                  <p><strong>Chargeable Days:</strong> {booking.chargeableDays}</p>
                  <p><strong>Holidays:</strong> {booking.holidays}</p>
                </>
              )}

              {/* ============================= */}
              {/* ACTION BUTTONS */}
              {/* ============================= */}
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                
                {booking.status === "PENDING" && (
                  <>
                    <button onClick={() => handleAccept(booking.id)}>
                      Accept
                    </button>
                    <button onClick={() => handleReject(booking.id)}>
                      Reject
                    </button>
                  </>
                )}

                {booking.status === "CONFIRMED" && (
                  <button
                    style={{ background: "#2563eb", color: "white" }}
                    onClick={() => handleStartWork(booking.id)}
                  >
                    Start Work
                  </button>
                )}

                {booking.status === "ONGOING" && (
                  <button
                    style={{ background: "#16a34a", color: "white" }}
                    onClick={() => handleEndWork(booking.id)}
                  >
                    End Work
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================= */
/* STATUS BADGE */
/* ============================= */
const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "PENDING":
        return "#6b7280";
      case "CONFIRMED":
        return "#2563eb";
      case "ONGOING":
        return "#f59e0b";
      case "COMPLETED":
        return "#16a34a";
      case "CANCELLED":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold",
        background: getColor(),
        color: "white",
      }}
    >
      {status}
    </span>
  );
};