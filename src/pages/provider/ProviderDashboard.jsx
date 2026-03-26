import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEarningsSummary } from "../../api/providerEarningsApi";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
      console.error(err);
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

  const formatCurrency = (val) =>
    `₹ ${Number(val || 0).toFixed(2)}`;

  return (
    <Container>
      <div className="space-y-10 animate-fadeIn">

        {/* 🔥 HEADER */}
        <div className="relative">

          <div className="
            absolute -top-20 -left-10 w-80 h-80 
            bg-pink-400/20 blur-3xl rounded-full
          "></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="
                text-3xl font-bold 
                bg-brand-gradient bg-clip-text text-transparent
              ">
                Welcome back, {user?.name || "Provider"}
              </h2>

              <p className="text-textSub mt-2">
                Manage your work and earnings
              </p>
            </div>

            <Button onClick={() => navigate("/provider/pricing")}>
              Set Pricing
            </Button>

          </div>
        </div>

        {/* 💳 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <StatCard
            title="Available Balance"
            value={formatCurrency(displayed.pending)}
          />

          <StatCard
            title="Total Paid"
            value={formatCurrency(displayed.paid)}
          />

          <StatCard
            title="Total Earnings"
            value={formatCurrency(displayed.total)}
          />

        </div>

        {/* ⚡ ACTIONS */}
        <Card>
          <h3 className="font-semibold mb-5">Quick Actions</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

            <ActionCard title="Bookings" onClick={() => navigate("/provider/bookings")} />
            <ActionCard title="Availability" onClick={() => navigate("/provider/availability")} />
            <ActionCard title="Attendance" onClick={() => navigate("/provider/attendance")} />
            <ActionCard title="Withdrawals" onClick={() => navigate("/provider/payouts")} />
            <ActionCard title="Deductions" onClick={() => navigate("/provider/deductions")} />
            <ActionCard title="Set Pricing" onClick={() => navigate("/provider/pricing")} />

          </div>
        </Card>

        {/* 📝 ACTIVITY */}
        <Card>
          <h3 className="font-semibold mb-2">Recent Activity</h3>

          <p className="text-gray-400 text-sm">
            You don’t have any activity yet — your updates will appear here.
          </p>
        </Card>

      </div>
    </Container>
  );
};

/* 🔥 STAT CARD (CLEAN) */
const StatCard = ({ title, value }) => (
  <Card className="
    p-5 bg-brand-gradient text-white 
    shadow-glow
    hover:scale-[1.02] hover:shadow-xl
    transition-all duration-300
  ">
    <p className="text-sm opacity-80">{title}</p>

    <p className="text-2xl font-bold mt-2 tracking-tight">
      {value}
    </p>
  </Card>
);

/* 🔥 ACTION CARD (NO ICON, PREMIUM FEEL) */
const ActionCard = ({ title, onClick }) => (
  <Card
    onClick={onClick}
    className="
      group cursor-pointer p-5
      border border-gray-200
      hover:border-purple-300
      hover:shadow-xl hover:scale-[1.04]
      transition-all duration-300
    "
  >
    <p className="
      text-sm font-medium text-textMain
      group-hover:text-purple-600 transition
    ">
      {title}
    </p>

    {/* subtle accent line */}
    <div className="
      mt-3 h-[2px] w-0 
      bg-brand-gradient
      group-hover:w-full
      transition-all duration-300
    " />
  </Card>
);

export default ProviderDashboard;