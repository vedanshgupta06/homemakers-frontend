import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    api.get("/api/bookings/provider")
      .then(res => {
        setBookings(res.data || []);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load bookings");
      });
  };

  const acceptBooking = async (id) => {
    try {
      setLoadingId(id);
      await api.put(`/api/bookings/provider/${id}/accept`);
      loadBookings();
    } catch {
      alert("Failed to accept booking");
    } finally {
      setLoadingId(null);
    }
  };

  const rejectBooking = async (id) => {
    try {
      setLoadingId(id);
      await api.put(`/api/bookings/provider/${id}/reject`);
      loadBookings();
    } catch {
      alert("Failed to reject booking");
    } finally {
      setLoadingId(null);
    }
  };

  const completeBooking = async (id) => {
    try {
      setLoadingId(id);
      await api.put(`/api/bookings/provider/${id}/complete`);
      loadBookings();
    } catch {
      alert("Failed to complete booking");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ COMPLETE + SAFE STATUS STYLES
  const statusStyle = {
    PENDING: { bg: "#fef3c7", color: "#92400e" },
    CONFIRMED: { bg: "#dcfce7", color: "#166534" },
    COMPLETED: { bg: "#e0e7ff", color: "#3730a3" },
    REJECTED: { bg: "#fee2e2", color: "#991b1b" },
    CANCELLED: { bg: "#f3f4f6", color: "#374151" }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings (Provider)</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookings.length === 0 && !error && <p>No bookings yet</p>}

      <ul style={{ padding: 0 }}>
        {bookings.map(b => (
          <li
            key={b.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
              listStyle: "none"
            }}
          >
            <div><b>Date:</b> {b.availability?.date || "-"}</div>
            <div>
              <b>Time:</b> {b.availability?.startTime || "-"} - {b.availability?.endTime || "-"}
            </div>
            <div><b>User:</b> {b.user?.email || "-"}</div>

            <div style={{ margin: "8px 0" }}>
              <span
                style={{
                  backgroundColor: statusStyle[b.status]?.bg || "#e5e7eb",
                  color: statusStyle[b.status]?.color || "#374151",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                {b.status}
              </span>
            </div>

            {/* ACTIONS */}
            {b.status === "PENDING" && (
              <>
                <button
                  onClick={() => acceptBooking(b.id)}
                  disabled={loadingId === b.id}
                >
                  {loadingId === b.id ? "Processing..." : "Accept"}
                </button>{" "}
                <button
                  onClick={() => rejectBooking(b.id)}
                  disabled={loadingId === b.id}
                >
                  {loadingId === b.id ? "Processing..." : "Reject"}
                </button>
              </>
            )}

            {b.status === "CONFIRMED" && (
              <button
                onClick={() => completeBooking(b.id)}
                disabled={loadingId === b.id}
              >
                {loadingId === b.id ? "Processing..." : "Mark as Completed"}
              </button>
            )}

            {(b.status === "REJECTED" ||
              b.status === "COMPLETED" ||
              b.status === "CANCELLED") && (
              <span style={{ color: "gray" }}>
                No action available
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProviderBookings;
