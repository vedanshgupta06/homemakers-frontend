import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWalletBalance } from "../../api/walletApi";
import api from "../../api/axios";
import Logout from "../../auth/Logout";

/* =========================
   SERVICES STRIP (DYNAMIC)
========================= */
function ServicesStrip({ navigate }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get("/api/services");
      setServices(res.data || []);
    } catch (err) {
      console.error(err);

      // fallback (important)
      setServices([
        { name: "CLEANING" },
        { name: "COOKING" },
        { name: "BABYSITTING" },
      ]);
    }
  };

  return (
    <div>
      <p className="text-xs text-gray-400 uppercase mb-3 tracking-wide">
        Popular Services
      </p>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">

        {services.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(`/user/services?type=${s.name}`)}
            className="
              min-w-[160px] snap-start
              bg-white border border-gray-200
              rounded-xl p-4 cursor-pointer

              hover:border-blue-400 hover:shadow-sm
              transition
            "
          >
            <p className="font-medium text-gray-900">
              {s.name.replace("_", " ")}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Book now →
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

/* =========================
   MAIN DASHBOARD
========================= */
function UserDashboard() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    rating: 0,
  });
 const [activity, setActivity] = useState([]);
 const loadRecentActivity = async () => {
  try {
    const res = await api.get("/api/users/recent-activity");
    setActivity(res.data || []);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchWallet();
    fetchProfile();
    loadStats();
    loadRecentActivity(); 
  }, []);

  const fetchWallet = async () => {
    try {
      const balance = await getWalletBalance();
      setWallet(balance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const loadStats = async () => {
  try {
    const res = await api.get("/api/users/dashboard-stats");

    setStats({
      total: res.data.totalBookings,   // ✅ FIX
      upcoming: res.data.upcoming,
      rating: res.data.rating || 0,
    });

  } catch (err) {
    console.error(err);
  }
};

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const actions = [
    {
      title: "Book a Service",
      path: "/user/services",
      sub: "Schedule a visit",
      primary: true,
    },
    {
      title: "My Bookings",
      path: "/user/bookings",
      sub: "Upcoming & past",
    },
    {
      title: "Pending Payments",
      path: "/user/payments",
      sub: "Clear dues",
    },
    {
      title: "Attendance Approval",
      path: "/user/attendance",
      sub: "Approve check-ins",
    },
    {
      title: "Payment History",
      path: "/user/payments/history",
      sub: "Past transactions",
    },
  ];

  /* =========================
     SMART SORTING (USAGE BASED)
  ========================== */
  const sortActions = (actions) => {
    const usage = JSON.parse(localStorage.getItem("actionUsage") || "{}");

    return [...actions].sort((a, b) => {
      return (usage[b.title] || 0) - (usage[a.title] || 0);
    });
  };

  const handleActionClick = (item) => {
    const usage = JSON.parse(localStorage.getItem("actionUsage") || "{}");
    usage[item.title] = (usage[item.title] || 0) + 1;
    localStorage.setItem("actionUsage", JSON.stringify(usage));

    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <div>
          <p className="text-sm text-gray-500">{greeting()},</p>

          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {user?.name || "User"}
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your home services efficiently
          </p>
        </div>

        {/* WALLET */}
        <div className="relative overflow-hidden bg-blue-600 text-white rounded-2xl p-6 flex justify-between items-center shadow-md">

          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

          <div className="relative">
            <p className="text-sm opacity-80">Wallet Balance</p>

            <p className="text-4xl font-semibold mt-1">
              {loading ? (
                <span className="inline-block h-8 w-20 bg-white/30 rounded animate-pulse"></span>
              ) : (
                `₹ ${wallet}`
              )}
            </p>

            <p className="text-xs opacity-70 mt-1">
              Available to spend
            </p>
          </div>

          <button
            onClick={() => navigate("/user/wallet")}
            className="
              relative
              bg-white text-blue-600
              px-5 py-2 rounded-lg text-sm font-medium
              hover:bg-gray-100 active:scale-95 transition
            "
          >
            Recharge
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total bookings", val: stats.total },
            { label: "Upcoming", val: stats.upcoming },
            { label: "Avg rating", val: stats.rating || "—" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
            >
              <p className="text-xl font-semibold text-gray-900">
                {item.val}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* SERVICES STRIP */}
        <ServicesStrip navigate={navigate} />

        {/* ACTIONS */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-3 tracking-wide">
            Quick Actions
          </p>

          <div className="grid grid-cols-3 gap-4">
            {sortActions(actions).map((item, i) => (
              <div
                key={i}
                onClick={() => handleActionClick(item)}
                className={`
                  rounded-xl p-5 cursor-pointer border transition-all

                  ${item.primary
                    ? "bg-blue-600 text-white border-blue-600 hover:shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm"}
                `}
              >
                <p className={`font-medium ${item.primary ? "text-white" : "text-gray-900"}`}>
                  {item.title}
                </p>

                <p className={`text-sm mt-1 ${item.primary ? "text-white/80" : "text-gray-500"}`}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
<div className="bg-white border rounded-xl p-4">
  <p className="text-sm font-medium text-gray-700 mb-3">
    Recent Activity
  </p>

  {activity.length === 0 ? (
    <p className="text-sm text-gray-500">
      No activity yet. Your bookings and payments will appear here.
    </p>
  ) : (
    <div className="space-y-3">
      {activity.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-2 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">
              {item.message}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(item.time).toLocaleString()}
            </p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              item.type === "PAYMENT"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.type}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

        {/* LOGOUT */}
        <div className="pt-4">
          <Logout />
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;