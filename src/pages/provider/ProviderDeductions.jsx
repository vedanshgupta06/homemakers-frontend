import { useEffect, useState } from "react";
import { getMyDeductions } from "../../api/providerDeductionApi";

const typeLabel = {
  SERVICE_QUALITY: "Service Quality",
  PROVIDER_CANCELLATION: "Provider Cancellation",
  EXCESS_HOLIDAY: "Excess Holiday",
  SYSTEM_ADJUSTMENT: "System Adjustment"
};

const stateLabel = {
  PROPOSED: "🟡 Under Review",
  APPROVED: "🟠 Approved",
  APPLIED: "🔴 Applied",
  WAIVED: "✅ Waived"
};

const ProviderDeductions = () => {
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyDeductions()
      .then((res) => {
        setDeductions(res.data || []);
        setError("");
      })
      .catch(() => {
        setError("Failed to load deductions");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading deductions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Deductions</h2>

      {deductions.length === 0 ? (
        <p>No deductions</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "12px"
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {deductions.map((d) => (
              <tr key={d.id}>
                <td>{d.createdAt ? d.createdAt.split("T")[0] : "-"}</td>
                <td>{typeLabel[d.type] || d.type}</td>
                <td>₹{Number(d.amount).toFixed(2)}</td>
                <td>{d.reason || "-"}</td>
                <td>{stateLabel[d.state] || d.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProviderDeductions;
