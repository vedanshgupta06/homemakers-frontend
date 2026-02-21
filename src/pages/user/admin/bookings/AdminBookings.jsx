import { useEffect, useState } from "react";
import { getAllBookings } from "../../../../api/adminBookingApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>All Platform Bookings</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                marginRight: "10px",
                padding: "8px 14px",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                background: filter === status ? "#2563eb" : "#ffffff",
                color: filter === status ? "#ffffff" : "#111827",
                cursor: "pointer",
              }}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* BOOKINGS */}
      {filteredBookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>Booking #{booking.id}</h3>
              <p>
                <strong>Service Date:</strong>{" "}
                {booking.availability?.date}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {booking.availability?.startTime} -{" "}
                {booking.availability?.endTime}
              </p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          <hr style={{ margin: "15px 0" }} />

          <p>
            <strong>Customer:</strong>{" "}
            {booking.user?.name || booking.user?.email}
          </p>

          <p>
            <strong>Provider:</strong>{" "}
            {booking.provider?.user?.email}
          </p>

          <p>
            <strong>Total Price:</strong> ₹{booking.totalPrice}
          </p>

          <p>
            <strong>Work Start:</strong>{" "}
            {booking.workStartDate || "Not Started"}
          </p>

          <p>
            <strong>Work End:</strong>{" "}
            {booking.workEndDate || "Ongoing"}
          </p>

          <p>
            <strong>Chargeable Days:</strong> {booking.chargeableDays}
          </p>

          {/* SERVICES */}
          {booking.services && booking.services.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <strong>Selected Services:</strong>
              <div style={{ marginTop: "6px" }}>
                {booking.services.map((service, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#f3f4f6",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      marginRight: "8px",
                      fontSize: "12px",
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {filteredBookings.length === 0 && (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "#6b7280",
    CONFIRMED: "#2563eb",
    COMPLETED: "#16a34a",
    CANCELLED: "#dc2626",
  };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold",
        background: colors[status] || "#6b7280",
        color: "white",
        height: "fit-content",
      }}
    >
      {status}
    </span>
  );
};
