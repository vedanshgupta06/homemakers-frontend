
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  getAdminSummary, getMonthlyRevenue,
  getServiceDistribution, getBookingRevenue,
} from "../../../../api/adminAnalyticsApi";
import {
  TrendingUp, Briefcase, IndianRupee, Users,
  AlertTriangle, ArrowRight, BarChart3,
  PieChart as PieIcon, ShieldCheck, Wallet,
  CreditCard, CalendarDays
} from "lucide-react";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
const PERIODS = [
  { key: "DAY",     label: "Today"   },
  { key: "MONTH",   label: "Month"   },
  { key: "QUARTER", label: "Quarter" },
  { key: "YEAR",    label: "Year"    },
  { key: "ALL",     label: "All Time"},
];

export default function AdminDashboard() {
  const [metrics, setMetrics]         = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [bookingRev, setBookingRev]   = useState({});
  const [period, setPeriod]           = useState("ALL");
  const [loading, setLoading]         = useState(true);
  const [revLoading, setRevLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadAnalytics(); }, []);
  useEffect(() => { loadBookingRevenue(); }, [period]);

  const loadAnalytics = async () => {
    try {
      const [summary, monthly, service] = await Promise.all([
        getAdminSummary(),
        getMonthlyRevenue(),
        getServiceDistribution(),
      ]);
      setMetrics(summary.data || {});
      setRevenueData(monthly.data || []);
      setServiceData(service.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookingRevenue = async () => {
    setRevLoading(true);
    try {
      const res = await getBookingRevenue(period);
      setBookingRev(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setRevLoading(false);
    }
  };

  const fmt = (num = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(num);

  const kpis = [
    { title: "Settled Revenue",  value: fmt(metrics.revenue),          sub: "Paid provider earnings",    icon: TrendingUp,  iconBg: "bg-blue-600"    },
    { title: "Active Bookings",  value: metrics.activeBookings ?? 0,   sub: "Currently confirmed",        icon: Briefcase,   iconBg: "bg-emerald-500" },
    { title: "Pending Payout",   value: fmt(metrics.pendingPayout),    sub: "Available to providers",     icon: Wallet,      iconBg: "bg-orange-500"  },
    { title: "Total Providers",  value: metrics.activeProviders || 0,  sub: "Registered on platform",     icon: Users,       iconBg: "bg-violet-500"  },
  ];

  const quickLinks = [
    { label: "All Bookings",      path: "/admin/bookings",          iconBg: "bg-blue-600"    },
    { label: "Providers",         path: "/admin/providers",         iconBg: "bg-emerald-500" },
    { label: "Payout Requests",   path: "/admin/payouts/requests",  iconBg: "bg-orange-500"  },
    { label: "Payout History",    path: "/admin/payouts/history",   iconBg: "bg-violet-500"  },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-16 pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Admin <span className="text-blue-400">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            Platform analytics and financial overview.
          </p>
          {!loading && metrics.revenue > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-5 py-2">
              <IndianRupee size={13} className="text-white" />
              <span className="text-white text-sm font-black">
                {fmt(metrics.revenue)} Settled Revenue
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-10 relative z-10 space-y-5">

          {/* KPI GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {kpis.map(({ title, value, sub, icon: Icon, iconBg }) => (
              <div key={title} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className="text-white" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{title}</p>
                </div>
                <p className="text-xl font-black text-slate-900 leading-none">{loading ? "..." : value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* SERVICE COLLECTION CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <CreditCard size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                    Service Collections
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Total amount collected from paid bookings
                  </p>
                </div>
              </div>

              {/* PERIOD FILTER */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap">
                {PERIODS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPeriod(key)}
                    className={`px-3 h-8 rounded-lg text-xs font-black transition-all duration-150 whitespace-nowrap
                      ${period === key
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {revLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Total Collected */}
                <div className="p-5 rounded-2xl bg-blue-600 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                      <IndianRupee size={13} className="text-white" />
                    </div>
                    <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Total Collected</p>
                  </div>
                  <p className="text-3xl font-black text-white leading-none">{fmt(bookingRev.totalCollected)}</p>
                  <p className="text-blue-200 text-[10px] font-medium mt-2">
                    From {bookingRev.paidBookingsCount || 0} paid booking{bookingRev.paidBookingsCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Via Stripe */}
                <div className="p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/30 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <CreditCard size={13} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Via Stripe</p>
                  </div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{fmt(bookingRev.stripeCollected)}</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-2">Online card payments</p>
                </div>
                {/* Via Razorpay */}
                <div className="p-5 rounded-2xl border-2 border-blue-100 bg-blue-50/30 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                      <CreditCard size={13} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Via Razorpay</p>
                  </div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{fmt(bookingRev.razorpayCollected)}</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-2">UPI / Netbanking</p>
                </div>
                {/* Via Wallet */}
                <div className="p-5 rounded-2xl border-2 border-orange-100 bg-orange-50/30 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                      <Wallet size={13} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Via Wallet</p>
                  </div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{fmt(bookingRev.walletUsedTotal)}</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-2">Wallet balance used</p>
                </div>

              </div>
            )}
          </div>

          {/* REVENUE NOTE */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl">
            <ShieldCheck size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-blue-700">Revenue Breakdown Explained</p>
              <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                <strong>Settled Revenue</strong> = provider earnings marked PAID (actual money paid to providers).
                <strong> Service Collections</strong> = total amount collected from customers on paid bookings (Stripe + Wallet).
                <strong> Pending Payout</strong> = earned by providers but not yet transferred.
              </p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map(({ label, path, iconBg }) => (
              <button key={label} onClick={() => navigate(path)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-150 group">
                <span className="text-sm font-black text-slate-800">{label}</span>
                <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <ArrowRight size={13} className="text-white" strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <BarChart3 size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Monthly Revenue</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Settled earnings by month</p>
                </div>
              </div>
              {revenueData.length === 0 ? (
                <div className="h-[240px] flex items-center justify-center">
                  <p className="text-xs font-black text-slate-400">No revenue data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#cbd5e1" tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }} />
                    <YAxis stroke="#cbd5e1" tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 700 }} />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3}
                      dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#2563eb" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
                  <PieIcon size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Service Distribution</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Completed bookings by service</p>
                </div>
              </div>
              {serviceData.length === 0 ? (
                <div className="h-[240px] flex items-center justify-center">
                  <p className="text-xs font-black text-slate-400">No service data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={serviceData} dataKey="value" outerRadius={85} innerRadius={40} paddingAngle={3}>
                      {serviceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 700 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 700 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ALERTS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
                <AlertTriangle size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Operational Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-100">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-sm font-bold text-red-700">High cancellation rate detected among providers</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-100">
                <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                <p className="text-sm font-bold text-yellow-700">
                  Pending payout exposure: {fmt(metrics.pendingPayout)} — requires review
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border-2 border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm font-bold text-blue-700">New providers awaiting verification</p>
                <button onClick={() => navigate("/admin/providers")}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all flex-shrink-0">
                  Review <ArrowRight size={11} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}