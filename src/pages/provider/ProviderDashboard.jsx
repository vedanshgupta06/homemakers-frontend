import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../auth/Logout";
import { getEarningsSummary } from "../../api/providerEarningsApi";
import { getProviderBookings, acceptBooking, rejectBooking } from "../../api/providerBookingApi";
import { getOnboardingStatus } from "../../api/providerOnboardingApi";
import {
  Wallet, CalendarCheck, Clock, TrendingUp,
  IndianRupee, BookOpen, ArrowUpRight, Settings,
  Scissors, ReceiptText, ChevronRight, Activity,
  Check, X, AlertCircle, CheckCircle2, User,
  ShieldCheck, FileText, Tag, Calendar,
  MapPin, Phone, AlertTriangle
} from "lucide-react";

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, variant }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAccept = variant === "accept";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6"
        style={{ animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center
          ${isAccept ? "bg-emerald-500 shadow-lg shadow-emerald-200" : "bg-red-500 shadow-lg shadow-red-200"}`}>
          {isAccept
            ? <Check size={26} className="text-white" strokeWidth={3} />
            : <AlertTriangle size={26} className="text-white" />
          }
        </div>

        <h3 className="text-base font-black text-slate-900 text-center mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-black hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 rounded-xl text-white text-sm font-black transition-all active:scale-95 shadow-lg
              ${isAccept
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                : "bg-red-500 hover:bg-red-600 shadow-red-200"
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Booking Request Card ─────────────────────────────────────────────────────
function BookingCard({ booking: b, onAccept, onReject }) {
  const [confirmState, setConfirmState] = useState(null);

  const formatServices = (services) => {
    if (!services || services.length === 0) return "No Service";
    return services
      .map(s => s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))
      .join(", ");
  };

  const handleConfirm = () => {
    if (confirmState?.type === "accept") onAccept(b.bookingId);
    else onReject(b.bookingId);
  };

  const fullAddress = [b.address, b.area, b.city, b.pincode].filter(Boolean).join(", ");

  return (
    <>
      <ConfirmModal
        isOpen={!!confirmState}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirm}
        variant={confirmState?.type}
        title={confirmState?.type === "accept" ? "Accept this booking?" : "Reject this booking?"}
        message={
          confirmState?.type === "accept"
            ? `You're confirming the job for ${b.customerName || "this customer"}. They'll be notified right away.`
            : `You're declining the request from ${b.customerName || "this customer"}. This can't be undone.`
        }
        confirmLabel={confirmState?.type === "accept" ? "Yes, Accept" : "Yes, Reject"}
      />

      <div className="rounded-2xl border-2 border-yellow-100 bg-white overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <User size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{b.customerName || "Customer"}</p>
                {b.customerPhone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone size={9} className="text-slate-400" />
                    <span className="text-[11px] text-slate-400 font-medium">{b.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-slate-400 font-bold">#{b.bookingId}</span>
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                Pending
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
            <p className="text-xs font-black text-slate-800 leading-snug">
              🛠 {formatServices(b.services)}
            </p>
            <div className="flex flex-wrap gap-2">
              {b.serviceDate && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                  <Calendar size={10} className="text-blue-500" />
                  <span className="text-[11px] text-slate-600 font-bold">{b.serviceDate}</span>
                </div>
              )}
              {b.startTime && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                  <Clock size={10} className="text-violet-500" />
                  <span className="text-[11px] text-slate-600 font-bold">
                    {b.startTime}{b.endTime ? ` – ${b.endTime}` : ""}
                  </span>
                </div>
              )}
              {b.totalAmount && (
                <div className="flex items-center gap-1.5 bg-white border border-emerald-200 rounded-lg px-2.5 py-1">
                  <IndianRupee size={10} className="text-emerald-500" />
                  <span className="text-[11px] text-emerald-700 font-black">₹{b.totalAmount}</span>
                </div>
              )}
            </div>
          </div>

          {fullAddress && (
            <div className="flex items-start gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl px-3 py-2.5">
              <MapPin size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-0.5">Service Location</p>
                <p className="text-xs text-slate-700 font-medium leading-snug">{fullAddress}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setConfirmState({ type: "reject" })}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 text-xs font-black transition-all active:scale-95"
            >
              <X size={11} strokeWidth={4} />
              Reject
            </button>
            <button
              onClick={() => setConfirmState({ type: "accept" })}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-emerald-100"
            >
              <Check size={11} strokeWidth={4} />
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function ProviderDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // summary shape from wallet API:
  // { available, requested, paid, lastPayoutDate, canWithdraw, nextEligibleWithdrawalDate }
  const [summary, setSummary] = useState({ available: 0, requested: 0, paid: 0, total: 0 });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [earningsRes, bookingsRes, onboardingRes] = await Promise.all([
        getEarningsSummary(),
        getProviderBookings(),
        getOnboardingStatus()
      ]);
      setSummary(earningsRes.data);
      setOnboarding(onboardingRes.data);
      const pending = (bookingsRes.data || []).filter(
        b => (b.status || "").toUpperCase() === "PENDING"
      );
      setPendingBookings(pending);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    await acceptBooking(id);
    fetchDashboardData();
  };

  const handleReject = async (id) => {
    await rejectBooking(id);
    fetchDashboardData();
  };

  // Format rupee amount — handles negatives correctly
  const format = (val) => {
    const num = Number(val || 0);
    const abs = Math.abs(num).toFixed(0);
    return num < 0 ? `-₹${abs}` : `₹${abs}`;
  };

  const isNegativeBalance = Number(summary.available || 0) < 0;

  const isOnboardingComplete = onboarding &&
    onboarding.profileComplete &&
    onboarding.verified &&
    onboarding.pricingSet &&
    onboarding.hasSlots;

  const onboardingSteps = onboarding ? [
    {
      label: "Complete your profile",
      desc: "Add photo, ID proof, address proof and services",
      done: onboarding.profileComplete,
      locked: false,
      path: "/provider/profile",
      actionLabel: "Go to profile",
      icon: User
    },
    {
      label: "Get verified by admin",
      desc: "Submit your documents and wait for admin approval",
      done: onboarding.verified,
      locked: !onboarding.profileComplete,
      path: "/provider/documents",
      actionLabel: "View documents",
      icon: FileText
    },
    {
      label: "Set your pricing",
      desc: "Add a price for each service — required to appear in search",
      done: onboarding.pricingSet,
      locked: !onboarding.verified,
      path: "/provider/pricing",
      actionLabel: "Set pricing",
      icon: Tag
    },
    {
      label: "Add availability slots",
      desc: "Pick dates and times when you're available to work",
      done: onboarding.hasSlots,
      locked: !onboarding.pricingSet,
      path: "/provider/availability",
      actionLabel: "Add slots",
      icon: Calendar
    }
  ] : [];

  const completedSteps = onboardingSteps.filter(s => s.done).length;
  const progressPct = onboardingSteps.length > 0
    ? (completedSteps / onboardingSteps.length) * 100
    : 0;

  const quickActions = [
    { title: "All Bookings",  desc: "View all your jobs",   icon: BookOpen,     path: "/provider/bookings",   iconBg: "bg-blue-600"    },
    { title: "Withdrawals",   desc: "Request your payout",  icon: ArrowUpRight, path: "/provider/payouts",    iconBg: "bg-emerald-500" },
    { title: "Set Pricing",   desc: "Update your rates",    icon: Settings,     path: "/provider/pricing",    iconBg: "bg-violet-500"  },
    { title: "Deductions",    desc: "Track deductions",     icon: Scissors,     path: "/provider/deductions", iconBg: "bg-orange-500"  },
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
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Provider Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Welcome, <span className="text-blue-400">{user?.name || "Provider"}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            Manage your bookings, availability and earnings.
          </p>

          {!loading && pendingBookings.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
              <AlertCircle size={12} className="text-yellow-300" />
              <span className="text-yellow-200 text-xs font-bold">
                {pendingBookings.length} booking request{pendingBookings.length > 1 ? "s" : ""} need your response
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-[5%] pb-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ONBOARDING CHECKLIST */}
          {onboarding && !isOnboardingComplete && (
            <div className="bg-white rounded-[2rem] border-2 border-blue-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Get started</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {completedSteps} of {onboardingSteps.length} done
                </span>
              </div>
              <p className="text-slate-400 text-xs ml-11 mb-5">
                Complete these steps before you can receive bookings from users.
              </p>

              <div className="ml-11 mb-6">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {onboardingSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all
                        ${step.done
                          ? "border-emerald-100 bg-emerald-50/40 opacity-60"
                          : step.locked
                            ? "border-slate-100 bg-slate-50/50 opacity-40"
                            : "border-blue-100 bg-blue-50/30"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${step.done ? "bg-emerald-500" : step.locked ? "bg-slate-200" : "bg-blue-600"}`}>
                          {step.done
                            ? <Check size={13} className="text-white" strokeWidth={3} />
                            : <span className={`text-xs font-black ${step.locked ? "text-slate-400" : "text-white"}`}>{i + 1}</span>
                          }
                        </div>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon size={14} className={step.done ? "text-emerald-500" : step.locked ? "text-slate-300" : "text-blue-500"} />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800">{step.label}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                      {!step.done && !step.locked && (
                        <button
                          onClick={() => navigate(step.path)}
                          className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-800 flex-shrink-0 whitespace-nowrap"
                        >
                          {step.actionLabel}
                          <ChevronRight size={12} />
                        </button>
                      )}
                      {step.locked && <span className="text-[10px] text-slate-300 font-bold flex-shrink-0">Locked</span>}
                      {step.done  && <span className="text-[10px] text-emerald-500 font-bold flex-shrink-0">Done</span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <AlertCircle size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-400 font-medium">
                  Steps 3 and 4 unlock automatically once admin verifies your profile. Make sure all documents are uploaded.
                </p>
              </div>
            </div>
          )}

          {/* WALLET + STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            {/* ── Available Balance card ── */}
            <div className={`md:col-span-2 rounded-[2rem] p-6 shadow-xl flex items-center justify-between gap-4
              ${isNegativeBalance
                ? "bg-red-600 shadow-red-200"
                : "bg-blue-600 shadow-blue-200"
              }`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
                  <p className="text-3xl font-black text-white leading-none mt-1">
                    {loading ? "..." : format(summary.available)}
                  </p>
                  <p className="text-white/60 text-[10px] mt-1 font-medium">
                    {isNegativeBalance
                      ? "Penalties exceed earnings — balance will recover as you earn"
                      : "Ready to withdraw"
                    }
                  </p>
                </div>
              </div>

              {/* Only show withdraw button when balance is positive */}
              {!isNegativeBalance && (
                <button
                  onClick={() => navigate("/provider/payouts")}
                  className="flex items-center gap-1.5 bg-white text-blue-600 px-4 py-2.5 rounded-xl text-xs font-black hover:bg-blue-50 transition-all shadow-lg flex-shrink-0"
                >
                  <ArrowUpRight size={13} strokeWidth={3} />
                  Withdraw
                </button>
              )}

              {/* Show penalty warning instead when negative */}
              {isNegativeBalance && (
                <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-xl px-3 py-2">
                  <AlertTriangle size={12} className="text-white" />
                  <span className="text-white text-[10px] font-black">In Deficit</span>
                </div>
              )}
            </div>

            {/* ── Total Paid + Total Earnings ── */}
            {[
              { label: "Total Paid",     value: format(summary.paid),  iconBg: "bg-emerald-500", icon: IndianRupee },
              { label: "Total Earnings", value: format(summary.total), iconBg: "bg-violet-500",  icon: TrendingUp  },
            ].map(({ label, value, iconBg, icon: Icon }) => (
              <div key={label} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-1">{loading ? "..." : value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PENDING BOOKING REQUESTS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pendingBookings.length > 0 ? "bg-yellow-500" : "bg-slate-300"}`}>
                  <AlertCircle size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Booking Requests</h3>
                {pendingBookings.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pendingBookings.length} pending
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/provider/bookings")}
                className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                View All →
              </button>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-6">Accept or reject incoming service requests</p>

            {loading && (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!loading && pendingBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                  <CheckCircle2 size={22} className="text-emerald-500" />
                </div>
                <p className="text-sm font-black text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending requests right now.</p>
              </div>
            )}

            {!loading && pendingBookings.length > 0 && (
              <div className="space-y-3">
                {pendingBookings.map((b) => (
                  <BookingCard
                    key={b.bookingId}
                    booking={b}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>

          {/* TODAY + AVAILABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center">
                    <CalendarCheck size={14} className="text-white" />
                  </div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Today's Work</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500">0 scheduled jobs today</p>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500">0 attendance pending</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/provider/attendance")}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white text-xs font-black tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <Clock size={12} />
                Mark Attendance
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Clock size={14} className="text-white" />
                  </div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Availability</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500">Manage your working slots</p>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500">Keep updated for more bookings</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/provider/availability")}
                className="mt-4 w-full py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-xs font-black tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck size={12} />
                Update Slots
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Settings size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(({ title, desc, icon: Icon, path, iconBg }) => (
                  <div
                    key={title}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-150"
                  >
                    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900">{title}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;