import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../auth/Logout";
import { getEarningsSummary } from "../../api/providerEarningsApi";

function ProviderDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({
    pending: 0,
    paid: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await getEarningsSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const format = (val) => `₹ ${Number(val || 0).toFixed(0)}`;

  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Welcome back, {user?.name || "Provider"}
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your work and earnings efficiently
          </p>
        </div>

        {/* 💰 WALLET */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 flex justify-between items-center shadow-md">

          <div>
            <p className="text-sm opacity-80">Available Balance</p>

            <p className="text-4xl font-semibold mt-1">
              {loading ? "..." : format(summary.pending)}
            </p>

            <p className="text-xs opacity-70 mt-1">
              Ready to withdraw
            </p>
          </div>

          <button
            onClick={() => navigate("/provider/payouts")}
            className="bg-white text-blue-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Withdraw
          </button>
        </div>

        {/* 🔥 TODAY'S WORK */}
        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm font-semibold text-gray-800 mb-3">
            Today’s Work
          </p>

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                You have 0 scheduled jobs today
              </p>

              <p className="text-sm text-gray-500 mt-1">
                0 attendance pending
              </p>
            </div>

            <button
              onClick={() => navigate("/provider/attendance")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              Mark Attendance
            </button>

          </div>

        </div>

        {/* 🔥 AVAILABILITY */}
        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm font-semibold text-gray-800 mb-3">
            Availability
          </p>

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                Manage your working slots
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Keep this updated to get more bookings
              </p>
            </div>

            <button
              onClick={() => navigate("/provider/availability")}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
            >
              Update Slots
            </button>

          </div>

        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xl font-semibold text-gray-900">
              {format(summary.paid)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total Paid
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xl font-semibold text-gray-900">
              {format(summary.total)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total Earnings
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xl font-semibold text-gray-900">
              —
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Jobs This Week
            </p>
          </div>

        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-3">
            Quick Actions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {[
              { title: "Bookings", path: "/provider/bookings" },
              { title: "Withdrawals", path: "/provider/payouts" },
              { title: "Set Pricing", path: "/provider/pricing" },
              { title: "Deductions", path: "/provider/deductions" },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="
                  bg-white border border-gray-200
                  rounded-xl p-5 cursor-pointer
                  hover:border-blue-400 hover:shadow-sm
                  transition
                "
              >
                <p className="font-medium text-gray-900">
                  {item.title}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* 🧾 ACTIVITY */}
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Recent Activity
          </p>

          <p className="text-sm text-gray-500">
            No activity yet — your work updates will appear here.
          </p>
        </div>

        {/* 🚪 LOGOUT */}
        <div className="pt-4">
          <Logout />
        </div>

      </div>
    </div>
  );
}

export default ProviderDashboard;