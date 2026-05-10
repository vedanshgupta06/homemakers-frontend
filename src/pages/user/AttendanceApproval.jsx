// import { useEffect, useState } from "react";
// import {
//   getCustomerAttendance,
//   confirmAttendance,
//   rejectAttendance
// } from "../../api/attendanceApi";

// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";

// export default function AttendanceApproval() {

//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadLogs = async () => {
//     try {
//       const res = await getCustomerAttendance();
//       setLogs(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLogs();
//   }, []);

//   const handleConfirm = async (id) => {
//     await confirmAttendance(id);
//     loadLogs();
//   };

//   const handleReject = async (id) => {
//     await rejectAttendance(id);
//     loadLogs();
//   };

//   const statusStyles = {
//     PRESENT: "bg-yellow-100 text-yellow-700",
//     CONFIRMED_PRESENT: "bg-green-100 text-green-700",
//     REJECTED: "bg-red-100 text-red-700",
//   };

//   return (
//     <Container>

//       {/* 🔥 HEADER + STATS */}
//       <div className="mb-8 space-y-6">

//         {/* HEADER */}
//         <div>
//           <h2 className="
//             text-3xl font-bold 
//             bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
//             bg-clip-text text-transparent
//           ">
//             Attendance Dashboard
//           </h2>

//           <p className="text-gray-500 mt-1">
//             Track and verify today's attendance
//           </p>
//         </div>

//         {/* 🔥 STATS */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//           <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
//             <p className="text-sm text-gray-500">Total</p>
//             <p className="text-xl font-semibold">{logs.length}</p>
//           </div>

//           <div className="p-4 rounded-xl bg-yellow-100/60">
//             <p className="text-sm text-yellow-700">Pending</p>
//             <p className="text-xl font-semibold text-yellow-800">
//               {logs.filter(l => l.status === "PRESENT").length}
//             </p>
//           </div>

//           <div className="p-4 rounded-xl bg-green-100/60">
//             <p className="text-sm text-green-700">Confirmed</p>
//             <p className="text-xl font-semibold text-green-800">
//               {logs.filter(l => l.status === "CONFIRMED_PRESENT").length}
//             </p>
//           </div>

//           <div className="p-4 rounded-xl bg-red-100/60">
//             <p className="text-sm text-red-700">Rejected</p>
//             <p className="text-xl font-semibold text-red-800">
//               {logs.filter(l => l.status === "REJECTED").length}
//             </p>
//           </div>

//         </div>

//       </div>

//       {/* LOADING */}
//       {loading && (
//         <p className="text-gray-400">Loading attendance...</p>
//       )}

//       {/* EMPTY */}
//       {!loading && logs.length === 0 && (
//         <div className="text-center py-20">
//           <p className="text-lg font-medium">
//             No attendance today 🎉
//           </p>
//           <p className="text-gray-400 mt-2">
//             Everything is up to date
//           </p>
//         </div>
//       )}

//       {/* SINGLE ITEM NOTE */}
//       {logs.length === 1 && (
//         <div className="text-center text-gray-400 text-sm mb-4">
//           Only one attendance today
//         </div>
//       )}

//       {/* LIST */}
//       <div className="space-y-5">

//         {logs
//           .sort((a, b) => {
//             const order = {
//               PRESENT: 0,
//               PENDING: 1,
//               CONFIRMED_PRESENT: 2,
//               REJECTED: 3
//             };
//             return order[a.status] - order[b.status];
//           })
//           .map((log) => (

//           <Card
//             key={log.id}
//             className="
//               flex justify-between items-center
//               border border-gray-200
//               hover:shadow-xl
//               transition-all duration-300
//             "
//           >

//             {/* LEFT */}
//             <div>

//               <h3 className="font-semibold text-lg">
//                 {log.providerName}
//               </h3>

//               <p className="text-sm text-gray-500">
//                 Booking #{log.bookingId}
//               </p>

//               <p className="text-sm text-gray-500">
//                 📅 {log.workDate}
//               </p>

//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-4">

//               {/* STATUS */}
//               <span
//                 className={`
//                   px-3 py-1 rounded-full text-xs font-semibold
//                   ${statusStyles[log.status]}
//                 `}
//               >
//                 {log.status.replace("_", " ")}
//               </span>

//               {/* ACTIONS */}
//               {log.status === "PRESENT" && (
//                 <div className="flex gap-2">

//                   <button
//                     onClick={() => handleConfirm(log.id)}
//                     className="
//                       px-4 py-1 text-sm rounded-full text-white font-medium
//                       bg-gradient-to-r from-green-500 to-emerald-600
//                       hover:scale-[1.05] active:scale-[0.95]
//                       transition-all shadow-sm
//                     "
//                   >
//                     ✔ Confirm
//                   </button>

//                   <button
//                     onClick={() => handleReject(log.id)}
//                     className="
//                       px-4 py-1 text-sm rounded-full text-white font-medium
//                       bg-gradient-to-r from-red-500 to-pink-600
//                       hover:scale-[1.05] active:scale-[0.95]
//                       transition-all shadow-sm
//                     "
//                   >
//                     ✖ Reject
//                   </button>

//                 </div>
//               )}

//               {log.status === "PENDING" && (
//                 <span className="text-xs text-gray-400 italic">
//                   Waiting for provider...
//                 </span>
//               )}

//               {log.status === "CONFIRMED_PRESENT" && (
//                 <span className="text-green-600 text-sm font-medium">
//                   ✔ Confirmed
//                 </span>
//               )}

//               {log.status === "REJECTED" && (
//                 <span className="text-red-600 text-sm font-medium">
//                   ✖ Rejected
//                 </span>
//               )}

//             </div>

//           </Card>

//         ))}

//       </div>

//     </Container>
//   );
// }


import { useEffect, useState } from "react";
import {
  getCustomerAttendance,
  confirmAttendance,
  rejectAttendance
} from "../../api/attendanceApi";
import { useNavigate } from "react-router-dom";
import {
  Check, X, Clock, ClipboardList, SearchX,
  Calendar, ArrowLeft, AlertTriangle, Undo2
} from "lucide-react";

function ConfirmModal({ open, onClose, onConfirm, type, providerName, loading }) {
  if (!open) return null;
  const isConfirm = type === "confirm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <X size={16} className="text-slate-400" />
        </button>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto
          ${isConfirm ? "bg-emerald-100" : "bg-red-100"}`}>
          {isConfirm
            ? <Check size={24} className="text-emerald-600" strokeWidth={3} />
            : <X size={24} className="text-red-500" strokeWidth={3} />
          }
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center uppercase tracking-tight">
          {isConfirm ? "Confirm Attendance?" : "Reject Attendance?"}
        </h3>

        <div className={`flex items-start gap-2 mt-4 p-3 rounded-xl
          ${isConfirm ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
          <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${isConfirm ? "text-emerald-600" : "text-red-500"}`} />
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            {isConfirm
              ? <>You are confirming that <span className="font-black text-slate-800">{providerName}</span> was present today. Their earning will be credited.</>
              : <>You are rejecting <span className="font-black text-slate-800">{providerName}</span>'s attendance. They will be notified.</>
            }
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 rounded-xl text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
              ${isConfirm
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                : "bg-red-500 hover:bg-red-600 shadow-red-200"
              }`}
          >
            {loading ? "Processing..." : isConfirm ? "Yes, Confirm" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-black transition-all
      ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
      {toast.type === "success" ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
      {toast.message}
    </div>
  );
}

export default function AttendanceApproval() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({
    open: false, type: null, logId: null, providerName: "", processing: false,
  });
  const [lastAction, setLastAction] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const navigate = useNavigate();

  const loadLogs = async () => {
    try {
      const res = await getCustomerAttendance();
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (type, log) => {
    setModal({ open: true, type, logId: log.id, providerName: log.providerName, processing: false });
  };

  const closeModal = () => {
    if (modal.processing) return;
    setModal({ open: false, type: null, logId: null, providerName: "", processing: false });
  };

  const startUndoTimer = (logId, previousStatus) => {
    setLastAction({ logId, previousStatus });
    if (undoTimer) clearTimeout(undoTimer);
    const timer = setTimeout(() => setLastAction(null), 5000);
    setUndoTimer(timer);
  };

  const handleConfirm = async () => {
    setModal(prev => ({ ...prev, processing: true }));
    try {
      const prevLog = logs.find(l => l.id === modal.logId);
      await confirmAttendance(modal.logId);
      await loadLogs();
      closeModal();
      showToast("Attendance confirmed successfully!", "success");
      startUndoTimer(modal.logId, prevLog?.status);
    } catch {
      showToast("Failed to confirm attendance.", "error");
      setModal(prev => ({ ...prev, processing: false }));
    }
  };

  const handleReject = async () => {
    setModal(prev => ({ ...prev, processing: true }));
    try {
      const prevLog = logs.find(l => l.id === modal.logId);
      await rejectAttendance(modal.logId);
      await loadLogs();
      closeModal();
      showToast("Attendance rejected.", "error");
      startUndoTimer(modal.logId, prevLog?.status);
    } catch {
      showToast("Failed to reject attendance.", "error");
      setModal(prev => ({ ...prev, processing: false }));
    }
  };

  // ✅ Revert Decision — clears timer and shows info
  // Full undo needs backend endpoint (see note below)
  const handleRevertDecision = () => {
    if (undoTimer) clearTimeout(undoTimer);
    setLastAction(null);
    showToast("To fully revert, please contact support.", "error");
  };

  const pending   = logs.filter(l => l.status === "PRESENT").length;
  const confirmed = logs.filter(l => l.status === "CONFIRMED_PRESENT").length;
  const rejected  = logs.filter(l => l.status === "REJECTED").length;

  const sortedLogs = [...logs].sort((a, b) => {
    const order = { PRESENT: 0, PENDING: 1, CONFIRMED_PRESENT: 2, REJECTED: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <ConfirmModal
        open={modal.open}
        onClose={closeModal}
        onConfirm={modal.type === "confirm" ? handleConfirm : handleReject}
        type={modal.type}
        providerName={modal.providerName}
        loading={modal.processing}
      />

      <Toast toast={toast} />

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
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Live Tracking</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Attendance <span className="text-blue-400">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Track and verify your providers' attendance
          </p>

          {!loading && (
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <ClipboardList size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{logs.length} Total</span>
              </div>
              {pending > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <Clock size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{pending} Pending</span>
                </div>
              )}
              {confirmed > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <Check size={12} className="text-emerald-300" strokeWidth={3} />
                  <span className="text-emerald-200 text-xs font-bold">{confirmed} Confirmed</span>
                </div>
              )}
              {rejected > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
                  <X size={12} className="text-red-300" strokeWidth={3} />
                  <span className="text-red-200 text-xs font-bold">{rejected} Rejected</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <ClipboardList size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Today's Attendance</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">Pending approvals appear first</p>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-black text-slate-800 uppercase tracking-tight">All Clear</p>
              <p className="text-sm text-slate-400 mt-2">No attendance records for today</p>
            </div>
          )}

          {!loading && sortedLogs.length > 0 && (
            <div className="space-y-4">
              {sortedLogs.map((log) => {
                const isPending    = log.status === "PRESENT";
                const isConfirmed  = log.status === "CONFIRMED_PRESENT";
                const isRejected   = log.status === "REJECTED";
                // ✅ Show "Revert Decision" only on the last acted card, within 5s window
                const isLastActed  = lastAction?.logId === log.id;

                return (
                  <div
                    key={log.id}
                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      p-5 rounded-2xl border-2 transition-all duration-200
                      ${isPending   ? "border-yellow-200 bg-yellow-50/40"
                      : isConfirmed ? "border-emerald-100 bg-emerald-50/30"
                      : isRejected  ? "border-red-100 bg-red-50/20"
                      : "border-slate-100 bg-slate-50/50"}
                      ${isLastActed ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${isPending ? "bg-yellow-500" : isConfirmed ? "bg-emerald-500" : isRejected ? "bg-red-400" : "bg-slate-300"}`}>
                        <span className="text-white text-sm font-black">
                          {log.providerName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{log.providerName}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400 font-medium">#{log.bookingId}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Calendar size={10} />
                            {log.workDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 sm:flex-shrink-0 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${isPending   ? "bg-yellow-100 text-yellow-700"
                        : isConfirmed ? "bg-emerald-100 text-emerald-700"
                        : isRejected  ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"}`}>
                        {isPending ? "Pending" : isConfirmed ? "Confirmed" : isRejected ? "Rejected" : log.status}
                      </span>

                      {/* Action buttons */}
                      {isPending && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal("confirm", log)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl text-white font-black bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-200"
                          >
                            <Check size={11} strokeWidth={4} />
                            Confirm
                          </button>
                          <button
                            onClick={() => openModal("reject", log)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl text-white font-black bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-200"
                          >
                            <X size={11} strokeWidth={4} />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* ✅ Revert Decision — inline on card, 5s window */}
                      {isLastActed && !isPending && (
                        <button
                          onClick={handleRevertDecision}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl font-black text-slate-600 bg-white border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-all"
                        >
                          <Undo2 size={11} strokeWidth={3} />
                          Revert Decision
                        </button>
                      )}

                      {log.status === "PENDING" && (
                        <span className="text-xs text-slate-400 italic font-medium">Waiting for provider...</span>
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