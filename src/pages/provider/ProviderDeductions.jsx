import { useEffect, useState } from "react";
import { getMyDeductions } from "../../api/providerDeductionApi";

const ProviderDeductions = () => {
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDeductions()
      .then((res) => setDeductions(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading deductions...</p>;

  return (
    <div>
      <h2>My Deductions</h2>

      {deductions.length === 0 ? (
        <p>No deductions</p>
      ) : (
        <table>
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
                <td>{d.createdAt?.split("T")[0]}</td>
                <td>{d.type}</td>
                <td>₹{d.amount}</td>
                <td>{d.reason}</td>
                <td>
                  {d.state === "PROPOSED" && "🟡 Under Review"}
                  {d.state === "APPROVED" && "🟠 Approved"}
                  {d.state === "APPLIED" && "🔴 Applied"}
                  {d.state === "WAIVED" && "✅ Waived"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProviderDeductions;
