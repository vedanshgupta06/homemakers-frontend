import { useEffect, useState } from "react";
import { 
  getMyPayouts, 
  requestPayout, 
  getWalletSummary 
} from "../../api/providerPayoutApi";

export default function ProviderPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payoutRes, walletRes] = await Promise.all([
        getMyPayouts(),
        getWalletSummary()
      ]);

      setPayouts(payoutRes.data || []);
      setWallet(walletRes.data || {});
    } catch (err) {
      console.error("Failed to load payouts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      await requestPayout();
      setMessage("Payout request submitted. Processing by admin.");
      loadData();
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        err.message ||
        "Failed to request withdrawal"
      );
    }
  };

  if (loading) return <p>Loading payouts...</p>;

  const available = wallet?.available || 0;
  const requested = wallet?.requested || 0;
  const paid = wallet?.paid || 0;
  const canWithdraw = wallet?.canWithdraw ?? false;
  const nextEligible = wallet?.nextEligibleWithdrawalDate;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Withdraw Earnings</h2>

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

        {requested > 0 && (
          <p style={{ color: "#f59e0b" }}>
            Processing: ₹{requested}
          </p>
        )}

        <p style={{ color: "#6b7280" }}>
          Total Paid: ₹{paid}
        </p>

        <button
          onClick={handleRequest}
          disabled={!canWithdraw || available <= 0}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            background:
              canWithdraw && available > 0 ? "#2563eb" : "#9ca3af",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor:
              canWithdraw && available > 0
                ? "pointer"
                : "not-allowed"
          }}
        >
          {available <= 0
            ? "No balance available"
            : !canWithdraw
            ? "Withdrawal locked (7 days)"
            : "Request Withdrawal"}
        </button>

        {!canWithdraw && nextEligible && (
          <p style={{ color: "#dc2626", marginTop: "8px" }}>
            🔒 Next withdrawal available on{" "}
            {new Date(nextEligible).toLocaleDateString()}
          </p>
        )}

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "500" }}>
            {message}
          </p>
        )}
      </div>

      <h3>Withdrawal History</h3>

      {payouts.length === 0 ? (
        <p>No withdrawals yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f3f4f6" }}>
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
                    <span style={{ color: "#f59e0b" }}>
                      Processing
                    </span>
                  )}
                  {p.status === "PAID" && (
                    <span style={{ color: "#16a34a" }}>
                      Paid ✓
                    </span>
                  )}
                  {p.status === "REJECTED" && (
                    <span style={{ color: "#dc2626" }}>
                      Rejected
                    </span>
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