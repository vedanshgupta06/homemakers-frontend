import { useEffect, useState } from "react";
import api from "../../api/axios";

function PaymentRequired() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings/user/payment-required");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const pay = async (bookingId) => {
    try {
      const res = await api.post(`/api/payments/booking/${bookingId}`);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);

      // 🔥 Handle full wallet payment case
      alert("This booking is already fully paid using wallet.");
    }
  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Pending Payments</h2>

      {loading && <p>Loading...</p>}

      {!loading && bookings.length === 0 && (
        <p>No pending payments</p>
      )}

      {bookings.map(b => (

        <div
          key={b.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9"
          }}
        >

          <p><strong>Booking ID:</strong> {b.id}</p>

          {/* 🔥 PAYMENT BREAKDOWN */}
          <p>Total: ₹{b.totalPrice}</p>
          <p>Wallet Used: ₹{b.walletUsed || 0}</p>
          <p style={{ fontWeight: "bold" }}>
            To Pay: ₹{b.finalPayableAmount}
          </p>

          {/* 🔥 HANDLE ZERO PAYMENT */}
          {b.finalPayableAmount === 0 ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Fully paid using wallet ✅
            </p>
          ) : (
            <button
              onClick={() => pay(b.id)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                cursor: "pointer"
              }}
            >
              Pay ₹{b.finalPayableAmount}
            </button>
          )}

        </div>

      ))}

    </div>
  );
}

export default PaymentRequired;