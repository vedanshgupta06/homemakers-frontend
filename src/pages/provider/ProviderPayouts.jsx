import { useEffect, useState } from "react";
import { getMyPayouts, requestPayout } from "../../api/providerPayoutApi";
import { getEarningsSummary } from "../../api/providerEarningsApi";

export default function ProviderPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payoutRes, summaryRes] = await Promise.all([
        getMyPayouts(),
        getEarningsSummary()
      ]);

      setPayouts(payoutRes.data || []);
      setAvailable(summaryRes.data?.available || 0);
    } catch (err) {
      console.error("Failed to load payouts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      await requestPayout();
      alert("Withdrawal requested successfully");
      loadData();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to request withdrawal"
      );
    }
  };

  if (loading) return <p>Loading payouts...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Withdraw Earnings</h2>

      {/* Available Balance Card */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          background: "#ffffff",
          marginBottom: "30px"
        }}
      >
        <p style={{ color: "#6b7280" }}>Available Balance</p>
        <h3 style={{ color: "#16a34a" }}>₹{available}</h3>

        <button
          onClick={handleRequest}
          disabled={available <= 0}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            background: available > 0 ? "#2563eb" : "#9ca3af",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: available > 0 ? "pointer" : "not-allowed"
          }}
        >
          Request Withdrawal
        </button>
      </div>

      {/* Withdrawal History */}
      <h3>Withdrawal History</h3>

      {payouts.length === 0 ? (
        <p>No withdrawals yet.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>₹{p.amount}</td>
                <td>
                  {p.status === "INITIATED" && (
                    <span style={{ color: "#f59e0b" }}>Requested</span>
                  )}
                  {p.status === "PAID" && (
                    <span style={{ color: "#16a34a" }}>Paid ✓</span>
                  )}
                </td>
                <td>{p.createdAt?.slice(0, 10)}</td>
                <td>{p.paidAt ? p.paidAt.slice(0, 10) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
