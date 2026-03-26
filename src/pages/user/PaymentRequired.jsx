import { useEffect, useState } from "react";
import api from "../../api/axios";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

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
      alert("Already fully paid using wallet.");
    }
  };

  const totalDue = bookings.reduce(
    (sum, b) => sum + (b.finalPayableAmount || 0),
    0
  );

  const pendingCount = bookings.filter(
    b => b.finalPayableAmount > 0
  ).length;

  return (
    <Container>

      {/* 🔥 HEADER + STATS */}
      <div className="mb-8 space-y-6">

        {/* HEADER */}
        <div>
           <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
            Payments Dashboard 
          </h2>

          <p className="text-gray-500 mt-1">
            Manage and complete your payments
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <p className="text-sm text-gray-500">Total Due</p>
            <p className="text-xl font-semibold">₹ {totalDue}</p>
          </div>

          <div className="p-4 rounded-xl bg-yellow-100/60">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-xl font-semibold text-yellow-800">
              {pendingCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-green-100/60">
            <p className="text-sm text-green-700">Completed</p>
            <p className="text-xl font-semibold text-green-800">
              {bookings.length - pendingCount}
            </p>
          </div>

        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading payments...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-20">

          <p className="text-lg font-medium">
            🎉 All payments completed
          </p>

          <p className="text-gray-400 mt-2">
            You have no pending dues
          </p>

        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">

        {bookings
          .sort((a, b) => b.finalPayableAmount - a.finalPayableAmount)
          .map(b => {

          const fullyPaid = b.finalPayableAmount === 0;

          return (
            <Card
              key={b.id}
              className="
                border border-gray-200
                hover:shadow-xl
                transition-all duration-300
              "
            >

              {/* TOP */}
              <div className="flex justify-between items-center mb-3">

                <p className="font-medium text-gray-700">
                  Booking #{b.id}
                </p>

                {fullyPaid ? (
                  <span className="text-green-600 text-sm font-medium">
                    ✔ Paid
                  </span>
                ) : (
                  <span className="text-yellow-600 text-sm font-medium">
                    Pending
                  </span>
                )}

              </div>

              {/* PRICE DETAILS */}
              <div className="text-sm text-gray-600 space-y-1 mb-4">

                <div className="flex justify-between">
                  <span>Total</span>
                  <span>₹{b.totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Wallet Used</span>
                  <span>₹{b.walletUsed || 0}</span>
                </div>

                <div className="flex justify-between font-semibold text-gray-900">
                  <span>To Pay</span>
                  <span>₹{b.finalPayableAmount}</span>
                </div>

              </div>

              {/* ACTION */}
              {!fullyPaid ? (
                <button
                  onClick={() => pay(b.id)}
                  className="
                    w-full py-2 rounded-xl text-white font-medium
                    bg-gradient-to-r from-pink-500 to-indigo-600
                    hover:scale-[1.03] active:scale-[0.97]
                    transition-all duration-300 shadow-md
                  "
                >
                  Pay ₹{b.finalPayableAmount}
                </button>
              ) : (
                <div className="text-green-600 text-sm font-medium">
                  Paid using wallet ✅
                </div>
              )}

            </Card>
          );
        })}

      </div>

    </Container>
  );
}

export default PaymentRequired;