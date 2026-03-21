import { useEffect, useState } from "react";
import { getPayoutHistory } from "../../../../api/adminPayoutApi";

const AdminPayoutHistory = () => {

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    try {

      const res = await getPayoutHistory();

      setPayouts(Array.isArray(res.data) ? res.data : []);

    } catch (err) {

      console.error("Error loading history", err);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div style={{ padding: "30px" }}>

      <h2>Payout History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : payouts.length === 0 ? (
        <p>No payout history.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Booking</th>
              <th>Week</th>
              <th>Amount</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {payouts.map((p) => (

              <tr key={p.id}>

                <td>{p.id}</td>

                <td>{p.providerEmail}</td>

                <td>{p.serviceName}</td>

                <td>#{p.bookingId}</td>

                <td>Week {p.weekNo}</td>

                <td>₹{p.amount}</td>

                <td>{new Date(p.createdAt).toLocaleDateString()}</td>

                <td>{p.status}</td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );

};

export default AdminPayoutHistory;