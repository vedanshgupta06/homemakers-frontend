import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRequestedWeeklyPayouts } from "../../../../api/adminPayoutApi";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div style={{ padding: "24px" }}>
      <h2>Admin – Requested Weekly Payouts</h2>

      {payouts.length === 0 ? (
        <p>No requested payouts 🎉</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
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
                    <button
                      onClick={() =>
                        navigate(`/admin/payouts/${p.id}/pay`)
                      }
                    >
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
