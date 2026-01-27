import { useEffect, useState } from "react";
import {
  getRequestedWeeklyPayouts,
  payWeeklyPayout,
} from "../../../api/adminPayoutApi";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    getRequestedWeeklyPayouts()
      .then((res) => {
        console.log("ADMIN WEEKLY PAYOUTS:", res.data);
        setPayouts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error loading weekly payouts", err);
        setPayouts([]);
      });
  }, []);

 const handlePay = (id) => {
  payWeeklyPayout(id, "ADMIN_MANUAL_PAY")
    .then(() => {
      setPayouts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Weekly payout marked as PAID");
    })
    .catch(() => {
      alert("❌ Failed to pay weekly payout");
    });
};


  return (
    <div>
      <h2>Admin – Requested Weekly Payouts</h2>

      {payouts.length === 0 ? (
        <p>No requested payouts 🎉</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Booking</th>
              <th>Week</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.provider?.id}</td>
                <td>{p.booking?.id}</td>
                <td>Week {p.weekNo}</td>
                <td>₹{p.amount}</td>
                <td>{p.status}</td>
                <td>
                  {p.status === "REQUESTED" && (
                    <button onClick={() => handlePay(p.id)}>
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPayouts;
