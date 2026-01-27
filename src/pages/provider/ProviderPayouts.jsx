import { useEffect, useState } from "react";
import { getPaidWeeklyPayouts } from "../../api/providerPayoutApi";

const ProviderPayouts = () => {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    getPaidWeeklyPayouts()
      .then((res) => {
        setPayouts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPayouts([]));
  }, []);

  return (
    <div>
      <h2>My Payouts</h2>

      {payouts.length === 0 ? (
        <p>No payouts yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Week</th>
              <th>Amount</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id}>
                <td>{p.booking.id}</td>
                <td>Week {p.weekNo}</td>
                <td>₹{p.amount}</td>
                <td>{new Date(p.paidAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProviderPayouts;
