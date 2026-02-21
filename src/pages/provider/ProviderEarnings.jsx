import { useEffect, useState } from "react";
import { getProviderEarnings } from "../../api/providerEarningsApi";
import { requestPayout } from "../../api/providerPayoutApi";

export default function ProviderEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const res = await getProviderEarnings();
      setEarnings(res.data || []);
    } catch (err) {
      console.error("Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const confirm = window.confirm(
      "Are you sure you want to request payout for all available earnings?"
    );
    if (!confirm) return;

    try {
      setWithdrawing(true);
      await requestPayout();
      alert("Withdrawal requested successfully!");
      loadEarnings();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to request payout"
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const availableAmount = earnings
    .filter((e) => e.status === "AVAILABLE")
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <p>Loading earnings...</p>;
  if (earnings.length === 0)
    return <p>No earnings generated yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Earnings</h2>

      {/* Withdraw Section */}
      {availableAmount > 0 && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            background: "#f8fafc"
          }}
        >
          <p>
            <strong>Available Balance:</strong> ₹{availableAmount}
          </p>

          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {withdrawing ? "Processing..." : "Withdraw"}
          </button>
        </div>
      )}

      {/* Earnings List */}
      {earnings.map((earning) => (
        <div
          key={earning.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "15px",
            background: "#ffffff"
          }}
        >
          <p><strong>Booking ID:</strong> {earning.booking?.id}</p>
          <p>
            <strong>Service Date:</strong>{" "}
            {earning.booking?.availability?.date}
          </p>
          <p>
            <strong>Customer:</strong>{" "}
            {earning.booking?.user?.email}
          </p>
          <p>
            <strong>Amount:</strong> ₹{earning.amount}
          </p>

          <StatusBadge status={earning.status} />
        </div>
      ))}
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const colors = {
    AVAILABLE: "#2563eb",
    REQUESTED: "#f59e0b",
    PAID: "#16a34a"
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold",
        background: colors[status] || "#6b7280",
        color: "white"
      }}
    >
      {status}
    </span>
  );
};
