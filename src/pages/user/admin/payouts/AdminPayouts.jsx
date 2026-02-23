import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRequestedWeeklyPayouts } from "../../../../api/adminPayoutApi";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const res = await getRequestedWeeklyPayouts();
      setPayouts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading weekly payouts", err);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "25px" }}>
        Admin – Weekly Payout Requests
      </h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div style={summaryGrid}>
        <SummaryCard
          title="Total Requested"
          value={`₹${totalAmount}`}
        />
        <SummaryCard
          title="Pending Requests"
          value={payouts.length}
        />
      </div>

      {/* ===== TABLE ===== */}
      {loading ? (
        <p>Loading payouts...</p>
      ) : payouts.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={tableCard}>
          <table style={tableStyle}>
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
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    {p.status === "REQUESTED" && (
                      <button
                        style={payButton}
                        onClick={() =>
                          navigate(`/admin/payouts/${p.id}/pay`)
                        }
                      >
                        Approve & Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value }) => (
  <div style={summaryCard}>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
    <h2 style={{ marginTop: "10px" }}>{value}</h2>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    REQUESTED: "#f59e0b",
    PAID: "#16a34a",
    REJECTED: "#dc2626",
  };

  return (
    <span
      style={{
        background: colors[status] || "#6b7280",
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
};

const EmptyState = () => (
  <div style={emptyCard}>
    <h3>No pending payouts 🎉</h3>
    <p>All provider payouts are processed.</p>
  </div>
);

/* ================= STYLES ================= */

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const tableCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const payButton = {
  background: "#2563eb",
  color: "white",
  padding: "6px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const emptyCard = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

export default AdminPayouts;