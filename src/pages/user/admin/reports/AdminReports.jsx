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

import Container from "../../../../components/ui/Container";
import Card from "../../../../components/ui/Card";

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
      const s = await getAdminSummary();
      const r = await getMonthlyRevenue();
      const d = await getServiceDistribution();

      setSummary(s.data || {});
      setRevenueData(r.data || []);
      setServiceData(d.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (num = 0) =>
    `₹${Math.round(num).toLocaleString("en-IN")}`;

  return (
    <Container>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-6 sm:space-y-10">

        {/* 🔥 HERO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <p className="text-xs sm:text-sm opacity-80">Total Revenue</p>

          <h1 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
            {formatCurrency(summary.revenue)}
          </h1>

          <p className="text-xs sm:text-sm mt-1 opacity-80">
            ↓ 12% compared to last period
          </p>
        </div>

        {/* 🔥 INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Insight text="📉 Revenue dropping" />
          <Insight text="🔥 Babysitting trending" />
          <Insight text="⚠️ Payout delays rising" />
        </div>

        {/* 🔥 KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <MiniCard title="Bookings" value={summary.activeBookings} />
          <MiniCard title="Providers" value={summary.activeProviders} />
          <MiniCard title="Payouts" value={formatCurrency(summary.pendingPayout)} />
          <MiniCard title="Avg Order" value="₹250" />
        </div>

        {/* 🔥 CHART 1 */}
        <Card className="p-3 sm:p-6 overflow-hidden">
          <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">
            Revenue Trend
          </h3>

          <div className="w-full h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
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
        </Card>

        {/* 🔥 CHART 2 */}
        <Card className="p-3 sm:p-6 overflow-hidden">
          <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">
            Service Distribution
          </h3>

          <div className="w-full h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </Container>
  );
}

/* 🔹 COMPONENTS */

const Insight = ({ text }) => (
  <Card className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
    {text}
  </Card>
);

const MiniCard = ({ title, value }) => (
  <Card className="p-3 sm:p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-sm sm:text-lg font-semibold mt-1">{value}</p>
  </Card>
);