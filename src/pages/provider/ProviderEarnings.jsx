import { useEffect, useState } from "react";
import {
  getWeeklySummary,
  requestWeeklyPayout,
} from "../../api/providerPayoutTransactionApi";

export default function ProviderEarnings() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      const res = await getWeeklySummary();
      setSummaries(res.data);
    } catch (err) {
      console.error("Failed to load weekly summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleWithdraw = async (bookingId, weekNo, amount) => {
    try {
      await requestWeeklyPayout(bookingId, weekNo, amount); // ✅ FIX
      alert("Weekly payout requested");
      loadSummary();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to request payout"
      );
    }
  };

  if (loading) return <p>Loading weekly salary...</p>;
  if (summaries.length === 0)
    return <p>No weekly payouts available</p>;

  return (
    <div>
      <h2>Weekly Salary (This Month)</h2>

      {summaries.map((summary) => (
        <div key={`${summary.bookingId}-${summary.serviceName}`}>
          <h4>
            Booking #{summary.bookingId} — {summary.serviceName}
          </h4>

          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Week</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {summary.weeks.map((week) => (
                <tr key={week.weekNo}>
                  <td>Week {week.weekNo}</td>
                  <td>₹{week.amount}</td>
                  <td>{week.status}</td>
                  <td>
                    {week.status === "AVAILABLE" && (
                      <button
                        onClick={() =>
                          handleWithdraw(
                            summary.bookingId,
                            week.weekNo,
                            week.amount
                          )
                        }
                      >
                        Withdraw
                      </button>
                    )}

                    {week.status === "PENDING" && (
                      <span style={{ color: "orange" }}>
                        Requested
                      </span>
                    )}

                    {week.status === "PAID" && (
                      <span style={{ color: "green" }}>
                        Paid ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
        </div>
      ))}
    </div>
  );
}
