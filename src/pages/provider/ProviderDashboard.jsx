import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEarningsSummary } from "../../api/providerEarningsApi";
import ProviderAttendance from "../../pages/provider/ProviderAttendance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProviderDashboard = () => {
  const [summary, setSummary] = useState({
    pending: 0,
    paid: 0,
    total: 0,
  });

  const [displayed, setDisplayed] = useState({
    pending: 0,
    paid: 0,
    total: 0,
  });

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await getEarningsSummary();
      setSummary(res.data);
      animateNumbers(res.data);
    } catch (err) {
      console.error("Failed to load summary", err);
    }
  };

  const animateNumbers = (data) => {
    let start = 0;
    const duration = 800;
    const increment = 20;
    const steps = duration / increment;

    const interval = setInterval(() => {
      start++;
      setDisplayed({
        pending: Math.floor((data.pending / steps) * start),
        paid: Math.floor((data.paid / steps) * start),
        total: Math.floor((data.total / steps) * start),
      });

      if (start >= steps) {
        clearInterval(interval);
        setDisplayed(data);
      }
    }, increment);
  };

  const chartData = [
    { name: "Available", amount: summary.pending },
    { name: "Paid", amount: summary.paid },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "25px" }}>Provider Dashboard</h2>

      <h3>Wallet Overview</h3>

      <div style={walletGrid}>
        <WalletCard title="Available Balance" value={`₹${displayed.pending}`} color="#2563eb" />
        <WalletCard title="Total Paid" value={`₹${displayed.paid}`} color="#16a34a" />
        <WalletCard title="Total Earnings" value={`₹${displayed.total}`} color="#111827" />
      </div>

      <div style={{ marginTop: "15px", marginBottom: "40px" }}>
        <Link to="/provider/earnings">
          <button style={primaryBtn}>View Earnings History</button>
        </Link>

        <Link to="/provider/payouts" style={{ marginLeft: "15px" }}>
          <button style={secondaryBtn}>Request Withdrawal</button>
        </Link>
      </div>

      <h3>Wallet Distribution</h3>

      <div style={chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h3 style={{ marginTop: "40px" }}>Provider Setup</h3>

      <div style={cardGrid}>
        <DashboardCard title="Complete Profile" to="/provider/setup-profile" />
        <DashboardCard title="Upload Photo" to="/provider/photo" />
        <DashboardCard title="Upload Documents" to="/provider/documents" />
      </div>

      
      <h3 style={{ marginTop: "40px" }}>Work Management</h3>

     <div style={cardGrid}>
      <DashboardCard title="My Bookings" to="/provider/bookings" />
      <DashboardCard title="Availability" to="/provider/availability" />
      <DashboardCard title="Pricing" to="/provider/pricing" />
      <DashboardCard title="Attendance" to="/provider/attendance" />
    </div>

      <h3 style={{ marginTop: "40px" }}>Account & Reports</h3>

      <div style={cardGrid}>
        <DashboardCard title="Withdrawals" to="/provider/payouts" />
        <DashboardCard title="Deductions" to="/provider/deductions" />
        <DashboardCard title="Profile" to="/provider/profile" />
      </div>
    </div>
  );
};

const WalletCard = ({ title, value, color }) => (
  <div style={{
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  }}>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
    <h2 style={{ marginTop: "10px", color }}>{value}</h2>
  </div>
);

const DashboardCard = ({ title, to }) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      background: "#ffffff",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    }}>
      <h4>{title}</h4>
    </div>
  </Link>
);

const walletGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "15px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "15px",
};

const chartContainer = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  marginTop: "15px",
};

const primaryBtn = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 18px",
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ProviderDashboard;
