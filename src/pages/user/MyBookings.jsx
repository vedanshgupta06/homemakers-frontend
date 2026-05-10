import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import RatingModal from "../../components/RatingModal";
import {
  CalendarDays, Clock, User, MapPin, Briefcase,
  Star, CheckCircle2, XCircle, AlertCircle, ArrowLeft,
  IndianRupee, Wallet, Zap, ChevronRight, X
} from "lucide-react";

const statusConfig = {
  PENDING:             { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400",   icon: AlertCircle,  iconBg: "bg-gradient-to-br from-amber-400 to-orange-500"  },
  CONFIRMED:           { label: "Confirmed",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400", icon: CheckCircle2, iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600"  },
  SERVICE_IN_PROGRESS: { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    icon: Zap,          iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600"   },
  COMPLETED:           { label: "Completed",   bg: "bg-slate-100",  text: "text-slate-600",   border: "border-slate-200",   dot: "bg-slate-400",   icon: CheckCircle2, iconBg: "bg-gradient-to-br from-slate-500 to-slate-700"   },
  REJECTED:            { label: "Cancelled",   bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400",     icon: XCircle,      iconBg: "bg-gradient-to-br from-red-400 to-rose-600"      },
  TERMINATED:          { label: "Terminated",  bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-400",  icon: XCircle,      iconBg: "bg-gradient-to-br from-orange-400 to-red-500"    },
  CANCELLED:           { label: "Cancelled",   bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400",     icon: XCircle,      iconBg: "bg-gradient-to-br from-red-400 to-rose-600"      },
};

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "SERVICE_IN_PROGRESS"];

// ─── Cancel Confirm Modal ─────────────────────────────────────────────────────
function CancelModal({ isOpen, onClose, onConfirm, booking, cancelling }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
        style={{ animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>

        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-red-500 shadow-lg shadow-red-200">
          <X size={28} className="text-white" strokeWidth={2.5} />
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center mb-2 tracking-tight">
          Cancel this booking?
        </h3>
        <p className="text-sm text-slate-500 text-center mb-2 leading-relaxed">
          Booking <span className="font-bold text-slate-700">#{booking.id}</span> will be cancelled.
        </p>
        {booking.paymentStatus === "PAID" && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4">
            <Wallet size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-bold text-emerald-700">
              Your payment will be refunded to your wallet.
            </p>
          </div>
        )}
        <p className="text-xs text-slate-400 text-center mb-7">This action cannot be undone.</p>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={cancelling}
            className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
            Keep it
          </button>
          <button onClick={onConfirm} disabled={cancelling}
            className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all active:scale-[0.97] shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {cancelling
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling...</>
              : "Yes, Cancel"
            }
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(28px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function MyBookings() {
  const [bookings, setBookings]           = useState([]);
  const [filter, setFilter]               = useState("ACTIVE");
  const [ratingBooking, setRatingBooking] = useState(null);
  const [cancelTarget, setCancelTarget]   = useState(null); // booking to cancel
  const [cancelling, setCancelling]       = useState(false);
  const [cancelError, setCancelError]     = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/bookings/user")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, []);

  // ── Cancel a booking ────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelError("");
    try {
      await api.post(`/api/bookings/${cancelTarget.id}/cancel`);
      // Update local state immediately
      setBookings(prev =>
        prev.map(b => b.id === cancelTarget.id ? { ...b, status: "CANCELLED" } : b)
      );
      setCancelTarget(null);
    } catch (err) {
      setCancelError(err.response?.data?.message || "Failed to cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ACTIVE")     return ACTIVE_STATUSES.includes(b.status);
    if (filter === "COMPLETED")  return b.status === "COMPLETED";
    if (filter === "TERMINATED") return b.status === "TERMINATED";
    if (filter === "CANCELLED")  return ["REJECTED", "CANCELLED"].includes(b.status);
    return true;
  });

  const formatTime = (t) => {
    if (!t) return "—";
    const parts = t.split(":");
    const hour = parseInt(parts[0]);
    const min = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return "No Service";
    return services.map(s =>
      s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    ).join(", ");
  };

  const counts = {
    ACTIVE:     bookings.filter(b => ACTIVE_STATUSES.includes(b.status)).length,
    COMPLETED:  bookings.filter(b => b.status === "COMPLETED").length,
    TERMINATED: bookings.filter(b => b.status === "TERMINATED").length,
    CANCELLED:  bookings.filter(b => ["REJECTED", "CANCELLED"].includes(b.status)).length,
  };

  const FILTER_TABS   = ["ACTIVE", "COMPLETED", "TERMINATED", "CANCELLED"];
  const FILTER_LABELS = { ACTIVE: "Active", COMPLETED: "Completed", TERMINATED: "Terminated", CANCELLED: "Cancelled" };

  const topBarColor = {
    SERVICE_IN_PROGRESS: "bg-gradient-to-r from-blue-500 to-indigo-500",
    CONFIRMED:           "bg-gradient-to-r from-emerald-400 to-teal-500",
    PENDING:             "bg-gradient-to-r from-amber-400 to-orange-400",
    COMPLETED:           "bg-gradient-to-r from-slate-400 to-slate-500",
    TERMINATED:          "bg-gradient-to-r from-orange-400 to-red-400",
    REJECTED:            "bg-gradient-to-r from-red-400 to-rose-400",
    CANCELLED:           "bg-gradient-to-r from-red-400 to-rose-400",
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8]">

      {/* ── CANCEL MODAL ── */}
      <CancelModal
        isOpen={!!cancelTarget}
        onClose={() => { setCancelTarget(null); setCancelError(""); }}
        onConfirm={handleCancel}
        booking={cancelTarget}
        cancelling={cancelling}
      />

      {/* ── CANCEL ERROR TOAST ── */}
      {cancelError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <AlertCircle size={13} />
          {cancelError}
          <button onClick={() => setCancelError("")} className="ml-2 opacity-70 hover:opacity-100">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <div className="bg-[#0F172A] pt-2 pb-24 md:pt-20 md:pb-28 px-3 md:px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/8 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <button onClick={() => navigate(-1)}
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
            <ArrowLeft size={17} strokeWidth={2.5} className="text-white transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em]">Service History</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-3">
            My <span className="text-blue-400">Bookings</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md">
            Manage and track all your service bookings.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {counts.ACTIVE > 0 && (
              <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-bold">{counts.ACTIVE} Active</span>
              </div>
            )}
            {counts.COMPLETED > 0 && (
              <div className="flex items-center gap-2 bg-slate-500/15 border border-slate-400/25 rounded-full px-3 py-1.5">
                <CheckCircle2 size={11} className="text-slate-400" />
                <span className="text-slate-300 text-xs font-bold">{counts.COMPLETED} Completed</span>
              </div>
            )}
            {counts.TERMINATED > 0 && (
              <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-400/25 rounded-full px-3 py-1.5">
                <XCircle size={11} className="text-orange-400" />
                <span className="text-orange-300 text-xs font-bold">{counts.TERMINATED} Terminated</span>
              </div>
            )}
            {counts.CANCELLED > 0 && (
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-400/25 rounded-full px-3 py-1.5">
                <XCircle size={11} className="text-red-400" />
                <span className="text-red-300 text-xs font-bold">{counts.CANCELLED} Cancelled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-3 md:px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-10 md:-mt-14 relative z-10">

          {/* FILTER TABS */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200
                  ${filter === f
                    ? "bg-[#0F172A] text-white shadow-xl shadow-slate-900/25"
                    : "bg-white text-slate-500 shadow-sm hover:shadow-md hover:text-slate-700 border border-slate-100"
                  }`}>
                {FILTER_LABELS[f]}
                {counts[f] > 0 && (
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black
                    ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {counts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredBookings.length === 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Briefcase size={26} className="text-slate-300" />
              </div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">No Bookings</p>
              <p className="text-sm text-slate-400">No {FILTER_LABELS[filter].toLowerCase()} bookings found.</p>
            </div>
          )}

          {/* CARDS GRID */}
          <div className="grid lg:grid-cols-2 gap-4">
            {filteredBookings.map((b) => {
              const config      = statusConfig[b.status] || statusConfig.PENDING;
              const StatusIcon  = config.icon;
              const isTerminated = b.status === "TERMINATED";
              const wasRefunded  = isTerminated && b.paymentStatus === "PAID";

              // ✅ Cancel is allowed only when PENDING and provider hasn't accepted yet
              const canCancel = b.status === "PENDING";

              return (
                <div key={b.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

                  {/* TOP COLOR BAR */}
                  <div className={`h-1 w-full ${topBarColor[b.status] || "bg-slate-300"}`} />

                  <div className="p-4 md:p-5">

                    {/* HEADER ROW */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${config.iconBg}`}>
                          <StatusIcon size={17} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate leading-tight">
                            {formatServices(b.services)}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Booking #{b.id}
                          </p>
                        </div>
                      </div>

                      {/* Status pill */}
                      <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.border}`}>
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${b.status === "SERVICE_IN_PROGRESS" ? "animate-pulse" : ""}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wide whitespace-nowrap ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* IN PROGRESS BANNER */}
                    {b.status === "SERVICE_IN_PROGRESS" && (
                      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                        <p className="text-xs font-bold text-blue-700">Provider is currently on the job</p>
                      </div>
                    )}

                    {/* WALLET CONSENT PENDING BANNER */}
                    {b.status === "PENDING" && b.walletConsentStatus === "PENDING" && (
                      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                          <p className="text-xs font-bold text-amber-800">Action required — complete payment to confirm.</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/user/bookings/${b.id}`); }}
                          className="text-xs font-black text-amber-700 underline whitespace-nowrap flex-shrink-0">
                          Continue →
                        </button>
                      </div>
                    )}

                    {/* TERMINATED BANNER */}
                    {isTerminated && (
                      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3 mb-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <XCircle size={13} className="text-orange-500 flex-shrink-0" />
                          <p className="text-xs font-bold text-orange-700">Service was ended early by the provider.</p>
                        </div>
                        {wasRefunded && (
                          <div className="flex items-center gap-2 pl-1">
                            <Wallet size={12} className="text-emerald-500 flex-shrink-0" />
                            <p className="text-xs font-bold text-emerald-700">
                              Refund processed — tap Details for full breakdown.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ✅ CANCELLABLE BANNER — shown when provider hasn't responded yet */}
                    {canCancel && b.walletConsentStatus !== "PENDING" && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                        <AlertCircle size={12} className="text-slate-400 flex-shrink-0" />
                        <p className="text-xs font-medium text-slate-500">
                          Waiting for provider to accept — you can cancel anytime.
                        </p>
                      </div>
                    )}

                    {/* INFO GRID */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { icon: User,         label: "Provider", value: b.providerName || "Provider" },
                        { icon: MapPin,       label: "City",     value: b.providerCity || "—"        },
                        { icon: CalendarDays, label: "Date",     value: formatDate(b.serviceDate)    },
                        { icon: Clock,        label: "Time",     value: `${formatTime(b.bookingStartTime)} – ${formatTime(b.bookingEndTime)}` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100">
                            <Icon size={12} className="text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="text-[11px] font-bold text-slate-800 truncate leading-tight mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* DIVIDER */}
                    <div className="h-px bg-slate-100 mb-4" />

                    {/* BOTTOM ROW */}
                    <div className="flex items-center justify-between gap-3">

                      {/* Price + badges */}
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {b.totalPrice > 0 && (
                          <div className="flex items-center gap-0.5 bg-slate-900 rounded-xl px-3 py-1.5">
                            <IndianRupee size={10} className="text-slate-300" />
                            <span className="text-xs font-black text-white">{b.totalPrice}</span>
                            <span className="text-[9px] text-slate-500 font-medium ml-0.5">/mo</span>
                          </div>
                        )}
                        {b.providerRating > 0 && (
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-xl px-2 py-1.5">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-amber-700">{b.providerRating.toFixed(1)}</span>
                          </div>
                        )}
                        {b.providerVerified && (
                          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-xl px-2 py-1.5">
                            <CheckCircle2 size={10} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600">Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">

                        {/* ✅ CANCEL BUTTON — only when PENDING */}
                        {canCancel && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCancelTarget(b); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-black transition-all active:scale-95">
                            <X size={11} strokeWidth={3} />
                            Cancel
                          </button>
                        )}

                        {/* RATE BUTTON — completed and unrated */}
                        {b.status === "COMPLETED" && !b.rated && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setRatingBooking(b); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white text-xs font-black transition-all active:scale-95 shadow-sm">
                            <Star size={11} strokeWidth={3} className="fill-white" />
                            Rate
                          </button>
                        )}

                        {/* DETAILS BUTTON */}
                        <button
                          onClick={() => navigate(`/user/bookings/${b.id}`, { state: b })}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black transition-all active:scale-95 shadow-sm">
                          Details
                          <ChevronRight size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {ratingBooking && (
        <RatingModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
          onSubmitted={() => {
            setBookings(prev =>
              prev.map(b => b.id === ratingBooking.id ? { ...b, rated: true } : b)
            );
            setRatingBooking(null);
          }}
        />
      )}
    </div>
  );
}

export default MyBookings;