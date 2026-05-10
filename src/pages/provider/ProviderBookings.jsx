
// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { getProviderBookings, acceptBooking, rejectBooking } from "../../api/providerBookingApi";
// import {
//   Check, X, Play, Square, CalendarDays, Clock,
//   Briefcase, AlertCircle, CheckCircle2, XCircle,
//   Loader, SearchX, IndianRupee, CreditCard, Calendar,
//   ArrowLeft, MapPin, MessageSquare, Phone, ChevronDown
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

// const statusConfig = {
//   PENDING:             { label: "Pending",     iconBg: "bg-yellow-500",  border: "border-yellow-200 bg-yellow-50/20",    badge: "bg-yellow-100 text-yellow-700",   icon: AlertCircle  },
//   CONFIRMED:           { label: "Confirmed",   iconBg: "bg-blue-600",    border: "border-blue-100 bg-blue-50/20",        badge: "bg-blue-100 text-blue-700",       icon: CheckCircle2 },
//   SERVICE_IN_PROGRESS: { label: "In Progress", iconBg: "bg-orange-500",  border: "border-orange-100 bg-orange-50/20",    badge: "bg-orange-100 text-orange-700",   icon: Loader       },
//   COMPLETED:           { label: "Completed",   iconBg: "bg-emerald-500", border: "border-emerald-100 bg-emerald-50/20",  badge: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
//   REJECTED:            { label: "Rejected",    iconBg: "bg-red-400",     border: "border-red-100 bg-red-50/20",          badge: "bg-red-100 text-red-600",         icon: XCircle      },
//   CANCELLED:           { label: "Cancelled",   iconBg: "bg-slate-400",   border: "border-slate-200 bg-slate-50/50",      badge: "bg-slate-100 text-slate-600",     icon: XCircle      },
//   TERMINATED:          { label: "Terminated",  iconBg: "bg-orange-500",  border: "border-orange-200 bg-orange-50/20",    badge: "bg-orange-100 text-orange-700",   icon: XCircle      },
// };

// const paymentConfig = {
//   PAID:             { badge: "bg-emerald-100 text-emerald-700", label: "Paid"     },
//   PENDING:          { badge: "bg-yellow-100 text-yellow-700",   label: "Unpaid"   },
//   FAILED:           { badge: "bg-red-100 text-red-600",         label: "Failed"   },
//   PAYMENT_REQUIRED: { badge: "bg-red-100 text-red-600",         label: "Required" },
// };

// const FILTERS = ["ALL", "PENDING", "CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "CANCELLED", "TERMINATED"];
// const filterLabels = {
//   ALL: "All", PENDING: "Pending", CONFIRMED: "Confirmed",
//   SERVICE_IN_PROGRESS: "In Progress", COMPLETED: "Completed",
//   CANCELLED: "Cancelled", TERMINATED: "Terminated",
// };

// const PHONE_VISIBLE_STATUSES = ["CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "TERMINATED"];

// export default function ProviderBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [actionId, setActionId] = useState(null);
//   const [confirmId, setConfirmId] = useState(null);
//   const [confirmType, setConfirmType] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);

//   useEffect(() => { loadBookings(); }, []);

//   const loadBookings = async () => {
//     try {
//       const res = await getProviderBookings();
//       setBookings(res.data || []);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   const normalize = (s) => (s || "").toUpperCase().trim();
//   const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

//   const handleAccept = async (id) => {
//     setActionId(id);
//     try { await acceptBooking(id); loadBookings(); }
//     catch (err) { console.error(err); }
//     finally { setActionId(null); }
//   };

//   const handleReject = async (id) => {
//     setActionId(id);
//     try { await rejectBooking(id); loadBookings(); }
//     catch (err) { console.error(err); }
//     finally { setActionId(null); setConfirmId(null); }
//   };

//   const handleStart = async (id) => {
//     setActionId(id);
//     try { await api.put(`/api/bookings/${id}/start`); loadBookings(); }
//     catch (err) { console.error(err); }
//     finally { setActionId(null); setConfirmId(null); }
//   };

//   const handleTerminate = async (id) => {
//     setActionId(id);
//     try { await api.put(`/api/bookings/${id}/terminate`); loadBookings(); }
//     catch (err) { console.error(err); }
//     finally { setActionId(null); setConfirmId(null); }
//   };

//   const formatTime = (t) => {
//     if (!t || t === "-") return "—";
//     const [h, m] = t.split(":");
//     const hour = parseInt(h);
//     return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
//   };

//   const formatDate = (d) => {
//     if (!d) return "—";
//     return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
//       weekday: "short", day: "numeric", month: "short", year: "numeric"
//     });
//   };

//   const formatService = (s) =>
//     s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

//   const filtered = filter === "ALL"
//     ? bookings
//     : bookings.filter(b => normalize(b.status) === filter);

//   const counts = FILTERS.reduce((acc, f) => {
//     acc[f] = f === "ALL" ? bookings.length : bookings.filter(b => normalize(b.status) === f).length;
//     return acc;
//   }, {});

//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}
//       <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
//         <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative">
//           <button
//             onClick={() => navigate(-1)}
//             className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
//           >
//             <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
//           </button>

//           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//             <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">My Jobs</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
//             My <span className="text-blue-400">Bookings</span>
//           </h2>
//           <p className="text-slate-400 text-sm mt-3 font-medium">Manage customer requests and track your active jobs.</p>

//           {!loading && (
//             <div className="mt-5 flex flex-wrap gap-3">
//               {counts.PENDING > 0 && (
//                 <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
//                   <AlertCircle size={12} className="text-yellow-300" />
//                   <span className="text-yellow-200 text-xs font-bold">{counts.PENDING} pending</span>
//                 </div>
//               )}
//               {counts.SERVICE_IN_PROGRESS > 0 && (
//                 <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5">
//                   <Loader size={12} className="text-orange-300" />
//                   <span className="text-orange-200 text-xs font-bold">{counts.SERVICE_IN_PROGRESS} in progress</span>
//                 </div>
//               )}
//               {counts.TERMINATED > 0 && (
//                 <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5">
//                   <XCircle size={12} className="text-orange-300" />
//                   <span className="text-orange-200 text-xs font-bold">{counts.TERMINATED} terminated</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
//                 <Briefcase size={12} className="text-slate-300" />
//                 <span className="text-white text-xs font-bold">{bookings.length} total</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="px-[5%] pb-16">
//         <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

//           {/* FILTER TABS */}
//           <div className="flex gap-2 overflow-x-auto pb-1 mb-8 no-scrollbar">
//             {FILTERS.map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex-shrink-0
//                   ${filter === f
//                     ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
//                     : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
//                   }`}>
//                 {filterLabels[f]}
//                 {counts[f] > 0 && (
//                   <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black
//                     ${filter === f ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
//                     {counts[f]}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* LOADING */}
//           {loading && (
//             <div className="space-y-4">
//               {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}
//             </div>
//           )}

//           {/* EMPTY */}
//           {!loading && filtered.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
//                 <SearchX size={24} className="text-slate-400" />
//               </div>
//               <p className="text-sm font-black text-slate-700">No bookings found</p>
//               <p className="text-xs text-slate-400 mt-1">No {filter !== "ALL" ? filterLabels[filter].toLowerCase() : ""} bookings right now.</p>
//             </div>
//           )}

//           {/* LIST */}
//           {!loading && filtered.length > 0 && (
//             <div className="space-y-3">
//               {filtered.map(b => {
//                 const status = normalize(b.status);
//                 const config = statusConfig[status] || statusConfig.PENDING;
//                 const Icon = config.icon;
//                 const pmtConfig = paymentConfig[normalize(b.paymentStatus)] || paymentConfig.PENDING;
//                 const isActing = actionId === b.bookingId;
//                 const isConfirming = confirmId === b.bookingId;
//                 const canStart = b.paymentStatus === "PAID";
//                 const showPhone = PHONE_VISIBLE_STATUSES.includes(status);
//                 const isExpanded = expandedId === b.bookingId;

//                 return (
//                   <div key={b.bookingId} className={`rounded-2xl border-2 transition-all duration-200 ${config.border}`}>

//                     {/* ── COLLAPSED ROW (always visible) ── */}
//                     <div className="p-5">
//                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

//                         {/* LEFT */}
//                         <div className="flex items-start gap-4 min-w-0 flex-1">
//                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${config.iconBg}`}>
//                             <Icon size={16} className="text-white" />
//                           </div>

//                           <div className="min-w-0 space-y-2 flex-1">
//                             {/* Name + ID */}
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <p className="text-sm font-black text-slate-900">{b.customerName || "Customer"}</p>
//                               <span className="text-[10px] font-bold text-slate-400">#{b.bookingId}</span>
//                             </div>

//                             {/* Services */}
//                             <div className="flex flex-wrap gap-1.5">
//                               {b.services?.map((s, i) => (
//                                 <span key={i} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
//                                   {formatService(s)}
//                                   {HOURLY_SERVICES.includes(s) && <span className="ml-1 text-blue-400">/hr</span>}
//                                 </span>
//                               ))}
//                             </div>

//                             {/* Date + Time */}
//                             <div className="flex flex-wrap gap-3">
//                               <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
//                                 <CalendarDays size={11} /> {formatDate(b.serviceDate)}
//                               </span>
//                               <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
//                                 <Clock size={11} /> {formatTime(b.startTime)} – {formatTime(b.endTime)}
//                               </span>
//                             </div>

//                             {/* Payment warning */}
//                             {status === "CONFIRMED" && !canStart && (
//                               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-xl w-fit">
//                                 <AlertCircle size={11} className="text-red-500" />
//                                 <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">
//                                   Payment pending — cannot start work
//                                 </span>
//                               </div>
//                             )}

//                             {/* Terminated banner */}
//                             {status === "TERMINATED" && (
//                               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl w-fit">
//                                 <XCircle size={11} className="text-orange-500" />
//                                 <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
//                                   Service ended early — settlement processed
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* RIGHT — Status + Actions */}
//                         <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
//                           <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
//                             {config.label}
//                           </span>

//                           {/* PENDING */}
//                           {status === "PENDING" && !isConfirming && (
//                             <div className="flex gap-2">
//                               <button onClick={() => handleAccept(b.bookingId)} disabled={isActing}
//                                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-emerald-200 disabled:opacity-50">
//                                 <Check size={11} strokeWidth={4} />{isActing ? "..." : "Accept"}
//                               </button>
//                               <button onClick={() => { setConfirmId(b.bookingId); setConfirmType("reject"); }}
//                                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-red-200">
//                                 <X size={11} strokeWidth={4} />Reject
//                               </button>
//                             </div>
//                           )}

//                           {status === "PENDING" && isConfirming && confirmType === "reject" && (
//                             <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl">
//                               <p className="text-xs font-black text-red-600">Confirm rejection?</p>
//                               <div className="flex gap-2">
//                                 <button onClick={() => handleReject(b.bookingId)} disabled={isActing}
//                                   className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-black">
//                                   {isActing ? "..." : "Yes, Reject"}
//                                 </button>
//                                 <button onClick={() => setConfirmId(null)}
//                                   className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           )}

//                           {/* CONFIRMED */}
//                           {status === "CONFIRMED" && !isConfirming && (
//                             <button onClick={() => { setConfirmId(b.bookingId); setConfirmType("start"); }} disabled={!canStart}
//                               className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
//                                 ${!canStart ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"}`}>
//                               <Play size={11} strokeWidth={3} />Start Work
//                             </button>
//                           )}

//                           {status === "CONFIRMED" && isConfirming && confirmType === "start" && (
//                             <div className="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-100 rounded-2xl">
//                               <p className="text-xs font-black text-blue-600">Start this service?</p>
//                               <div className="flex gap-2">
//                                 <button onClick={() => handleStart(b.bookingId)} disabled={isActing}
//                                   className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black">
//                                   {isActing ? "..." : "Yes, Start"}
//                                 </button>
//                                 <button onClick={() => setConfirmId(null)}
//                                   className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           )}

//                           {/* IN PROGRESS */}
//                           {status === "SERVICE_IN_PROGRESS" && !isConfirming && (
//                             <button onClick={() => { setConfirmId(b.bookingId); setConfirmType("end"); }}
//                               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-red-200">
//                               <Square size={11} strokeWidth={3} />End Service
//                             </button>
//                           )}

//                           {status === "SERVICE_IN_PROGRESS" && isConfirming && confirmType === "end" && (
//                             <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl">
//                               <p className="text-xs font-black text-red-600">End this service?</p>
//                               <div className="flex gap-2">
//                                 <button onClick={() => handleTerminate(b.bookingId)} disabled={isActing}
//                                   className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-black">
//                                   {isActing ? "..." : "Yes, End"}
//                                 </button>
//                                 <button onClick={() => setConfirmId(null)}
//                                   className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* EXPAND TOGGLE */}
//                       <button
//                         onClick={() => toggleExpand(b.bookingId)}
//                         className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors"
//                       >
//                         <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
//                         {isExpanded ? "Hide details" : "View details"}
//                       </button>
//                     </div>

//                     {/* ── EXPANDED DETAILS ── */}
//                     {isExpanded && (
//                       <div className="border-t-2 border-dashed border-slate-100 mx-5 pt-4 pb-5 space-y-3">

//                         {/* Phone */}
//                         <div className="flex items-center gap-2">
//                           <Phone size={11} className="text-slate-400 flex-shrink-0" />
//                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0">Phone</span>
//                           {showPhone && b.customerPhone ? (
//                             <a href={`tel:${b.customerPhone}`} className="text-xs font-black text-blue-600 hover:underline">
//                               {b.customerPhone}
//                             </a>
//                           ) : (
//                             <span className="text-xs text-slate-400 font-medium">Available after confirmation</span>
//                           )}
//                         </div>

//                         {/* Address */}
//                         {b.serviceAddress && (
//                           <div className="flex items-start gap-2">
//                             <MapPin size={11} className="text-slate-400 flex-shrink-0 mt-0.5" />
//                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">Address</span>
//                             <div>
//                               <p className="text-xs text-slate-700 font-medium leading-relaxed">{b.serviceAddress}</p>
//                               <a
//                                 href={`https://maps.google.com/?q=${encodeURIComponent(b.serviceAddress)}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-[10px] font-black text-blue-500 hover:underline mt-0.5 inline-block"
//                               >
//                                 Open in Maps →
//                               </a>
//                             </div>
//                           </div>
//                         )}

//                         {/* Note */}
//                         {b.customerNote && (
//                           <div className="flex items-start gap-2">
//                             <MessageSquare size={11} className="text-slate-400 flex-shrink-0 mt-0.5" />
//                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">Note</span>
//                             <p className="text-xs text-slate-600 font-medium leading-relaxed">"{b.customerNote}"</p>
//                           </div>
//                         )}

//                         {/* Stats: days, amount, payment */}
//                         <div className="flex flex-wrap gap-2 pt-1">
//                           {b.totalDays > 0 && (
//                             <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
//                               <Calendar size={10} /> {b.totalDays} days total
//                             </span>
//                           )}
//                           {b.chargeableDays > 0 && (
//                             <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
//                               <IndianRupee size={10} /> {b.chargeableDays} chargeable
//                             </span>
//                           )}
//                           {b.holidays > 0 && (
//                             <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-500">
//                               {b.holidays} holiday{b.holidays > 1 ? "s" : ""}
//                             </span>
//                           )}
//                           <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black ${pmtConfig.badge}`}>
//                             <CreditCard size={10} /> {pmtConfig.label}
//                           </span>
//                           {b.totalAmount > 0 && (
//                             <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
//                               <IndianRupee size={10} /> {b.totalAmount.toLocaleString("en-IN")}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getProviderBookings, acceptBooking, rejectBooking } from "../../api/providerBookingApi";
import {
  Check, X, Play, Square, CalendarDays, Clock,
  Briefcase, AlertCircle, CheckCircle2, XCircle,
  Loader, SearchX, IndianRupee, CreditCard, Calendar,
  ArrowLeft, MapPin, MessageSquare, Phone, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

const statusConfig = {
  PENDING:             { label: "Pending",     iconBg: "bg-yellow-500",  border: "border-yellow-200 bg-yellow-50/20",    badge: "bg-yellow-100 text-yellow-700",   icon: AlertCircle  },
  CONFIRMED:           { label: "Confirmed",   iconBg: "bg-blue-600",    border: "border-blue-100 bg-blue-50/20",        badge: "bg-blue-100 text-blue-700",       icon: CheckCircle2 },
  SERVICE_IN_PROGRESS: { label: "In Progress", iconBg: "bg-orange-500",  border: "border-orange-100 bg-orange-50/20",    badge: "bg-orange-100 text-orange-700",   icon: Loader       },
  COMPLETED:           { label: "Completed",   iconBg: "bg-emerald-500", border: "border-emerald-100 bg-emerald-50/20",  badge: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  REJECTED:            { label: "Rejected",    iconBg: "bg-red-400",     border: "border-red-100 bg-red-50/20",          badge: "bg-red-100 text-red-600",         icon: XCircle      },
  CANCELLED:           { label: "Cancelled",   iconBg: "bg-slate-400",   border: "border-slate-200 bg-slate-50/50",      badge: "bg-slate-100 text-slate-600",     icon: XCircle      },
  TERMINATED:          { label: "Terminated",  iconBg: "bg-orange-500",  border: "border-orange-200 bg-orange-50/20",    badge: "bg-orange-100 text-orange-700",   icon: XCircle      },
};

const paymentConfig = {
  PAID:             { badge: "bg-emerald-100 text-emerald-700", label: "Paid"     },
  PENDING:          { badge: "bg-yellow-100 text-yellow-700",   label: "Unpaid"   },
  FAILED:           { badge: "bg-red-100 text-red-600",         label: "Failed"   },
  PAYMENT_REQUIRED: { badge: "bg-red-100 text-red-600",         label: "Required" },
};

const FILTERS = ["ALL", "PENDING", "CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "CANCELLED", "TERMINATED"];
const filterLabels = {
  ALL: "All", PENDING: "Pending", CONFIRMED: "Confirmed",
  SERVICE_IN_PROGRESS: "In Progress", COMPLETED: "Completed",
  CANCELLED: "Cancelled", TERMINATED: "Terminated",
};

const PHONE_VISIBLE_STATUSES = ["CONFIRMED", "SERVICE_IN_PROGRESS", "COMPLETED", "TERMINATED"];

export default function ProviderBookings() {
  const [bookings, setBookings]         = useState([]);
  const [filter, setFilter]             = useState("ALL");
  const [loading, setLoading]           = useState(true);
  const [actionId, setActionId]         = useState(null);
  const [confirmId, setConfirmId]       = useState(null);
  const [confirmType, setConfirmType]   = useState(null);
  const [expandedId, setExpandedId]     = useState(null);
  const [terminateReason, setTerminateReason] = useState("");

  // Tracks start-work errors per booking: { id, message }
  const [actionError, setActionError]   = useState(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const normalize    = (s) => (s || "").toUpperCase().trim();
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const handleAccept = async (id) => {
    setActionId(id);
    try { await acceptBooking(id); loadBookings(); }
    catch (err) { console.error(err); }
    finally { setActionId(null); }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try { await rejectBooking(id); loadBookings(); }
    catch (err) { console.error(err); }
    finally { setActionId(null); setConfirmId(null); }
  };

  const handleStart = async (id) => {
    setActionId(id);
    setActionError(null);
    try {
      await api.put(`/api/bookings/${id}/start`);
      loadBookings();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not start work. Please try again.";
      setActionError({ id, message });
    } finally {
      setActionId(null);
      setConfirmId(null);
    }
  };

  const handleTerminate = async (id) => {
    setActionId(id);
    try {
      await api.put(`/api/bookings/${id}/terminate`, {
        reason: terminateReason.trim() || null
      });
      loadBookings();
    } catch (err) { console.error(err); }
    finally {
      setActionId(null);
      setConfirmId(null);
      setTerminateReason("");
    }
  };

  const openEndConfirm = (id) => {
    setTerminateReason("");
    setConfirmId(id);
    setConfirmType("end");
  };

  const formatTime = (t) => {
    if (!t || t === "-") return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  // ✅ FIXED — uses local date instead of UTC to avoid IST timezone offset issues
  const getDateStatus = (serviceDate) => {
    if (!serviceDate) return null;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (serviceDate > today) return "before";
    if (serviceDate < today) return "after";
    return "today";
  };

  const filtered = filter === "ALL"
    ? bookings
    : bookings.filter(b => normalize(b.status) === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "ALL" ? bookings.length : bookings.filter(b => normalize(b.status) === f).length;
    return acc;
  }, {});

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">My Jobs</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            My <span className="text-blue-400">Bookings</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Manage customer requests and track your active jobs.</p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              {counts.PENDING > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <AlertCircle size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{counts.PENDING} pending</span>
                </div>
              )}
              {counts.SERVICE_IN_PROGRESS > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5">
                  <Loader size={12} className="text-orange-300" />
                  <span className="text-orange-200 text-xs font-bold">{counts.SERVICE_IN_PROGRESS} in progress</span>
                </div>
              )}
              {counts.TERMINATED > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5">
                  <XCircle size={12} className="text-orange-300" />
                  <span className="text-orange-200 text-xs font-bold">{counts.TERMINATED} terminated</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <Briefcase size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{bookings.length} total</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* FILTER TABS */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-8 no-scrollbar">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex-shrink-0
                  ${filter === f
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                  }`}>
                {filterLabels[f]}
                {counts[f] > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black
                    ${filter === f ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {counts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}
            </div>
          )}

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-700">No bookings found</p>
              <p className="text-xs text-slate-400 mt-1">No {filter !== "ALL" ? filterLabels[filter].toLowerCase() : ""} bookings right now.</p>
            </div>
          )}

          {/* LIST */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map(b => {
                const status       = normalize(b.status);
                const config       = statusConfig[status] || statusConfig.PENDING;
                const Icon         = config.icon;
                const pmtConfig    = paymentConfig[normalize(b.paymentStatus)] || paymentConfig.PENDING;
                const isActing     = actionId === b.bookingId;
                const isConfirming = confirmId === b.bookingId;
                const canStart     = b.paymentStatus === "PAID";
                const showPhone    = PHONE_VISIBLE_STATUSES.includes(status);
                const isExpanded   = expandedId === b.bookingId;
                const dateStatus   = getDateStatus(b.serviceDate); // "before" | "today" | "after"

                // Disable Start Work button if unpaid OR date hasn't arrived yet OR date has passed
                const startDisabled = !canStart || dateStatus === "before" || dateStatus === "after";

                return (
                  <div key={b.bookingId} className={`rounded-2xl border-2 transition-all duration-200 ${config.border}`}>

                    {/* ── COLLAPSED ROW ── */}
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                        {/* LEFT */}
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${config.iconBg}`}>
                            <Icon size={16} className="text-white" />
                          </div>

                          <div className="min-w-0 space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-black text-slate-900">{b.customerName || "Customer"}</p>
                              <span className="text-[10px] font-bold text-slate-400">#{b.bookingId}</span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {b.services?.map((s, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                                  {formatService(s)}
                                  {HOURLY_SERVICES.includes(s) && <span className="ml-1 text-blue-400">/hr</span>}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <CalendarDays size={11} /> {formatDate(b.serviceDate)}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <Clock size={11} /> {formatTime(b.startTime)} – {formatTime(b.endTime)}
                              </span>
                            </div>

                            {/* ── BANNER 1: Payment not done ── */}
                            {status === "CONFIRMED" && !canStart && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-xl w-fit">
                                <AlertCircle size={11} className="text-red-500" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">
                                  Payment pending — cannot start work
                                </span>
                              </div>
                            )}

                            {/* ── BANNER 2: Paid but start date is in the future ── */}
                            {status === "CONFIRMED" && canStart && dateStatus === "before" && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl w-fit">
                                <CalendarDays size={11} className="text-blue-500" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                  Starts on {formatDate(b.serviceDate)} — cannot start before that date
                                </span>
                              </div>
                            )}

                            {/* ── BANNER 3: Paid, date passed — contact admin ── */}
                            {status === "CONFIRMED" && canStart && dateStatus === "after" && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-xl w-fit">
                                <AlertCircle size={11} className="text-orange-500" />
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
                                  Start date has passed — please contact admin
                                </span>
                              </div>
                            )}

                            {/* ── BANNER 4: API error after clicking Start Work ── */}
                            {actionError?.id === b.bookingId && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl w-fit">
                                <XCircle size={11} className="text-red-500" />
                                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">
                                  {actionError.message}
                                </span>
                              </div>
                            )}

                            {status === "TERMINATED" && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl w-fit">
                                <XCircle size={11} className="text-orange-500" />
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
                                  Service ended early — settlement processed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* RIGHT — Status + Actions */}
                        <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                            {config.label}
                          </span>

                          {/* PENDING */}
                          {status === "PENDING" && !isConfirming && (
                            <div className="flex gap-2">
                              <button onClick={() => handleAccept(b.bookingId)} disabled={isActing}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-emerald-200 disabled:opacity-50">
                                <Check size={11} strokeWidth={4} />{isActing ? "..." : "Accept"}
                              </button>
                              <button onClick={() => { setConfirmId(b.bookingId); setConfirmType("reject"); }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-red-200">
                                <X size={11} strokeWidth={4} />Reject
                              </button>
                            </div>
                          )}

                          {status === "PENDING" && isConfirming && confirmType === "reject" && (
                            <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl">
                              <p className="text-xs font-black text-red-600">Confirm rejection?</p>
                              <div className="flex gap-2">
                                <button onClick={() => handleReject(b.bookingId)} disabled={isActing}
                                  className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-black">
                                  {isActing ? "..." : "Yes, Reject"}
                                </button>
                                <button onClick={() => setConfirmId(null)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* CONFIRMED — Start Work button */}
                          {status === "CONFIRMED" && !isConfirming && (
                            <button
                              onClick={() => {
                                setActionError(null);
                                setConfirmId(b.bookingId);
                                setConfirmType("start");
                              }}
                              disabled={startDisabled}
                              title={
                                !canStart
                                  ? "Payment not completed"
                                  : dateStatus === "before"
                                  ? `Work can only be started on ${formatDate(b.serviceDate)}`
                                  : dateStatus === "after"
                                  ? "Start date has passed — contact admin"
                                  : "Start this service"
                              }
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
                                ${startDisabled
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
                                }`}>
                              <Play size={11} strokeWidth={3} />Start Work
                            </button>
                          )}

                          {/* CONFIRMED — Start Work confirm dialog */}
                          {status === "CONFIRMED" && isConfirming && confirmType === "start" && (
                            <div className="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                              <p className="text-xs font-black text-blue-600">Start this service now?</p>
                              <p className="text-[10px] text-blue-500 font-medium">
                                Scheduled for {formatDate(b.serviceDate)}
                              </p>
                              <div className="flex gap-2">
                                <button onClick={() => handleStart(b.bookingId)} disabled={isActing}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black disabled:opacity-50">
                                  {isActing ? "Starting..." : "Yes, Start"}
                                </button>
                                <button
                                  onClick={() => { setConfirmId(null); setActionError(null); }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* IN PROGRESS — End Service button */}
                          {status === "SERVICE_IN_PROGRESS" && !isConfirming && (
                            <button
                              onClick={() => openEndConfirm(b.bookingId)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-red-200">
                              <Square size={11} strokeWidth={3} />End Service
                            </button>
                          )}

                          {/* IN PROGRESS — End Service confirm dialog */}
                          {status === "SERVICE_IN_PROGRESS" && isConfirming && confirmType === "end" && (
                            <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl w-full max-w-xs">
                              <p className="text-xs font-black text-red-600">End this service early?</p>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-red-500 uppercase tracking-wider">
                                  Reason <span className="text-slate-400 normal-case font-medium">(optional)</span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={terminateReason}
                                  onChange={(e) => setTerminateReason(e.target.value)}
                                  placeholder="e.g. Customer relocated, service no longer needed..."
                                  maxLength={500}
                                  className="w-full text-xs text-slate-700 font-medium bg-white border border-red-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 placeholder:text-slate-300"
                                />
                                <p className="text-[10px] text-slate-400 text-right">
                                  {terminateReason.length}/500
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTerminate(b.bookingId)}
                                  disabled={isActing}
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50">
                                  {isActing ? "Ending..." : "Yes, End Service"}
                                </button>
                                <button
                                  onClick={() => { setConfirmId(null); setTerminateReason(""); }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black transition-all">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* EXPAND TOGGLE */}
                      <button
                        onClick={() => toggleExpand(b.bookingId)}
                        className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors"
                      >
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        {isExpanded ? "Hide details" : "View details"}
                      </button>
                    </div>

                    {/* ── EXPANDED DETAILS ── */}
                    {isExpanded && (
                      <div className="border-t-2 border-dashed border-slate-100 mx-5 pt-4 pb-5 space-y-3">

                        {/* Phone */}
                        <div className="flex items-center gap-2">
                          <Phone size={11} className="text-slate-400 flex-shrink-0" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0">Phone</span>
                          {showPhone && b.customerPhone ? (
                            <a href={`tel:${b.customerPhone}`} className="text-xs font-black text-blue-600 hover:underline">
                              {b.customerPhone}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Available after confirmation</span>
                          )}
                        </div>

                        {/* Address */}
                        {b.serviceAddress && (
                          <div className="flex items-start gap-2">
                            <MapPin size={11} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">Address</span>
                            <div>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed">{b.serviceAddress}</p>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(b.serviceAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black text-blue-500 hover:underline mt-0.5 inline-block"
                              >
                                Open in Maps →
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Note */}
                        {b.customerNote && (
                          <div className="flex items-start gap-2">
                            <MessageSquare size={11} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">Note</span>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">"{b.customerNote}"</p>
                          </div>
                        )}

                        {/* Termination reason */}
                        {status === "TERMINATED" && b.terminationReason && (
                          <div className="flex items-start gap-2">
                            <XCircle size={11} className="text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">Reason</span>
                            <p className="text-xs text-orange-700 font-medium leading-relaxed bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                              "{b.terminationReason}"
                            </p>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {b.totalDays > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
                              <Calendar size={10} /> {b.totalDays} days total
                            </span>
                          )}
                          {b.chargeableDays > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
                              <IndianRupee size={10} /> {b.chargeableDays} chargeable
                            </span>
                          )}
                          {b.holidays > 0 && (
                            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-500">
                              {b.holidays} holiday{b.holidays > 1 ? "s" : ""}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black ${pmtConfig.badge}`}>
                            <CreditCard size={10} /> {pmtConfig.label}
                          </span>
                          {b.totalAmount > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-600">
                              <IndianRupee size={10} /> {b.totalAmount.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}