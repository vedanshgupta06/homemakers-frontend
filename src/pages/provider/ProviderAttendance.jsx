// import { useEffect, useState } from "react";
// import { getTodayAttendance, markPresent } from "../../api/attendanceApi";
// import { CalendarCheck, Clock, User, CheckCircle2, AlertCircle, XCircle, SearchX, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// export default function ProviderAttendance() {
//   const [logs, setLogs] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadLogs = async () => {
//     try {
//       const res = await getTodayAttendance();
//       setLogs(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadLogs(); }, []);

//   const handleMarkPresent = async (id) => {
//     setLoadingId(id);
//     try {
//       await markPresent(id);
//       loadLogs();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const normalize = (s) => (s || "").toUpperCase().trim();

//   const pendingCount   = logs.filter(l => normalize(l.status) === "PENDING").length;
//   const presentCount   = logs.filter(l => normalize(l.status) === "PRESENT").length;

//   const statusConfig = {
//     PENDING: { icon: AlertCircle,  iconBg: "bg-yellow-500", border: "border-yellow-200 bg-yellow-50/30", badge: "bg-yellow-100 text-yellow-700", label: "Pending"  },
//     PRESENT: { icon: CheckCircle2, iconBg: "bg-emerald-500", border: "border-emerald-100 bg-emerald-50/20", badge: "bg-emerald-100 text-emerald-700", label: "Present" },
//     ABSENT:  { icon: XCircle,      iconBg: "bg-red-400",    border: "border-red-100 bg-red-50/20",    badge: "bg-red-100 text-red-600",     label: "Absent"  },
//   };

//   const today = new Date().toLocaleDateString("en-IN", {
//     weekday: "long", day: "numeric", month: "long", year: "numeric"
//   });
//  const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}
//       <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
//         <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative">
//            <button
//           onClick={() => navigate(-1)}
//           className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
//         >
//           <ArrowLeft 
//             size={18} 
//             strokeWidth={2.5} 
//             className="text-slate-900 transition-transform group-hover:-translate-x-0.5" 
//           />
//         </button>
//           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//             <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Attendance</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
//             Today's <span className="text-blue-400">Attendance</span>
//           </h2>
//           <p className="text-slate-400 text-sm mt-3 font-medium">{today}</p>

//           {/* Stat pills */}
//           {!loading && logs.length > 0 && (
//             <div className="mt-5 flex flex-wrap gap-3">
//               <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
//                 <CalendarCheck size={12} className="text-slate-300" />
//                 <span className="text-white text-xs font-bold">{logs.length} total</span>
//               </div>
//               {pendingCount > 0 && (
//                 <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
//                   <AlertCircle size={12} className="text-yellow-300" />
//                   <span className="text-yellow-200 text-xs font-bold">{pendingCount} pending</span>
//                 </div>
//               )}
//               {presentCount > 0 && (
//                 <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
//                   <CheckCircle2 size={12} className="text-emerald-300" />
//                   <span className="text-emerald-200 text-xs font-bold">{presentCount} marked present</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="px-[5%] pb-16">
//         <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

//           {/* Section header */}
//           <div className="flex items-center gap-3 mb-1">
//             <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//               <CalendarCheck size={14} className="text-white" />
//             </div>
//             <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Attendance Log</h3>
//           </div>
//           <p className="text-slate-400 text-xs ml-11 mb-8">Mark your attendance for each active booking</p>

//           {/* Loading */}
//           {loading && (
//             <div className="space-y-3">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
//               ))}
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && logs.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
//                 <SearchX size={24} className="text-slate-400" />
//               </div>
//               <p className="text-sm font-black text-slate-700">No attendance today</p>
//               <p className="text-xs text-slate-400 mt-1">You have no bookings scheduled for today.</p>
//             </div>
//           )}

//           {/* Logs */}
//           {!loading && logs.length > 0 && (
//             <div className="space-y-3">
//               {logs.map((log) => {
//                 const status = normalize(log.status);
//                 const config = statusConfig[status] || statusConfig.ABSENT;
//                 const Icon = config.icon;
//                 const isPending = status === "PENDING";

//                 return (
//                   <div
//                     key={log.id}
//                     className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${config.border}`}
//                   >
//                     {/* LEFT */}
//                     <div className="flex items-center gap-4 min-w-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
//                         <Icon size={16} className="text-white" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-black text-slate-900 truncate">
//                           {log.customerName || "Customer"}
//                         </p>
//                         <div className="flex items-center gap-3 mt-0.5 flex-wrap">
//                           <span className="text-[10px] text-slate-400 font-medium">#{log.bookingId}</span>
//                           {log.workDate && (
//                             <>
//                               <span className="w-1 h-1 rounded-full bg-slate-300" />
//                               <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
//                                 <Clock size={9} /> {log.workDate}
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
//                         {config.label}
//                       </span>

//                       {isPending && (
//                         <button
//                           onClick={() => handleMarkPresent(log.id)}
//                           disabled={loadingId === log.id}
//                           className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
//                             ${loadingId === log.id
//                               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                               : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
//                             }`}
//                         >
//                           <CheckCircle2 size={12} />
//                           {loadingId === log.id ? "Marking..." : "Mark Present"}
//                         </button>
//                       )}
//                     </div>
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
import { getTodayAttendance, markPresent, markLeave } from "../../api/attendanceApi";
import {
  CalendarCheck, Clock, CheckCircle2, AlertCircle,
  XCircle, SearchX, ArrowLeft, Minus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  PENDING: {
    icon: AlertCircle,
    iconBg: "bg-yellow-500",
    border: "border-yellow-200 bg-yellow-50/30",
    badge: "bg-yellow-100 text-yellow-700",
    label: "Pending"
  },
  PRESENT: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500",
    border: "border-emerald-100 bg-emerald-50/20",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Present"
  },
  CONFIRMED_PRESENT: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-600",
    border: "border-emerald-200 bg-emerald-50/30",
    badge: "bg-emerald-200 text-emerald-800",
    label: "Confirmed"
  },
  REJECTED: {
    icon: XCircle,
    iconBg: "bg-slate-400",
    border: "border-slate-100 bg-slate-50/20",
    badge: "bg-slate-100 text-slate-500",
    label: "Rejected"
  },
  ABSENT: {
    icon: XCircle,
    iconBg: "bg-red-400",
    border: "border-red-100 bg-red-50/20",
    badge: "bg-red-100 text-red-600",
    label: "Absent"
  },
  LEAVE: {
    icon: Minus,
    iconBg: "bg-orange-400",
    border: "border-orange-100 bg-orange-50/20",
    badge: "bg-orange-100 text-orange-700",
    label: "Leave"
  },
};

export default function ProviderAttendance() {
  const [logs, setLogs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null); // "present" | "leave"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadLogs = async () => {
    try {
      const res = await getTodayAttendance();
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const normalize = (s) => (s || "").toUpperCase().trim();

  const handleAction = async (id, type) => {
    setLoadingId(id);
    setActionType(type);
    try {
      if (type === "present") await markPresent(id);
      else await markLeave(id);
      loadLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  const pendingCount = logs.filter(l => normalize(l.status) === "PENDING").length;
  const presentCount = logs.filter(l =>
    ["PRESENT", "CONFIRMED_PRESENT"].includes(normalize(l.status))
  ).length;
  const leaveCount = logs.filter(l => normalize(l.status) === "LEAVE").length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Attendance</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Today's <span className="text-blue-400">Attendance</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">{today}</p>

          {!loading && logs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <CalendarCheck size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{logs.length} total</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <AlertCircle size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{pendingCount} pending</span>
                </div>
              )}
              {presentCount > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs font-bold">{presentCount} present</span>
                </div>
              )}
              {leaveCount > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5">
                  <Minus size={12} className="text-orange-300" />
                  <span className="text-orange-200 text-xs font-bold">{leaveCount} on leave</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <CalendarCheck size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Attendance Log</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">Mark attendance for each active booking</p>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-700">No attendance today</p>
              <p className="text-xs text-slate-400 mt-1">You have no bookings scheduled for today.</p>
            </div>
          )}

          {!loading && logs.length > 0 && (
            <div className="space-y-3">
              {logs.map((log) => {
                const status = normalize(log.status);
                const config = statusConfig[status] || statusConfig.ABSENT;
                const Icon = config.icon;
                const isPending = status === "PENDING";
                const isThisLoading = loadingId === log.id;

                return (
                  <div
                    key={log.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${config.border}`}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {log.customerName || "Customer"}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-medium">#{log.bookingId}</span>
                          {log.workDate && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Clock size={9} /> {log.workDate}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                        {config.label}
                      </span>

                      {isPending && (
                        <>
                          <button
                            onClick={() => handleAction(log.id, "present")}
                            disabled={isThisLoading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
                              ${isThisLoading && actionType === "present"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
                              }`}
                          >
                            <CheckCircle2 size={12} />
                            {isThisLoading && actionType === "present" ? "Marking..." : "Present"}
                          </button>

                          <button
                            onClick={() => handleAction(log.id, "leave")}
                            disabled={isThisLoading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
                              ${isThisLoading && actionType === "leave"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 active:scale-95"
                              }`}
                          >
                            <Minus size={12} />
                            {isThisLoading && actionType === "leave" ? "Marking..." : "Leave"}
                          </button>
                        </>
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
  );
}