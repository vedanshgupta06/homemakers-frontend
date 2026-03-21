import { useEffect, useState } from "react";
import {
  getPayoutRequests,
  markPayoutPaid
} from "../../../../api/adminPayoutApi";

const AdminPayouts = () => {

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const res = await getPayoutRequests();
      setPayouts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading payouts", err);
    } finally {
      setLoading(false);
    }
  };

  const approvePayout = async (id) => {

    const confirm = window.confirm("Approve and mark payout as PAID?");

    if (!confirm) return;

    try {

      await markPayoutPaid(id);

      alert("Payout marked as paid");

      loadPayouts();

    } catch (err) {

      console.error(err);

      alert("Failed to mark payout");

    }
  };

  const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div style={{ padding: "30px" }}>

      <h2 style={{ marginBottom: "25px" }}>
        Admin – Provider Payouts
      </h2>

      {/* SUMMARY */}
      <div style={summaryGrid}>

        <SummaryCard
          title="Total Requested"
          value={`₹${totalAmount}`}
        />

        <SummaryCard
          title="Pending Requests"
          value={payouts.filter(p => p.status === "REQUESTED").length}
        />

      </div>

      {/* TABLE */}

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
                <th>Service</th>
                <th>Booking</th>
                <th>Week</th>
                <th>Amount</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {payouts.map((p) => (

                <tr key={p.id}>

                  <td>{p.id}</td>

                  {/* Provider */}
                  <td>
                    <div style={{ fontWeight: "600" }}>
                      {p.providerName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {p.providerEmail}
                    </div>
                  </td>

                  {/* Service */}
                  <td>{p.serviceName}</td>

                  {/* Booking */}
                  <td>#{p.bookingId}</td>

                  {/* Week */}
                  <td>Week {p.weekNo}</td>

                  {/* Amount */}
                  <td style={{ fontWeight: "600" }}>
                    ₹{p.amount}
                  </td>

                  {/* Created Date */}
                  <td>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={p.status} />
                  </td>

                  {/* Approve Button */}
                  <td>

                    {p.status === "INITIATED" && (

                      <button
                        style={payButton}
                        onClick={() => approvePayout(p.id)}
                      >
                        Approve
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


/* COMPONENTS */

const SummaryCard = ({ title, value }) => (

  <div style={summaryCard}>

    <p style={{ color: "#6b7280", fontSize: "14px" }}>
      {title}
    </p>

    <h2 style={{ marginTop: "10px" }}>
      {value}
    </h2>

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


/* STYLES */

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