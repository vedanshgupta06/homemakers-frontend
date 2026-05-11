

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings } from "../../../../api/adminBookingApi";
import {
  Search, CalendarDays, Clock, User, Briefcase,
  IndianRupee, CheckCircle2, XCircle, AlertCircle,
  Loader, SearchX, ArrowLeft, Filter
} from "lucide-react";

const statusConfig = {
  PENDING:             { label: "Pending",     badge: "bg-yellow-100 text-yellow-700",  border: "border-yellow-200 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: AlertCircle  },
  CONFIRMED:           { label: "Confirmed",   badge: "bg-blue-100 text-blue-700",      border: "border-blue-100 bg-blue-50/20",       iconBg: "bg-blue-600",    icon: CheckCircle2 },
  SERVICE_IN_PROGRESS: { label: "In Progress", badge: "bg-orange-100 text-orange-700",  border: "border-orange-100 bg-orange-50/20",   iconBg: "bg-orange-500",  icon: Loader       },
  COMPLETED:           { label: "Completed",   badge: "bg-emerald-100 text-emerald-700",border: "border-emerald-100 bg-emerald-50/20", iconBg: "bg-emerald-500", icon: CheckCircle2 },
  CANCELLED:           { label: "Cancelled",   badge: "bg-red-100 text-red-600",        border: "border-red-100 bg-red-50/20",         iconBg: "bg-red-400",     icon: XCircle      },
  REJECTED:            { label: "Rejected",    badge: "bg-red-100 text-red-600",        border: "border-red-100 bg-red-50/20",         iconBg: "bg-red-400",     icon: XCircle      },
};

const FILTERS = ["ALL", "PENDING", "CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadBookings(); }, []);
  useEffect(() => { applyFilters(); }, [filter, search, bookings]);

  const loadBookings = async () => {
    try {
      const res = await getAllBookings();
      const data = res.data || [];
      setBookings(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...bookings];
    if (filter !== "ALL") data = data.filter(b => b.status === filter);
    if (search) {
      data = data.filter(b =>
        (b.user?.name || b.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.provider?.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
        String(b.id).includes(search)
      );
    }
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFiltered(data);
  };

  const formatCurrency = (num = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatDateTime = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "ALL" ? bookings.length : bookings.filter(b => b.status === f).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-wider mb-6"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Admin</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            All <span className="text-blue-400">Bookings</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Manage and monitor all platform bookings.</p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <Briefcase size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{bookings.length} total</span>
              </div>
              {counts.PENDING > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <AlertCircle size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{counts.PENDING} pending</span>
                </div>
              )}
              {counts.CONFIRMED > 0 && (
                <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-blue-300" />
                  <span className="text-blue-200 text-xs font-bold">{counts.CONFIRMED} confirmed</span>
                </div>
              )}
              {counts.COMPLETED > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs font-bold">{counts.COMPLETED} completed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* SEARCH + FILTERS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Search size={15} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by customer, provider, or booking ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={14} className="text-slate-400 flex-shrink-0" />
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-1
                      ${filter === f
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                      }`}>
                    {f === "ALL" ? "All" : f.replace("_", " ")}
                    {counts[f] > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black
                        ${filter === f ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {counts[f]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />)}
            </div>
          )}

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-700">No bookings found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
            </div>
          )}

          {/* BOOKING CARDS */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map(booking => {
                const status = (booking.status || "").toUpperCase();
                const config = statusConfig[status] || statusConfig.PENDING;
                const Icon = config.icon;

                return (
                  <div key={booking.id} className={`bg-white rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md ${config.border}`}>

                    {/* TOP ROW */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-black text-slate-900">
                              {booking.user?.name || booking.user?.email?.split("@")[0] || "Customer"}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400">#{booking.id}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{formatDateTime(booking.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {booking.user?.email}
                            {booking.user?.phone && ` · ${booking.user.phone}`}
                            {booking.user?.city && ` · ${booking.user.city}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                          {config.label}
                        </span>
                        {booking.settlementDone && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                            Settled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">

                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <User size={12} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provider</p>
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {booking.provider?.user?.name || booking.provider?.user?.email?.split("@")[0] || "—"}
                          </p>
                          {booking.provider?.city && (
                            <p className="text-[10px] text-slate-400 capitalize">{booking.provider.city}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <CalendarDays size={12} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</p>
                          <p className="text-xs font-bold text-slate-800">{formatDate(booking.availability?.date)}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatTime(booking.availability?.startTime)} – {formatTime(booking.availability?.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <IndianRupee size={12} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Price</p>
                          <p className="text-xs font-bold text-slate-800">{formatCurrency(booking.totalPrice)}</p>
                          {booking.walletUsed > 0 && (
                            <p className="text-[10px] text-emerald-600 font-bold">
                              Wallet: -{formatCurrency(booking.walletUsed)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <IndianRupee size={12} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">To Pay</p>
                          <p className="text-xs font-bold text-slate-800">{formatCurrency(booking.finalPayableAmount)}</p>
                          <p className={`text-[10px] font-black uppercase tracking-wider
                            ${booking.paymentStatus === "PAID" ? "text-emerald-600"
                            : booking.paymentStatus === "PAYMENT_REQUIRED" ? "text-red-500"
                            : "text-yellow-600"}`}>
                            {(booking.paymentStatus || "").replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SECONDARY PILLS */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {booking.hoursPerDay && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600">
                          <Clock size={10} /> {booking.hoursPerDay} hrs/day
                        </span>
                      )}
                      {booking.chargeableDays > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600">
                          {booking.chargeableDays} chargeable days
                        </span>
                      )}
                      {booking.holidays > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600">
                          {booking.holidays} holidays
                        </span>
                      )}
                      {booking.bookingStartTime && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600">
                          <Clock size={10} />
                          Work: {formatTime(booking.bookingStartTime)} – {formatTime(booking.bookingEndTime)}
                        </span>
                      )}
                      {booking.workStartDate && (
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-700">
                          Started: {formatDate(booking.workStartDate)}
                        </span>
                      )}
                      {booking.provider?.verified && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600">
                          ✓ Verified Provider
                        </span>
                      )}
                    </div>

                    {/* SERVICES */}
                    {booking.services?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {booking.services.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                            {formatService(s)}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}