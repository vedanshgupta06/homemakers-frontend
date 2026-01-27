import { useEffect, useState } from "react";
import {
  getWeeklySummary,
  requestWeeklyPayout,
} from "../../api/providerPayoutTransactionApi";

export default function ProviderWeeklyPayout() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const res = await getWeeklySummary();
    setSummary(res.data);
  };

  const withdraw = async () => {
    await requestWeeklyPayout(summary.weeklyAmount);
    loadSummary();
  };

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h3>Weekly Salary – {summary.month}</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Week</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {summary.weeks.map((w) => (
            <tr key={w.week}>
              <td>Week {w.week}</td>
              <td>₹{summary.weeklyAmount}</td>
              <td>{w.status}</td>
              <td>
                {w.status === "AVAILABLE" ? (
                  <button onClick={withdraw}>Withdraw</button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
