


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  ArrowLeft, User, MapPin, CalendarDays, Clock,
  IndianRupee, CheckCircle2, XCircle, AlertCircle,
  Briefcase, ShieldCheck, TrendingUp, Calendar,
  Check, X, Minus, AlertTriangle, Wallet
} from "lucide-react";

const statusConfig = {
  PENDING:             { label: "Pending",     bg: "bg-yellow-100",  text: "text-yellow-700",  border: "border-yellow-200",  dot: "bg-yellow-500"  },
  CONFIRMED:           { label: "Confirmed",   bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  SERVICE_IN_PROGRESS: { label: "In Progress", bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
  COMPLETED:           { label: "Completed",   bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-600"    },
  REJECTED:            { label: "Cancelled",   bg: "bg-red-100",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400"     },
  TERMINATED:          { label: "Terminated",  bg: "bg-orange-100",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500"  },
  CANCELLED:           { label: "Cancelled",   bg: "bg-red-100",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400"     },
};

const paymentConfig = {
  PENDING:          { label: "Pending",          bg: "bg-yellow-100",  text: "text-yellow-700" },
  PAID:             { label: "Paid",             bg: "bg-emerald-100", text: "text-emerald-700" },
  PAYMENT_REQUIRED: { label: "Payment Required", bg: "bg-red-100",     text: "text-red-600"    },
  REFUNDED:         { label: "Refunded",         bg: "bg-blue-100",    text: "text-blue-700"   },
};

const workStatusConfig = {
  PRESENT:           { label: "Present",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: Check,        iconBg: "bg-emerald-500" },
  CONFIRMED_PRESENT: { label: "Confirmed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2, iconBg: "bg-emerald-600" },
  ABSENT:            { label: "Absent",    bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     icon: X,            iconBg: "bg-red-400"     },
  LEAVE:             { label: "Leave",     bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  icon: Minus,        iconBg: "bg-orange-400"  },
  REJECTED:          { label: "Rejected",  bg: "bg-slate-50",   text: "text-slate-500",   border: "border-slate-200",   icon: XCircle,      iconBg: "bg-slate-400"   },
};

// ── Paid leave entitlement rule (mirrors backend exactly) ─────────────────
// worked > 25 → 3 paid leaves
// worked > 15 → 2 paid leaves
// worked >  5 → 1 paid leave
// otherwise   → 0
// Capped by total non-worked days (absent + leave) so we never
// give more paid leave credit than days actually missed.
function getPaidLeavesAllowed(workedDays) {
  if (workedDays > 23) return 3;
  if (workedDays > 15) return 2;
  if (workedDays > 5)  return 1;
  return 0;
}

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookingRes, logsRes] = await Promise.all([
          api.get(`/api/bookings/${id}`),
          api.get(`/api/bookings/${id}/work-logs`)
        ]);
        setBooking(bookingRes.data);
        setLogs(logsRes.data || []);
      } catch (err) {
        console.error("Failed to load booking details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatDay = (d) => {
    if (!d) return { day: "—", date: "—" };
    const date = new Date(d);
    return {
      day:  date.toLocaleDateString("en-IN", { weekday: "short" }),
      date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    };
  };

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#1E293B] pt-16 pb-24 px-[5%]">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 w-56 bg-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="px-[5%] pb-16">
          <div className="max-w-3xl mx-auto -mt-10 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 space-y-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 font-bold">Booking not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 text-sm font-black">← Go Back</button>
        </div>
      </div>
    );
  }

  const status       = statusConfig[booking.status]         || statusConfig.PENDING;
  const payment      = paymentConfig[booking.paymentStatus] || paymentConfig.PENDING;
  const providerName = booking.providerName || "Provider";
  const providerCity = booking.providerCity || "—";
  const isVerified   = booking.providerVerified;


  // ── Attendance counts from work logs ──────────────────────────────────
  const activeLogs  = logs.filter(l => l.status !== "REJECTED");
  const presentDays = activeLogs.filter(l => l.status === "PRESENT" || l.status === "CONFIRMED_PRESENT").length;
  const absentDays  = activeLogs.filter(l => l.status === "ABSENT").length;
  const leaveDays   = activeLogs.filter(l => l.status === "LEAVE").length;
  const totalLogged = activeLogs.length;

  // ── Refund calculation for TERMINATED bookings ─────────────────────────
  // Mirrors ProviderLeaveSettlementService + terminateBooking exactly:
  //
  // 1. paidLeavesAllowed = range-based on workedDays
  // 2. totalNonWorkedDays = leaveDays + absentDays
  //    → caps paid leave so we never credit more than days actually missed
  // 3. paidLeaves = min(paidLeavesAllowed, totalNonWorkedDays)
  //    → covers both explicit leave AND absent days with remaining entitlement
  // 4. chargeableDays = workedDays + paidLeaves
  // 5. refund = totalPrice − (chargeableDays × totalPrice/30)
  const isTerminated       = booking.status === "TERMINATED";
  const wasRefunded        = isTerminated && booking.paymentStatus === "PAID";
  const dailyRate          = booking.totalPrice / 30;
  const paidLeavesAllowed  = getPaidLeavesAllowed(presentDays);
  const totalNonWorkedDays = leaveDays + absentDays;
  const paidLeaves         = Math.min(paidLeavesAllowed, totalNonWorkedDays);
  const unpaidNonWorked    = totalNonWorkedDays - paidLeaves;  // absent/leave days NOT covered
  const chargeableDays     = presentDays + paidLeaves;
  const refundAmount       = isTerminated
    ? Math.max(0, booking.totalPrice - chargeableDays * dailyRate)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-24 md:pt-20 md:pb-28 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${booking.status === "SERVICE_IN_PROGRESS" ? "animate-pulse" : ""}`} />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">{status.label}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Booking <span className="text-blue-400">#{booking.id}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            {booking.services?.map(formatService).join(", ")}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-[5%] pb-16 -mt-12 relative z-10">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* IN PROGRESS BANNER */}
          {booking.status === "SERVICE_IN_PROGRESS" && (
            <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
              <p className="text-white text-sm font-bold">Provider is currently on the job</p>
            </div>
          )}

          {/* TERMINATED BANNER */}
          {isTerminated && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-5 py-4 space-y-2">
              <div className="flex items-center gap-3">
                <XCircle size={16} className="text-orange-500 flex-shrink-0" />
                <p className="text-orange-700 text-sm font-bold">Service was ended early by the provider.</p>
              </div>
              {wasRefunded && refundAmount > 0 && (
                <div className="flex items-center gap-3">
                  <Wallet size={14} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm font-bold">
                    ₹{refundAmount.toFixed(0)} refunded to your wallet.
                  </p>
                </div>
              )}
              {wasRefunded && refundAmount === 0 && (
                <div className="flex items-center gap-3">
                  <Wallet size={14} className="text-slate-400 flex-shrink-0" />
                  <p className="text-slate-500 text-sm">No refund — provider completed all chargeable days.</p>
                </div>
              )}
            </div>
          )}

         {/* PAYMENT REQUIRED BANNER */}
          {booking.paymentStatus === "PAYMENT_REQUIRED" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-bold">Payment required to continue service</p>
              </div>
              <button
                onClick={() => navigate("/user/payments")}  // ← fix this
                className="text-xs font-black text-red-600 border border-red-300 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-all flex-shrink-0"
              >
                Pay Now →
              </button>
            </div>
          )}

          {/* WALLET CONSENT PENDING BANNER */}
          {booking.status === "PENDING" && booking.walletConsentStatus === "PENDING" && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <p className="text-amber-800 text-sm font-bold">
                  Choose whether to use your wallet balance to pay.
                </p>
              </div>
              <button
                onClick={() => navigate("/user/payments")}  // ← fix this too
                className="text-xs font-black text-amber-700 border border-amber-300 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all flex-shrink-0"
              >
                Continue →
              </button>
            </div>
          )}

          {/* BOOKING SUMMARY CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center">
                <Briefcase size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Booking Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <User size={13} className="text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provider</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{providerName}</p>
                  {isVerified && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={9} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-600">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">City</p>
                  <p className="text-xs font-bold text-slate-800">{providerCity}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <CalendarDays size={13} className="text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Start Date</p>
                  <p className="text-xs font-bold text-slate-800">{formatDate(booking.serviceDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock size={13} className="text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Time</p>
                  <p className="text-xs font-bold text-slate-800">
                    {formatTime(booking.bookingStartTime)} – {formatTime(booking.bookingEndTime)}
                  </p>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Briefcase size={13} className="text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Services</p>
                  <p className="text-xs font-bold text-slate-800">{booking.services?.map(formatService).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <IndianRupee size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Payment</h3>
              <span className={`ml-auto text-[10px] font-black px-2.5 py-1 rounded-full ${payment.bg} ${payment.text}`}>
                {payment.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Monthly</p>
                <p className="text-lg font-black text-slate-900">₹{booking.totalPrice?.toFixed(0) || 0}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">Wallet Used</p>
                <p className="text-lg font-black text-emerald-700">₹{booking.walletUsed?.toFixed(0) || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">Payable</p>
                <p className="text-lg font-black text-blue-700">₹{booking.finalPayableAmount?.toFixed(0) || 0}</p>
              </div>
            </div>

            {/* TERMINATION REFUND BREAKDOWN */}
            {isTerminated && wasRefunded && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-3">
                  Termination Refund Breakdown
                </p>

                {/* Day counts */}
                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <p className="text-sm font-black text-emerald-700">{presentDays}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Worked</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <p className="text-sm font-black text-orange-600">{paidLeaves}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Paid Leave</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <p className="text-sm font-black text-red-500">{unpaidNonWorked}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Deducted</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <p className="text-sm font-black text-slate-600">{absentDays}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Absent</p>
                  </div>
                </div>

                {/* Paid leave note if absent days were covered */}
                {paidLeaves > 0 && absentDays > 0 && leaveDays === 0 && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                    <AlertCircle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 font-medium">
                      {paidLeaves} absent {paidLeaves === 1 ? "day" : "days"} covered by paid leave entitlement
                      ({presentDays} days worked → {paidLeavesAllowed} paid {paidLeavesAllowed === 1 ? "leave" : "leaves"} allowed).
                    </p>
                  </div>
                )}

                {/* Calculation rows */}
                <div className="space-y-1.5 text-[11px] font-medium text-slate-600 mb-3">
                  <div className="flex justify-between">
                    <span>Daily rate (₹{booking.totalPrice}/30)</span>
                    <span className="font-black text-slate-800">₹{dailyRate.toFixed(0)}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid leave entitlement ({presentDays} worked → {paidLeavesAllowed} allowed, {paidLeaves} used)</span>
                    <span className="font-black text-slate-800">{paidLeaves} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chargeable days ({presentDays} worked + {paidLeaves} paid leave)</span>
                    <span className="font-black text-slate-800">{chargeableDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount charged ({chargeableDays} × ₹{dailyRate.toFixed(0)})</span>
                    <span className="font-black text-slate-800">₹{(chargeableDays * dailyRate).toFixed(0)}</span>
                  </div>
                </div>

                {/* Refund total */}
                <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-3 py-2.5 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Wallet size={13} className="text-emerald-600" />
                    <p className="text-xs font-black text-emerald-700">Refunded to Wallet</p>
                  </div>
                  <p className="text-base font-black text-emerald-600">₹{refundAmount.toFixed(0)}</p>
                </div>
              </div>
            )}
          </div>

          {/* ATTENDANCE STATS */}
          {totalLogged > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <TrendingUp size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Attendance Overview</h3>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total Days", value: totalLogged, bg: "bg-slate-50",   text: "text-slate-800",   border: "border-slate-100"   },
                  { label: "Present",    value: presentDays, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
                  { label: "Absent",     value: absentDays,  bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100"     },
                  { label: "Leave",      value: leaveDays,   bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-100"  },
                ].map(({ label, value, bg, text, border }) => (
                  <div key={label} className={`${bg} rounded-2xl p-3 text-center border ${border}`}>
                    <p className={`text-xl font-black ${text}`}>{value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {totalLogged > 0 && (
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    <span>Attendance rate</span>
                    <span>{Math.round((presentDays / totalLogged) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(presentDays / totalLogged) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DAILY LOG */}
          {totalLogged > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center">
                  <Calendar size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Daily Log</h3>
                <span className="ml-auto text-[10px] font-black text-slate-400">{totalLogged} entries</span>
              </div>

              <div className="space-y-2">
                {logs
                  .filter(l => l.status !== "REJECTED")
                  .sort((a, b) => new Date(b.workDate) - new Date(a.workDate))
                  .map((log) => {
                    const ws = workStatusConfig[log.status] || workStatusConfig.ABSENT;
                    const WsIcon = ws.icon;
                    const { day, date } = formatDay(log.workDate);
                    return (
                      <div
                        key={log.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${ws.border} ${ws.bg}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ws.iconBg}`}>
                            <WsIcon size={12} className="text-white" strokeWidth={3} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{date}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{day}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.note && (
                            <p className="text-[10px] text-slate-400 italic max-w-[120px] truncate">"{log.note}"</p>
                          )}
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${ws.bg} ${ws.text} border ${ws.border}`}>
                            {ws.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* NO LOGS YET */}
          {totalLogged === 0 && booking.status === "SERVICE_IN_PROGRESS" && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Calendar size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-700">No attendance recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">Logs will appear here once the provider marks daily attendance.</p>
            </div>
          )}

          {/* STATUS TIMELINE */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Booking Status</h3>
            </div>

            {[
              { key: "PENDING",             label: "Booking Placed",       desc: "Waiting for provider to accept"  },
              { key: "CONFIRMED",           label: "Accepted by Provider", desc: "Provider confirmed your booking" },
              { key: "SERVICE_IN_PROGRESS", label: "Service Started",      desc: "Provider is actively working"    },
              { key: "COMPLETED",           label: "Completed",            desc: "Service successfully completed"  },
            ].map((step, i, arr) => {
              const statusOrder = ["PENDING", "CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "TERMINATED", "CANCELLED", "REJECTED"];
              const currentIdx  = statusOrder.indexOf(booking.status);
              const stepIdx     = statusOrder.indexOf(step.key);
              const isDone      = currentIdx >= stepIdx && !["TERMINATED","CANCELLED","REJECTED"].includes(booking.status);
              const isCurrent   = booking.status === step.key;
              const isLast      = i === arr.length - 1;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${isDone ? "bg-emerald-500 border-emerald-500" : isCurrent ? "bg-blue-500 border-blue-500" : "bg-white border-slate-200"}`}
                    >
                      {isDone
                        ? <Check size={12} className="text-white" strokeWidth={3} />
                        : <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-slate-300"}`} />
                      }
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 mt-1 ${isDone ? "bg-emerald-200" : "bg-slate-100"}`} />
                    )}
                  </div>
                  <div className="pb-6 min-w-0">
                    <p className={`text-sm font-black ${isDone ? "text-slate-800" : "text-slate-400"}`}>{step.label}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{step.desc}</p>
                  </div>
                </div>
              );
            })}

            {["TERMINATED","CANCELLED","REJECTED"].includes(booking.status) && (
              <div className="flex gap-4 mt-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-red-400 border-2 border-red-400">
                  <X size={12} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-black text-red-600">{status.label}</p>
                  <p className="text-[11px] text-slate-400 font-medium">This booking was {status.label.toLowerCase()}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingDetails;