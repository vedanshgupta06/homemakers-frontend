import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import {
  ArrowLeft, Star, MapPin, Briefcase, Clock, CheckCircle2,
  XCircle, IndianRupee, User, Calendar, TrendingUp, Wallet,
  ShieldCheck, ShieldX, FileText, Phone, Mail, Award,
  AlertTriangle, BarChart3, Activity, Package, ChevronRight
} from "lucide-react";

const statusColor = {
  PENDING:             { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  CONFIRMED:           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  SERVICE_IN_PROGRESS: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
  COMPLETED:           { bg: "bg-slate-100",  text: "text-slate-600",   border: "border-slate-200",   dot: "bg-slate-400"   },
  CANCELLED:           { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400"     },
  REJECTED:            { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400"     },
  TERMINATED:          { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-400"  },
};

const fmt = (num = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);

const formatService = (s) =>
  s?.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || "—";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const formatTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

function StatCard({ icon: Icon, iconBg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={15} className="text-white" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, iconBg, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={15} className="text-white" />
      </div>
      <div>
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ProviderDetails() {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider]   = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [earnings, setEarnings]   = useState([]);
  const [slots, setSlots]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    loadAll();
  }, [providerId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [provRes, bookRes, earnRes, slotRes] = await Promise.allSettled([
          api.get(`/api/admin/providers/${providerId}/profile`),   // ← changed
        api.get(`/api/admin/providers/${providerId}/bookings`),
        api.get(`/api/admin/providers/${providerId}/earnings`),
        api.get(`/api/admin/providers/${providerId}/slots`), 
      ]);
      if (provRes.status === "fulfilled")  setProvider(provRes.value.data);
      if (bookRes.status === "fulfilled")  setBookings(bookRes.value.data || []);
      if (earnRes.status === "fulfilled")  setEarnings(earnRes.value.data || []);
      if (slotRes.status === "fulfilled")  setSlots(slotRes.value.data || []);
    } catch (e) {
      setError("Failed to load provider details");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!window.confirm("Verify this provider?")) return;
    setVerifying(true);
    try {
      await api.put(`/api/admin/providers/${providerId}/verify`);
      setProvider(prev => ({ ...prev, verified: true }));
    } catch {
      alert("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // ── Derived metrics ──────────────────────────────────────────
  const totalBookings    = bookings.length;
  const completedCount   = bookings.filter(b => b.status === "COMPLETED").length;
  const cancelledCount   = bookings.filter(b => ["CANCELLED","REJECTED"].includes(b.status)).length;
  const activeCount      = bookings.filter(b => ["CONFIRMED","SERVICE_IN_PROGRESS"].includes(b.status)).length;
  const terminatedCount  = bookings.filter(b => b.status === "TERMINATED").length;
  const completionRate   = totalBookings > 0 ? Math.round((completedCount / totalBookings) * 100) : 0;
  const cancellationRate = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;

  const totalEarned      = earnings.reduce((s, e) => s + (e.amount || 0), 0);
  const paidEarnings     = earnings.filter(e => e.status === "PAID").reduce((s, e) => s + (e.amount || 0), 0);
  const pendingEarnings  = earnings.filter(e => e.status === "AVAILABLE").reduce((s, e) => s + (e.amount || 0), 0);

  const activeSlots      = slots.filter(s => s.active).length;

  const serviceBreakdown = bookings.reduce((acc, b) => {
    (b.services || []).forEach(s => { acc[s] = (acc[s] || 0) + 1; });
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <p className="text-sm text-slate-500">{error || "Provider not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8]">

      {/* HERO */}
      <div className="bg-[#0F172A] pt-6 pb-28 px-3 md:px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/8 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-indigo-500/5 translate-y-1/2" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 transition-all hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={17} strokeWidth={2.5} className="text-white transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em]">Provider Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {provider.profilePhotoUrl ? (
                <img
                  src={`http://localhost:8080${provider.profilePhotoUrl}`}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {(provider.user?.name || "P").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {provider.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0F172A] flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {provider.user?.name || "Unknown"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Mail size={11} /> {provider.user?.email}
                </span>
                {provider.user?.phone && (
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Phone size={11} /> {provider.user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <MapPin size={11} /> {provider.city || "—"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {provider.verified ? (
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1">
                    <ShieldCheck size={11} className="text-emerald-400" />
                    <span className="text-emerald-300 text-[10px] font-black uppercase tracking-wide">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 rounded-full px-3 py-1">
                    <ShieldX size={11} className="text-red-400" />
                    <span className="text-red-300 text-[10px] font-black uppercase tracking-wide">Unverified</span>
                  </div>
                )}
                {provider.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-amber-300 text-[10px] font-black">{provider.rating?.toFixed(1)} Rating</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                  <Award size={11} className="text-slate-400" />
                  <span className="text-slate-300 text-[10px] font-black">{provider.experienceYears || 0} yrs exp</span>
                </div>
              </div>
            </div>

            {/* Verify button */}
            {!provider.verified && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="sm:ml-auto flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/25 disabled:opacity-60"
              >
                <ShieldCheck size={14} />
                {verifying ? "Verifying..." : "Verify Provider"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-3 md:px-[5%] pb-16">
        <div className="max-w-6xl mx-auto -mt-14 relative z-10 space-y-5">

          {/* KPI STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Briefcase}   iconBg="bg-blue-600"    label="Total Bookings"   value={totalBookings}          sub="All time"             />
            <StatCard icon={CheckCircle2} iconBg="bg-emerald-500" label="Completed"        value={completedCount}         sub={`${completionRate}% rate`} />
            <StatCard icon={Activity}    iconBg="bg-violet-500"  label="Active Now"       value={activeCount}            sub="Confirmed + In Progress" />
            <StatCard icon={XCircle}     iconBg="bg-red-500"     label="Cancellations"    value={cancelledCount}         sub={`${cancellationRate}% rate`} />
          </div>

          {/* EARNINGS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 bg-[#0F172A] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <IndianRupee size={13} className="text-white" />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Earned</p>
              </div>
              <p className="text-3xl font-black text-white leading-none">{fmt(totalEarned)}</p>
              <p className="text-slate-500 text-[10px] font-medium mt-2">Lifetime earnings</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <TrendingUp size={13} className="text-white" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Out</p>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">{fmt(paidEarnings)}</p>
              <p className="text-slate-400 text-[10px] font-medium mt-2">Already transferred</p>
            </div>

            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Wallet size={13} className="text-white" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Payout</p>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">{fmt(pendingEarnings)}</p>
              <p className="text-slate-400 text-[10px] font-medium mt-2">Awaiting withdrawal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT COL */}
            <div className="lg:col-span-1 space-y-5">

              {/* PROFILE INFO */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <SectionHeader icon={User} iconBg="bg-slate-700" title="Profile Info" />
                <div className="space-y-3">
                  {[
                    { label: "Price/hr", value: provider.pricePerHour ? `₹${provider.pricePerHour}/hr` : "Not set" },
                    { label: "Experience", value: `${provider.experienceYears || 0} years` },
                    { label: "Travel Radius", value: provider.travelRadiusKm ? `${provider.travelRadiusKm} km` : "—" },
                    { label: "Willing to Travel", value: provider.willingToTravel ? "Yes" : "No" },
                    { label: "Rating", value: provider.rating > 0 ? `${provider.rating?.toFixed(1)} ⭐ (${provider.totalRatings || 0} reviews)` : "No ratings yet" },
                    { label: "Active Slots", value: `${activeSlots} available` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
                      <span className="text-xs font-bold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICES */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <SectionHeader icon={Package} iconBg="bg-violet-500" title="Services Offered" />
                {provider.services?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-[10px] font-black text-violet-700 uppercase tracking-wide">
                        {formatService(s)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No services listed</p>
                )}
              </div>

              {/* SERVICE BREAKDOWN */}
              {Object.keys(serviceBreakdown).length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <SectionHeader icon={BarChart3} iconBg="bg-blue-600" title="Bookings by Service" />
                  <div className="space-y-3">
                    {Object.entries(serviceBreakdown)
                      .sort((a, b) => b[1] - a[1])
                      .map(([service, count]) => {
                        const pct = Math.round((count / totalBookings) * 100);
                        return (
                          <div key={service}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">{formatService(service)}</span>
                              <span className="text-[10px] font-black text-slate-400">{count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* DOCUMENTS */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <SectionHeader icon={FileText} iconBg="bg-slate-600" title="Documents" />
                <div className="space-y-3">
                  {[
                    { label: "ID Proof", url: provider.idProofUrl },
                    { label: "Address Proof", url: provider.addressProofUrl },
                  ].map(({ label, url }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">{label}</span>
                      {url ? (
                        <a
                          href={`http://localhost:8080${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-wide hover:text-blue-700"
                        >
                          View <ChevronRight size={11} />
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-wide">
                          <AlertTriangle size={10} /> Missing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COL — BOOKINGS */}
            <div className="lg:col-span-2 space-y-5">

              {/* PERFORMANCE SUMMARY */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <SectionHeader icon={TrendingUp} iconBg="bg-emerald-500" title="Performance Overview" subtitle="Booking outcomes at a glance" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Completed",  value: completedCount,  color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100" },
                    { label: "Active",     value: activeCount,     color: "text-blue-600",    bg: "bg-blue-50",     border: "border-blue-100"    },
                    { label: "Terminated", value: terminatedCount, color: "text-orange-600",  bg: "bg-orange-50",   border: "border-orange-100"  },
                    { label: "Cancelled",  value: cancelledCount,  color: "text-red-600",     bg: "bg-red-50",      border: "border-red-100"     },
                  ].map(({ label, value, color, bg, border }) => (
                    <div key={label} className={`rounded-2xl border ${bg} ${border} p-4 text-center`}>
                      <p className={`text-2xl font-black ${color}`}>{value}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Completion rate bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Completion Rate</span>
                    <span className="text-[10px] font-black text-slate-800">{completionRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${completionRate >= 70 ? "bg-emerald-500" : completionRate >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    {completionRate >= 70 ? "✅ Excellent performer" : completionRate >= 40 ? "⚠️ Average performer" : "🔴 Needs attention"}
                  </p>
                </div>
              </div>

              {/* BOOKINGS LIST */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <SectionHeader icon={Calendar} iconBg="bg-blue-600" title="Booking History" subtitle={`${totalBookings} total bookings`} />

                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                      <Briefcase size={20} className="text-slate-300" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {bookings.map(b => {
                      const cfg = statusColor[b.status] || statusColor.PENDING;
                      return (
                        <div key={b.id} className={`rounded-2xl border p-4 ${cfg.border} ${cfg.bg}`}>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 truncate">
                                {(b.services || []).map(formatService).join(", ")}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                Booking #{b.id}
                              </p>
                            </div>
                            <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              <span className={`text-[10px] font-black uppercase tracking-wide whitespace-nowrap ${cfg.text}`}>
                                {b.status?.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { icon: User,     label: "Customer", value: b.user?.name || b.user?.email?.split("@")[0] || "—" },
                              { icon: Calendar, label: "Date",     value: formatDate(b.availability?.date) },
                              { icon: Clock,    label: "Time",     value: `${formatTime(b.bookingStartTime)} – ${formatTime(b.bookingEndTime)}` },
                              { icon: IndianRupee, label: "Amount", value: b.totalPrice ? `₹${b.totalPrice}` : "—" },
                            ].map(({ icon: Icon, label, value }) => (
                              <div key={label} className="bg-white/70 rounded-xl p-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                                <p className="text-[11px] font-bold text-slate-800 truncate mt-0.5">{value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Payment status */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                              ${b.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" :
                                b.paymentStatus === "PAYMENT_REQUIRED" ? "bg-amber-100 text-amber-700" :
                                "bg-slate-100 text-slate-500"}`}>
                              💳 {b.paymentStatus?.replace("_", " ") || "PENDING"}
                            </span>
                            {b.walletUsed > 0 && (
                              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                👛 Wallet ₹{b.walletUsed}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}