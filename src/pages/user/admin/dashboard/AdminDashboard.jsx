import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getAdminSummary,
  getMonthlyRevenue,
  getServiceDistribution,
} from "../../../../api/adminAnalyticsApi";


export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    activeBookings: 0,
    pendingPayout: 0,
    activeProviders: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const summaryRes = await getAdminSummary();
      const monthlyRes = await getMonthlyRevenue();
      const serviceRes = await getServiceDistribution();

      setMetrics(summaryRes.data || {});
      setRevenueData(monthlyRes.data || []);
      setServiceData(serviceRes.data || []);
    } catch (err) {
      console.error("Failed to load admin analytics", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "25px" }}>Admin Dashboard</h2>

      {/* ================= KPI ROW ================= */}
      <div style={kpiGrid}>
        <KpiCard title="Total Revenue" value={`₹${metrics.revenue || 0}`} />
        <KpiCard title="Active Bookings" value={metrics.activeBookings || 0} />
        <KpiCard title="Pending Payouts" value={`₹${metrics.pendingPayout || 0}`} />
        <KpiCard title="Active Providers" value={metrics.activeProviders || 0} />
      </div>

      {/* ================= CHARTS ROW ================= */}
      <div style={chartGrid}>
        {/* Monthly Revenue */}
        <div style={chartCard}>
          <h4>Monthly Revenue</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div style={chartCard}>
          <h4>Service Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {serviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= ALERTS ================= */}
      <div style={{ marginTop: "40px" }}>
        <h3>Operational Alerts</h3>

        <div style={alertCard}>
          🔴 Monitor providers with high cancellation rate
        </div>

        <div style={alertCard}>
          🟠 Pending payout exposure requires review
        </div>

        <div style={alertCard}>
          🔵 New providers awaiting verification
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const KpiCard = ({ title, value }) => (
  <div style={kpiCard}>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
    <h2 style={{ marginTop: "10px" }}>{value}</h2>
  </div>
);

/* ================= STYLES ================= */

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const kpiCard = {
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
  marginTop: "40px",
};

const chartCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const alertCard = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  marginTop: "10px",
};
