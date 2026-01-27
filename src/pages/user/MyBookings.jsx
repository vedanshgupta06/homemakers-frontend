import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/bookings/my")
      .then(res => {
        setBookings(res.data);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("No bookings available");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>

      {error && bookings.length === 0 && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {bookings.length === 0 && !error && (
        <p>No bookings yet</p>
      )}

      <ul>
        {bookings.map(b => (
          <li key={b.id} style={{ marginBottom: "15px" }}>
            <b>Date:</b> {b.availability.date}<br />
            <b>Time:</b> {b.availability.startTime} - {b.availability.endTime}<br />
            <b>Provider:</b> {b.provider.user.email}<br />
            <b>Services:</b>{" "}
                {b.services && b.services.length > 0
                  ? b.services.map(s => s.replace("_", " ")).join(", ")
                  : "—"}
                <br />
            <b>Status:</b>{" "}
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor:
                      b.status === "PENDING"
                        ? "#FEF3C7"
                        : b.status === "CONFIRMED"
                        ? "#DCFCE7"
                        : b.status === "REJECTED"
                        ? "#FEE2E2"
                        : "#DBEAFE",
                    color:
                      b.status === "PENDING"
                        ? "#92400E"
                        : b.status === "CONFIRMED"
                        ? "#166534"
                        : b.status === "REJECTED"
                        ? "#991B1B"
                        : "#1E40AF",
                  }}
                >
                  {b.status}
                </span>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
