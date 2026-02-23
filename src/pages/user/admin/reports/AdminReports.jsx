import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  getAdminSummary,
  getMonthlyRevenue,
  getServiceDistribution,
} from "../../../../api/adminAnalyticsApi";

export default function AdminReports() {
  const [summary, setSummary] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const summaryRes = await getAdminSummary();
      const revenueRes = await getMonthlyRevenue();
      const serviceRes = await getServiceDistribution();

      setSummary(summaryRes.data || {});
      setRevenueData(revenueRes.data || []);
      setServiceData(serviceRes.data || []);
    } catch (err) {
      console.error("Failed to load admin reports", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "25px" }}>Admin Reports & Analytics</h2>

      {/* SUMMARY CARDS */}
      <div style={summaryGrid}>
        <SummaryCard title="Total Revenue" value={`₹${summary.revenue || 0}`} />
        <SummaryCard title="Active Bookings" value={summary.activeBookings || 0} />
        <SummaryCard title="Pending Payout" value={`₹${summary.pendingPayout || 0}`} />
        <SummaryCard title="Active Providers" value={summary.activeProviders || 0} />
      </div>

      {/* CHARTS */}
      <div style={chartGrid}>
        <div style={chartCard}>
          <h4>Monthly Revenue</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={chartCard}>
          <h4>Service Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value }) => (
  <div style={summaryCard}>
    <p style={{ color: "#6b7280" }}>{title}</p>
    <h2 style={{ marginTop: "10px" }}>{value}</h2>
  </div>
);

/* ================= STYLES ================= */

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const summaryCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const chartCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};